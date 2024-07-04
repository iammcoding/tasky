# Generated by Django 4.2.3 on 2024-07-02 15:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("Task", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
    ]
