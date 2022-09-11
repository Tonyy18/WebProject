
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('editor/', include("apps.editor.urls")),
]
