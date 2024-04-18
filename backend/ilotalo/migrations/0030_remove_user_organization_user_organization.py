# Generated by Django 5.0.1 on 2024-04-17 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0029_user_rights_for_reservation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='organization',
        ),
        migrations.AddField(
            model_name='user',
            name='organization',
            field=models.JSONField(default=dict, null=True),
        ),
    ]