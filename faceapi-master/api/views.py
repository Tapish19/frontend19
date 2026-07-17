from django.http import JsonResponse
from .models import Attendance
from django.views.decorators.csrf import csrf_exempt
import json
from .faceapi import process_face_image, download_image
from .mongo_handler import get_all_students
import logging
import os
from PIL import Image

logger = logging.getLogger(__name__)


def attendance_view(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    records = Attendance.objects.all().order_by('-date')
    data = [
        {'name': r.name, 'enrollment_number': r.enrollment_number, 'status': r.status, 'date': str(r.date)}
        for r in records
    ]
    return JsonResponse(data, safe=False)


@csrf_exempt
def process_image(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        if request.FILES.get('image'):
            image = Image.open(request.FILES['image'])
            name = request.POST.get('name', 'Unknown')
            enrollment_id = request.POST.get('id', 'Unknown')
        else:
            data = json.loads(request.body.decode('utf-8'))

            image_url = data.get('image')
            if not image_url:
                return JsonResponse({'error': 'image URL is required'}, status=400)

            image = download_image(image_url)
            if image is None:
                return JsonResponse({'error': 'Unable to download image'}, status=400)

            name = data.get('name', 'Unknown')
            enrollment_id = data.get('id', 'Unknown')

        result = process_face_image(name, enrollment_id, image)
        return JsonResponse(result)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)
    except Exception as e:
        logger.error(f'process_image error: {e}', exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)


def student_data_view(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        mongo_url = os.getenv('MONGO_URL')
        if not mongo_url:
            return JsonResponse({'error': 'MONGO_URL is not configured'}, status=500)
        students = get_all_students(mongo_url)
        data = [
            {
                'id': str(s['_id']),
                'name': s.get('name', ''),
                'enrollment_id': s.get('enrollment_id', ''),  # consistent field name
                'email': s.get('email', ''),
                'course': s.get('course', ''),
                'createdAt': str(s.get('createdAt', '')),
            }
            for s in students
        ]
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f'student_data_view error: {e}', exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)
