# Generated by Django 5.0.1 on 2024-03-06 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0019_event'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='end',
            field=models.DateTimeField(blank=True, default='1970-01-02 14:00:00'),
        ),
        migrations.AddField(
            model_name='event',
            name='start',
            field=models.DateTimeField(blank=True, default='1970-01-01 12:00:00'),
        ),
    ]