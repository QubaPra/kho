# Generated by Django 5.1.6 on 2025-02-24 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trials', '0003_alter_trial_mentor_mail_alter_trial_mentor_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trial',
            name='status',
            field=models.CharField(default='do akceptacji przez opiekuna', max_length=255),
        ),
    ]
