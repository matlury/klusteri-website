# Generated by Django 5.0.1 on 2024-01-29 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0003_user_email_user_telegram'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.IntegerField(default=5),
        ),
    ]