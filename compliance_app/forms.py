# compliance_app/forms.py
from django import forms

class DocumentUploadForm(forms.Form):
    # This must match the names used in your HTML form
    file = forms.FileField() 
    guidelines = forms.CharField(max_length=500, required=False)