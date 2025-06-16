from pymongo import MongoClient
import os
from dotenv import load_dotenv
import base64
from PIL import Image
from io import BytesIO
import logging
import time

# Configure logging to see output in the console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URL from environment variables
MONGO_URL = os.getenv('MONGO_URL')

def get_all_students(mongo_url, retries=3, delay=5):
    """
    Fetches all student documents from the 'student' collection in the 'test' database.
    
    For each document:
      - Converts the '_id' to a string.
      - If a 'profileImage' exists, attempts to decode it from base64 into a PIL Image object
        and stores it under the key 'decodedImage'. Otherwise, 'decodedImage' is set to None.
      
    Args:
        mongo_url (str): The MongoDB connection URL.
        retries (int): Number of retries for the connection.
        delay (int): Delay between retries in seconds.
    
    Returns:
        list: A list of all student documents with the additional 'decodedImage' key.
    """
    for attempt in range(retries):
        try:
            with MongoClient(mongo_url) as client:
                logger.info("MongoDB connection successful")
                db = client['test']              # Use the 'test' database
                collection = db['students']         # Use the 'student' collection

                all_students = []
                for document in collection.find():
                    logger.info(f"Document retrieved: {document}")  # Debugging statement
                    # Convert _id to a string for consistency (especially useful for JSON serialization)
                    document['_id'] = str(document.get('_id'))
                    
                    # Attempt to decode the profileImage if it exists
                    if 'name' in document and 'profileImage' in document and 'enrollment_id' in document:
                        try:
                            image_data = base64.b64decode(document['profileImage'])
                            image = Image.open(BytesIO(image_data))
                            document['decodedImage'] = image
                        except Exception as e:
                            logger.error(f"Error decoding image for document {document.get('_id')}: {e}")
                            document['decodedImage'] = None
                    else:
                        logger.warning(f"Document missing required fields: {document}")  # Debugging statement
                        document['decodedImage'] = None
                    
                    # Append the complete document (with all fields) to the list
                    all_students.append(document)
                
                logger.info(f"All student documents retrieved: {len(all_students)}")
                return all_students

        except Exception as e:
            logger.exception(f"Error retrieving student data: {e}")
            if attempt < retries - 1:
                logger.info(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                logger.error("Max retries reached. Could not connect to MongoDB.")
                return []
def add_student(mongo_url, name, enrollment_id, email, course):
    from pymongo import MongoClient
    client = MongoClient(mongo_url)
    db = client['your_db_name']  # Replace with your DB name
    students = db['students']
    student = {
        'name': name,
        'enrollment_id': enrollment_id,
        'email': email,
        'course': course
    }
    students.insert_one(student)