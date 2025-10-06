from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    github_link = models.URLField(blank=True, null=True)
    demo_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title



from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    video = models.FileField(upload_to='videos/')  # video upload
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
