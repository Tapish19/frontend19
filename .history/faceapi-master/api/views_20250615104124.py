from django.shortcuts import render
from django.http import JsonResponse
from .models import Attendance
import base64
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Attendance
import json
from .faceapi import process_face_image, download_image
from .mongo_handler import get_all_students
from io import BytesIO
from PIL import Image
import logging
import os

# Configure logging to see output in the console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def attendance_view(request):
    if request.method == 'GET':
        attendance_records = Attendance.objects.all()
        data = [
            {
                'name': record.name,
                'enrollment_number': record.enrollment_number,
                'status': record.status,
                'date': record.date
            }
            for record in attendance_records
        ]
        return JsonResponse(data, safe=False)

@csrf_exempt
def process_image(request):
    if request.method == 'POST':
        try:
            logger.info("Request received")
            data = json.loads(request.body.decode('utf-8'))
            image_url = data.get('image')
            logger.info(f"Image URL: {image_url}")  # Print the image URL for debugging

            # Download the image from the URL
            image = download_image(image_url)
            if image is None:
                return JsonResponse({'error': 'Unable to download image'}, status=400)

            # Process the image and save attendance
            result = process_face_image("Unknown", "Unknown", image)

            response_data = {
                'message': result
            }
            return JsonResponse(response_data)
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def student_data_view(request):
    if request.method == 'GET':
        try:
            logger.info("Fetching student data")
            mongo_url = os.getenv('MONGO_URL')
            students = get_all_students(mongo_url)
            data = [
                {
                    'id': str(student['_id']),
                    'name': student['name'],
                    'enrollment_number': student['enrollment_id'],
                    'email': student.get('email', 'Unknown'),
                    'createdAt': student.get('createdAt', 'Unknown'),
                    'updatedAt': student.get('updatedAt', 'Unknown'),
                    'Id': student.get('Id', 'Unknown'),
                    'course': student.get('course', 'Unknown')
                }
                for student in students
            ]
            logger.info(f"Student data retrieved: {len(data)} records")
            return JsonResponse(data, safe=False)
        except Exception as e:
            logger.error(f"Error fetching student data: {e}")
            return JsonResponse({'error': str(e)}, status=500)
