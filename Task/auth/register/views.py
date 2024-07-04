from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import re

@method_decorator(csrf_exempt, name='dispatch')
class RegisterUserView(View):
    def post(self, request, *args, **kwargs):
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Server-side validation
        if not name or not email or not password:
            return JsonResponse({'message': 'All fields are required'}, status=400)

        # Email format validation
        email_regex = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
        if not email_regex.match(email):
            return JsonResponse({'message': 'Invalid email format'}, status=400)

        if User.objects.filter(username=name).exists():
            return JsonResponse({'message': 'Username already exists'}, status=400)
        elif User.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email already exists'}, status=400)
        else:
            user = User.objects.create_user(
                username=name,
                email=email,
                password=password
            )
            user.save()
            
            # Authenticate the user
            user = authenticate(username=name, password=password)
            
            if user is not None:
                # Log the user in
                login(request, user)
                return JsonResponse({'message': 'User created and logged in successfully'}, status=201)
            else:
                return JsonResponse({'message': 'User created but could not log in'}, status=400)
