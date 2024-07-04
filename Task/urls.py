"""
URL configuration for Task project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from . import views  # Import the views from the current directory
from Task.auth.register.views import RegisterUserView
from Task.dashboard.views import dash
from Task.auth.login.views import LoginView
from Task.dashboard.views import insert_task
from Task.dashboard.views import move_task
from Task.dashboard.views import edit_task
from Task.dashboard.views import delete_task
from Task.dashboard.views import taskDatas

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', views.home, name='home'),  # Map the root URL to the home view
    path('login/', views.login, name='login'),  # Map the root URL to the home view
    path('signup/', views.signup, name='signup'),  # Map the root URL to the home view
    path('register/', RegisterUserView.as_view(), name='register'),
    path('authenticate/', LoginView.as_view(), name='authenticate'),
    path('dash/', dash, name='dash'),  # Map the root URL to the home view
    path('taskDatas/', taskDatas, name='taskDatas'),  # Map the root URL to the home view
    path('logout/', views.logou_viewt, name='logout'),  # Map the root URL to the home view
    path('submit-task/', insert_task, name='insert_task'),  # Map the root URL to the home view
    path('edit-task/', edit_task, name='edit_task'),  # Map the root URL to the home view
    path('moveTask/', move_task, name='move_task'),  # Map the root URL to the home view
    path('delete-task/', delete_task, name='delete_task'),  # Map the root URL to the home view


]
