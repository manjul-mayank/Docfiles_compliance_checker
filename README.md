# 🧠 Docfiles Compliance Checker

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Framework-Django-green.svg)](https://www.djangoproject.com/)
[![OpenAI](https://img.shields.io/badge/LLM-OpenAI_API-orange.svg)](https://platform.openai.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

---

## 📘 Overview

**Docfiles Compliance Checker** is an AI-powered web application that evaluates document files (PDF or Word) for compliance against English writing guidelines.  
It automatically checks grammar, sentence structure, and clarity — and even provides AI-assisted correction and rewrite suggestions.

---

## 🚀 Features

- 📂 Upload PDF or Word files via a secure web interface  
- 🤖 AI-powered compliance analysis using NLP models (OpenAI, spaCy, etc.)  
- 🧾 Detailed compliance reports  
- ✍️ Auto-correct and rewrite documents to meet English guidelines  
- 🔒 Secure API built with Django/FastAPI  
- ✅ Tested and validated with multiple document formats  

---

## 🏗️ Architecture

```text
Frontend (HTML/JS)
        ↓
Backend (Django REST API)
        ↓
AI Engine (Gemini / spaCy / LanguageTool)
        ↓
Document Processing (PDF & DOCX Parser)
        ↓
Compliance Report Generator
```
# ⚙️ Tech Stack

| Component         | Technology                      |
| ----------------- | ------------------------------- |
| **Language**      | Python 3.9+                     |
| **Framework**     | Django / Django REST Framework  |
| **AI/NLP**        | Gemini API, spaCy, LanguageTool |
| **File Handling** | PyMuPDF, python-docx            |
| **Database**      | SQLite / PostgreSQL             |
| **Frontend**      | HTML, CSS, JavaScript           |
| **Deployment**    | Docker, AWS / Azure (optional)  |

# 🧩 Installation

- Clone the repository
git clone https://github.com/manjul-mayank/Docfiles_compliance_checker.git
cd Docfiles_compliance_checker

- Create and activate virtual environment
python -m venv venv
source venv/bin/activate     # (Mac/Linux)
venv\Scripts\activate        # (Windows)

- Install dependencies
pip install -r requirements.txt

- Run migrations
python manage.py migrate

- Start the development server
python manage.py runserver

# 🧠 How It Works

- User uploads a .pdf or .docx file.

- The backend extracts text content using PyMuPDF or python-docx.

- The AI module checks the text for compliance with English writing rules.

- The system generates a compliance report.

- (Optional) The AI can rewrite the content to make it compliant.

# 📈 Future Enhancements

- Add multilingual compliance support
- Integrate grammar-correction feedback loops
- Add user authentication and dashboard
- Deploy scalable version on AWS / Azure

# 📜 License

This project is licensed under the MIT License — see the LICENSE file for details.

# 👨‍💻 Author

## Manjul Mayank ##
🔗 GitHub

📧 manjul2012mayank@gmail.com

💬 AI Developer | Python | NLP | LLM Integrations

