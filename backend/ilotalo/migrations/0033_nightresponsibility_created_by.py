# Generated by Django 5.0.1 on 2024-05-21 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0032_rename_reservation_event_organizer_event_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='nightresponsibility',
            name='created_by',
            field=models.CharField(default='', max_length=50),
        ),
    ]
