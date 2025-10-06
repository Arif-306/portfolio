from django.shortcuts import render

def home(request):
    return render(request, 'index.html')


from django.shortcuts import render
from .models import Project

def home(request):
    projects = Project.objects.all()
    return render(request, 'index.html', {'projects': projects})
