import os
import cv2
import numpy as np
from insightface.app import FaceAnalysis
from sklearn.preprocessing import normalize
import faiss
import requests
from .mongo_handler import get_all_students
from .models import Attendance
from django.utils import timezone
from PIL import Image
from io import BytesIO
import logging
import time
from django.conf import settings

# Configure logging
logging.basicConfig(level=logging.INFO)

# Debug flag and folders for saving intermediate images and face crops
DEBUG = True
DEBUG_FOLDER = "debug_output"
if DEBUG and not os.path.exists(DEBUG_FOLDER):
    os.makedirs(DEBUG_FOLDER)

SAVE_FACE_CROPS = True
FACE_CROPS_FOLDER = "detected_face_crops"
if SAVE_FACE_CROPS and not os.path.exists(FACE_CROPS_FOLDER):
    os.makedirs(FACE_CROPS_FOLDER)

# Global configuration parameters
HIGH_SIMILARITY_THRESHOLD = 0.4  # Adjust this value as needed.
USE_TILE_DETECTION = True         # Enable tiled detection for crowded images
USE_SUPER_RESOLUTION = True       # Enable super resolution for small faces (or entire image)
RE_RUN_EMBEDDING = True           # If True, re-run embedding extraction on cropped faces
MIN_FACE_SIZE = 50                # Minimum face crop size (in pixels) before applying super resolution
MIN_IMAGE_DIM = 640               # Minimum width/height of entire image; below this, upscale the image
SUPER_RES_MODEL_PATH = settings.SUPER_RES_MODEL_PATH  # Path to your EDSR_x4.pb model

def debug_save_image(img, name):
    """Save an image to the debug folder if debugging is enabled."""
    if DEBUG:
        path = os.path.join(DEBUG_FOLDER, name)
        cv2.imwrite(path, img)
        logging.info(f"Saved debug image: {path}")

def draw_faces(image, faces):
    """Draw bounding boxes for detected faces on a copy of the image."""
    img_copy = image.copy()
    for face in faces:
        x1, y1, x2, y2 = map(int, face.bbox)
        cv2.rectangle(img_copy, (x1, y1), (x2, y2), (0, 255, 0), 2)
    return img_copy

def init_super_res_model():
    """Initialize and return the DNN super resolution model."""
    sr = cv2.dnn_superres.DnnSuperResImpl_create()
    if not os.path.exists(SUPER_RES_MODEL_PATH):
        logging.error(f"Super resolution model not found at {SUPER_RES_MODEL_PATH}.")
        return None
    sr.readModel(SUPER_RES_MODEL_PATH)
    sr.setModel("edsr", 4)  # Using EDSR with a 4x scale factor
    return sr

# Initialize super resolution model if enabled
super_res_model = init_super_res_model() if USE_SUPER_RESOLUTION else None

def enhance_image(image):
    """
    Enhance image quality using CLAHE (Contrast Limited Adaptive Histogram Equalization).
    Assumes the input image is in BGR format.
    """
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l)
    lab_enhanced = cv2.merge((l_enhanced, a, b))
    return cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)

def preprocess_input_image(image, sr_model, min_dim=MIN_IMAGE_DIM):
    """
    Enhance the entire input image and, if its dimensions are below the threshold,
    upscale the whole image using super resolution.
    Expects the input image in BGR (if from OpenCV) or converts from PIL (RGB) to BGR.
    """
    # Convert PIL image to BGR if necessary.
    if isinstance(image, Image.Image):
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    elif not isinstance(image, np.ndarray):
        logging.error("Input image is neither a PIL Image nor a numpy array.")
        return None

    enhanced = enhance_image(image)
    h, w = enhanced.shape[:2]
    if DEBUG:
        debug_save_image(enhanced, "enhanced_input.jpg")
    if h < min_dim or w < min_dim:
        if sr_model is not None:
            logging.info(f"Input image resolution is low ({w}x{h}); upscaling entire image.")
            enhanced = sr_model.upsample(enhanced)
            if DEBUG:
                debug_save_image(enhanced, "upscaled_input.jpg")
    return enhanced

def convert_bbox(bbox):
    """Convert bbox from [x1, y1, x2, y2] to [x, y, w, h]."""
    x1, y1, x2, y2 = bbox
    return [int(x1), int(y1), int(x2 - x1), int(y2 - y1)]

def nms_faces(faces, iou_threshold=0.3):
    """
    Apply Non-Maximum Suppression (NMS) on detected faces to remove duplicates.
    Assumes each face has a 'bbox' attribute and optionally a 'det_score'.
    """
    if not faces:
        return faces
    boxes = [convert_bbox(face.bbox) for face in faces]
    scores = [getattr(face, 'det_score', 1.0) for face in faces]
    indices = cv2.dnn.NMSBoxes(boxes, scores, score_threshold=0.0, nms_threshold=iou_threshold)
    if len(indices) == 0:
        return []
    indices = [i[0] if isinstance(i, (list, tuple, np.ndarray)) else i for i in indices]
    return [faces[i] for i in indices]

def detect_faces_tiled(model, image, tile_size=(640, 640), overlap=0.2):
    """
    Split the image into overlapping tiles and detect faces in each tile.
    Adjust bounding boxes back to the original image coordinates.
    """
    h, w = image.shape[:2]
    tile_w, tile_h = tile_size
    stride_w = int(tile_w * (1 - overlap))
    stride_h = int(tile_h * (1 - overlap))
    all_faces = []
    for y in range(0, h, stride_h):
        for x in range(0, w, stride_w):
            tile = image[y:min(y + tile_h, h), x:min(x + tile_w, w)]
            faces = model.get(tile)
            for face in faces:
                face.bbox = face.bbox + np.array([x, y, x, y])
                if hasattr(face, 'kps') and face.kps is not None:
                    face.kps = face.kps + np.array([x, y])
                all_faces.append(face)
    faces_nms = nms_faces(all_faces)
    if DEBUG:
        debug_img = draw_faces(image, faces_nms)
        debug_save_image(debug_img, "tiled_detections.jpg")
    return faces_nms

def detect_faces_multiscale(model, image, scales=[1.0, 1.5, 2.0, 3.0, 4.0]):
    """
    Run face detection at multiple scales to capture small or distant faces.
    """
    all_faces = []
    for scale in scales:
        scaled_img = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        faces = model.get(scaled_img)
        logging.info(f"Scale {scale}: detected {len(faces)} faces.")
        for face in faces:
            face.bbox = face.bbox / scale
            if hasattr(face, 'kps') and face.kps is not None:
                face.kps = face.kps / scale
            all_faces.append(face)
    faces_nms = nms_faces(all_faces)
    if DEBUG:
        debug_img = draw_faces(image, faces_nms)
        debug_save_image(debug_img, "multiscale_detections.jpg")
    return faces_nms

def maybe_super_resolve_face(face_crop, sr_model, min_size=MIN_FACE_SIZE):
    """
    If the face crop is smaller than the minimum size, apply super resolution.
    """
    h, w = face_crop.shape[:2]
    if h < min_size or w < min_size:
        if sr_model is not None:
            logging.info(f"Super resolving face of size ({w}x{h})")
            face_crop = sr_model.upsample(face_crop)
            if DEBUG:
                debug_save_image(face_crop, "super_resolved_face.jpg")
    return face_crop

def align_face(image, landmarks, output_size=(112, 112)):
    """
    Align the face using an affine transformation based on facial landmarks.
    Uses three keypoints (e.g. left eye, right eye, nose).
    """
    # Reference points (using first three of a 5-point set)
    ref_points = np.array([
        [38.2946, 51.6963],
        [73.5318, 51.5014],
        [56.0252, 71.7366],
        [41.5493, 92.3655],
        [70.7299, 92.2041]
    ], dtype=np.float32)
    src = landmarks[[0, 1, 2]].astype(np.float32)
    dst = ref_points[[0, 1, 2]]
    M = cv2.getAffineTransform(src, dst)
    aligned = cv2.warpAffine(image, M, output_size, flags=cv2.INTER_CUBIC)
    if DEBUG:
        debug_save_image(aligned, "aligned_face.jpg")
    return aligned

def preprocess_face(image, bbox, face_obj=None, use_super_res=False, sr_model=None):
    """
    Enhance, crop, and optionally align a face.
    If the resulting face crop is very small, apply super resolution.
    """
    enhanced_image = enhance_image(image)
    if face_obj is not None and hasattr(face_obj, 'kps') and face_obj.kps is not None:
        try:
            face_crop = align_face(enhanced_image, face_obj.kps)
        except Exception as e:
            logging.error(f"Alignment error: {e}. Using bbox crop.")
            x1, y1, x2, y2 = map(int, bbox)
            face_crop = enhanced_image[y1:y2, x1:x2]
    else:
        x1, y1, x2, y2 = map(int, bbox)
        face_crop = enhanced_image[y1:y2, x1:x2]
    
    if face_crop is None or face_crop.size == 0:
        return None

    if use_super_res and sr_model is not None:
        face_crop = maybe_super_resolve_face(face_crop, sr_model)
    
    crop_resized = cv2.resize(face_crop, (112, 112), interpolation=cv2.INTER_CUBIC)
    if DEBUG:
        debug_save_image(crop_resized, "face_crop.jpg")
    return crop_resized

def get_face_embedding(model, face_crop):
    """
    Re-run embedding extraction on the face crop.
    Returns a normalized embedding if successful.
    """
    results = model.get(face_crop)
    if results and hasattr(results[0], 'embedding'):
        embedding = results[0].embedding
        return normalize(embedding.reshape(1, -1))[0]
    return None

def extract_embeddings(model, image, use_tile_detection=False, scales=[1.0, 1.5, 2.0, 3.0, 4.0],
                       use_super_res=False, sr_model=None):
    """
    Detect faces (using tiled and/or multi-scale methods) and extract embeddings.
    If no faces are detected initially, upscale the entire image (2×) and retry.
    """
    # Ensure input image is in numpy array format and in BGR
    if isinstance(image, Image.Image):
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    img = np.array(image) if not isinstance(image, np.ndarray) else image

    enhanced_img = preprocess_input_image(img, sr_model, min_dim=MIN_IMAGE_DIM)
    if enhanced_img is None:
        return [], []

    if use_tile_detection:
        faces = detect_faces_tiled(model, enhanced_img)
    else:
        faces = detect_faces_multiscale(model, enhanced_img, scales=scales)
    
    # If no faces detected, upscale image (2x) and try again
    if not faces:
        logging.info("No faces detected at current scale. Upscaling entire image (2×) for detection.")
        upscaled_img = cv2.resize(enhanced_img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        if use_tile_detection:
            faces = detect_faces_tiled(model, upscaled_img)
        else:
            faces = detect_faces_multiscale(model, upscaled_img, scales=scales)
        for face in faces:
            face.bbox = face.bbox / 2.0
            if hasattr(face, 'kps') and face.kps is not None:
                face.kps = face.kps / 2.0

    embeddings = []
    for face in faces:
        logging.info(f"Detected face with bbox: {face.bbox}")
        cropped_face = preprocess_face(enhanced_img, face.bbox, face_obj=face,
                                       use_super_res=use_super_res, sr_model=sr_model)
        if cropped_face is None:
            continue
        if RE_RUN_EMBEDDING:
            embedding = get_face_embedding(model, cropped_face)
            # Fallback to detector's provided embedding if re-run fails
            if embedding is None and hasattr(face, 'embedding'):
                embedding = normalize(face.embedding.reshape(1, -1))[0]
        else:
            embedding = face.embedding
            embedding = normalize(embedding.reshape(1, -1))[0]
        if embedding is not None:
            embeddings.append(embedding)
    return faces, embeddings

def build_faiss_index(embeddings):
    """
    Build a Faiss index from a list of embeddings.
    """
    if not embeddings:
        raise ValueError("Embeddings list is empty, cannot build Faiss index.")
    embeddings_array = np.array(embeddings).astype('float32')
    index = faiss.IndexFlatIP(embeddings_array.shape[1])
    index.add(embeddings_array)
    return index

def find_closest_face(embedding, index, profiles, threshold=HIGH_SIMILARITY_THRESHOLD):
    """
    Search for the closest face embedding in the index.
    Returns the matched profile name and similarity if similarity exceeds threshold.
    """
    distances, indices = index.search(np.array([embedding]).astype('float32'), 1)
    closest_idx = indices[0][0]
    closest_similarity = distances[0][0]
    logging.info(f"Found closest similarity: {closest_similarity:.4f}")
    if closest_similarity > threshold:
        return profiles[closest_idx], closest_similarity
    return None, None

def download_image(url, retries=3, delay=5):
    """
    Download an image from a URL with optional retries.
    """
    for attempt in range(retries):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return Image.open(BytesIO(response.content))
            else:
                logging.error(f"Error downloading image from {url} (status code: {response.status_code})")
                return None
        except requests.exceptions.RequestException as e:
            logging.error(f"Download error: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                return None
def process_face_image(name, enrollment_id, image: Image.Image, use_tile_detection=False):
    """
    Process a group query image for a given student.
    For each detected face in the query image, compare it against the known student database.
    Attendance is recorded only for recognized (registered) students.
    Unknown faces are not marked as present or absent.
    Optionally saves face crop images for manual inspection.
    """
    logging.info("Initializing Face Recognition Model for query image...")
    model = FaceAnalysis()
    model.prepare(ctx_id=0, det_size=(640, 640))

    logging.info("Fetching known faces from MongoDB for comparison...")
    mongo_url = os.getenv('MONGO_URL')
    all_faces = get_all_students(mongo_url)
    logging.info(f"Number of known faces retrieved: {len(all_faces)}")

    if len(all_faces) == 0:
        logging.error("No student records found in the database.")
        return {
            "matched": False,
            "student_name": None,
            "similarity": None,
            "message": "No known faces available for comparison."
        }

    logging.info(f"Sample student record: {all_faces[0]}")

    known_embeddings = []
    profile_names = []
    enrollment_numbers = {}
    student_ids = {}

    for face in all_faces:
        if 'decodedImage' not in face or not face['decodedImage']:
            logging.warning(f"Student {face.get('name', 'Unknown')} has no decoded image.")
            continue
        logging.info(f"Processing known face for student: {face['name']}")
        faces_known, embeddings = extract_embeddings(model, face['decodedImage'],
                                                     use_tile_detection=USE_TILE_DETECTION,
                                                     use_super_res=USE_SUPER_RESOLUTION,
                                                     sr_model=super_res_model)
        if embeddings:
            known_embeddings.extend(embeddings)
            profile_names.extend([face['name']] * len(embeddings))
            enrollment_numbers[face['name']] = face['enrollment_id']
            student_ids[face['name']] = face['_id']

    if not known_embeddings:
        logging.error("No known face embeddings were generated from the database images.")
        return {
            "matched": False,
            "student_name": None,
            "similarity": None,
            "message": "No embeddings found for known students."
        }

    index = build_faiss_index(known_embeddings)

    logging.info(f"Processing query image for {name}...")
    img_np = np.array(image) if not isinstance(image, np.ndarray) else image
    enhanced_img_np = preprocess_input_image(img_np, super_res_model, min_dim=MIN_IMAGE_DIM)

    if use_tile_detection:
        faces_query = detect_faces_tiled(model, enhanced_img_np)
    else:
        faces_query = detect_faces_multiscale(model, enhanced_img_np)

    embeddings_query = []
    for face in faces_query:
        logging.info(f"Detected query face bbox: {face.bbox}")
        cropped_face = preprocess_face(enhanced_img_np, face.bbox, face_obj=face,
                                       use_super_res=USE_SUPER_RESOLUTION,
                                       sr_model=super_res_model)
        if cropped_face is None:
            continue
        if SAVE_FACE_CROPS:
            crop_filename = f"{name}_face_{len(embeddings_query)+1}.jpg"
            crop_path = os.path.join(FACE_CROPS_FOLDER, crop_filename)
            cv2.imwrite(crop_path, cropped_face)
            logging.info(f"Saved detected face crop to {crop_path}")
        if RE_RUN_EMBEDDING:
            embedding = get_face_embedding(model, cropped_face)
            if embedding is None and hasattr(face, 'embedding'):
                embedding = normalize(face.embedding.reshape(1, -1))[0]
        else:
            embedding = face.embedding
            embedding = normalize(embedding.reshape(1, -1))[0]
        if embedding is not None:
            embeddings_query.append(embedding)

    if not embeddings_query:
        return {
            "matched": False,
            "student_name": None,
            "similarity": None,
            "message": f"No faces detected in query image for {name}."
        }

    # For now, only return the result of the first matched face
    for i, embedding in enumerate(embeddings_query):
        matched_name, similarity = find_closest_face(embedding, index, profile_names,
                                                     threshold=HIGH_SIMILARITY_THRESHOLD)
        if matched_name:
            logging.info(f"Face {i+1} matched: {matched_name} (Similarity: {similarity:.4f})")
            attendance = Attendance(
                name=matched_name,
                enrollment_number=enrollment_numbers[matched_name],
                status='present',
                date=timezone.now().date()
            )
            attendance.save()
            return {
                "matched": True,
                "student_name": matched_name,
                "similarity": float(similarity),
                "message": f"Face {i+1}: {matched_name} (Similarity: {similarity:.4f})"
            }

    # No match found for any face
    return {
        "matched": False,
        "student_name": None,
        "similarity": None,
        "message": "No match found for any detected face."
    }
