from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Task(models.Model):
    STATUS_CHOICES = (
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Overdue', 'Overdue'),
    )
    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    due_date = models.DateTimeField()
    category = models.CharField(max_length=100)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Ensure due_date is a datetime object and is timezone-aware before saving
        if isinstance(self.due_date, str):
            self.due_date = timezone.datetime.fromisoformat(self.due_date)
        if not self.due_date.tzinfo:
            self.due_date = timezone.make_aware(self.due_date, timezone.get_current_timezone())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
