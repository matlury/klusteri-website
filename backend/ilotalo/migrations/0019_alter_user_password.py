# Generated by Django 5.0.1 on 2024-03-01 10:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0018_alter_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(default='', max_length=255),
        ),
    ]
