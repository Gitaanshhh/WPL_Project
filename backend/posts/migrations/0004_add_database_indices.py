# Generated migration for database indices

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_remove_post_post_topic_created_idx_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='name',
            field=models.CharField(db_index=True, max_length=120, unique=True),
        ),
        migrations.AlterField(
            model_name='topic',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.ForeignKey(db_index=True, on_delete=models.CASCADE, related_name='posts', to='accounts.platformuser'),
        ),
        migrations.AlterField(
            model_name='post',
            name='topic',
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=models.SET_NULL, related_name='posts', to='posts.topic'),
        ),
        migrations.AlterField(
            model_name='post',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='post',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AddIndex(
            model_name='post',
            index=models.Index(fields=['author', '-created_at'], name='posts_post_author_created_idx'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=models.Index(fields=['-created_at', 'is_deleted'], name='posts_post_created_deleted_idx'),
        ),
    ]
