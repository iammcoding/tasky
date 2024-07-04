from django.shortcuts import render, redirect
from django.contrib.auth import logout

def home(request):
    return render(request, 'index.html')

def signup(request):
    return render(request, 'auth/register.html')

def login(request):
    return render(request, 'auth/login.html')

def logou_viewt(request):
    logout(request)
    return redirect('/login/')