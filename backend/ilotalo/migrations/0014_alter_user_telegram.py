# Generated by Django 5.0.1 on 2024-02-16 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilotalo', '0013_alter_user_telegram'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='telegram',
            field=models.CharField(default='', max_length=100, null=True, unique=True),
        ),
    ]
