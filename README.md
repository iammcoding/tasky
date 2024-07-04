# Task Management Application

## Overview
This project is a task management application built with Django for the backend and HTML, TailwindCSS, and jQuery for the frontend. The application allows users to create, update, delete, and view tasks. Tasks can be filtered, sorted, and dragged-and-dropped to change their status.

## Installation

### Prerequisites
- Python 3.x
- Django  

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/iammcoding/tasky
   cd tasky
2. **Setup Django**
   ```bash
    python -m venv env
    source env/bin/activate   
    # On Windows use `env\Scripts\activate`
3. **Install Django (Optional)**
   ```bash
    pip install django
4. **Run migrations**
   ```bash
    python manage.py migrate
5. **Create a superuser**
   ```bash
    python manage.py createsuperuser

6. **Start the development server**
   ```bash
    python manage.py runserver
7. **Run unit tests**
   ```bash
    python manage.py test

