
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from Task.models import Task
from django.test import TestCase, Client
from django.urls import reverse 

class TaskModelTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a User for testing
        test_user = User.objects.create_user(username='testuser', password='12345')
        
        # Create a Task instance for testing
        cls.task = Task.objects.create(
            title='Test Task',
            description='This is a test task',
            status='In Progress',
            priority='Medium',
            due_date=datetime.now() + timedelta(days=7),
            category='Testing',
            assigned_to=test_user
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, 'Test Task')
        self.assertEqual(self.task.description, 'This is a test task')
        self.assertEqual(self.task.status, 'In Progress')
        self.assertEqual(self.task.priority, 'Medium')
        self.assertEqual(self.task.category, 'Testing')
        self.assertEqual(self.task.assigned_to.username, 'testuser')
        self.assertTrue(self.task.created_at)  # Check that created_at is not None

    def test_task_str_method(self):
        self.assertEqual(str(self.task), 'Test Task')




class ViewsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a User for testing
        cls.test_user = User.objects.create_user(username='testuser', password='12345')

    def test_home_view(self):
        # Test home view
        response = self.client.get(reverse('home')) 
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'index.html')

    def test_signup_view(self):
        # Test signup view
        response = self.client.get(reverse('signup')) 
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'auth/register.html')

    def test_login_view(self):
        # Test login view
        response = self.client.get(reverse('login'))  
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'auth/login.html')

    def test_logout_view(self):
        # Test logout view
        self.client.force_login(self.test_user)  # Login the test user
        response = self.client.get(reverse('logout')) 
        self.assertEqual(response.status_code, 302)  # Expecting a redirect (302) to '/login/'
        self.assertRedirects(response, '/login/')

    def test_dash_view(self):
        # Test dashboard view
        self.client.force_login(self.test_user)  # Login the test user
        response = self.client.get(reverse('dash'))  
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'dashboard/dash.html')