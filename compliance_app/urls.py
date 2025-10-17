# compliance_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('upload', views.upload_document, name='upload'),
    path('assess/<str:doc_id>', views.assess_document, name='assess'),
    path('modify', views.modify_document, name='modify'),
    path('download/<str:doc_id>', views.download_file, name='download'),
]