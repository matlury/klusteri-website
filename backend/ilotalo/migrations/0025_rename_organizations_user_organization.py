# Generated by Django 5.0.1 on 2024-03-20 11:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0024_user_organizations'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='organizations',
            new_name='organization',
        ),
    ]
