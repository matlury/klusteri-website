# Generated by Django 5.0.1 on 2024-02-09 11:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0008_user_is_active'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='role',
        ),
        migrations.RemoveField(
            model_name='user',
            name='telegram',
        ),
    ]
