# Generated by Django 5.0.1 on 2024-05-22 08:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0039_alter_nightresponsibility_login_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='start',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='nightresponsibility',
            name='logout_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
