from django.shortcuts import redirect

class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path in ['/signup/', '/login/', '/register/', '/authenticate/','/']:

            if request.user.is_authenticated:
                # Redirect authenticated users to /dash if they try to access /register or /login
                return redirect('/dash/')
        else:
            if not request.user.is_authenticated:
                # Redirect unauthenticated users to /login if they try to access other paths
                return redirect('/login/')
        
        response = self.get_response(request)
        return response