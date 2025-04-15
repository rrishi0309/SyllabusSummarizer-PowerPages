# 📚 AI Syllabus Summarizer – Power Pages Edition

> A fully automated, AI-powered tool built with Microsoft Power Pages, Power Automate, and GPT-4o to generate professional, advisor-ready summaries from uploaded course syllabi.

---

## 🚀 Overview

The **AI Syllabus Summarizer (Power Pages Edition)** helps MBA advisors quickly review and understand course content without digging through full syllabus documents. With seamless file upload, AI-driven summarization, auto-generated PDF exports, and real-time email delivery, this version enhances accessibility, usability, and automation.

Originally developed as a Retool MVP, this edition takes the tool further with a clean web interface, animated UI, and Microsoft-native automation stack.

---

## ✨ Key Features

✅ Drag-and-drop **PDF syllabus upload**  
✅ **GPT-4o**-powered summarization with structured formatting  
✅ Converts summaries into **styled PDFs**  
✅ Auto-emails the summary to the advisor  
✅ Deletes uploaded files after processing for security  
✅ Support for **inline file previews** and animated loading states  
✅ **Dark mode UI** with clean black & white design  
✅ No data stored – complies with privacy best practices

---

## ⚙️ Tech Stack

- **Microsoft Power Pages** – Frontend interface  
- **Power Automate** – File extraction, AI processing, PDF generation, email automation  
- **OpenAI (GPT-4o)** – Summarization logic  
- **PDFLib / docx.js** – Client-side formatting for rich text output  
- **Tailwind CSS (CDN)** – Minimal, accessible UI design  
- **JavaScript** – Event handling and dynamic UI updates  

---

## 📌 Summary Format

The AI-generated summary includes:

- **Course Title**  
- **Semester (if available)**  
- **Instructor Info**  
- **Class Schedule**  
- **Course Description**  
- **Prerequisites**  
- **Key Learning Outcomes**  
- **Technologies and Tools Covered**  
- **Assessment Methods**  
- **Special Features**  
- **Relevant AI-generated Job Roles**

Summaries only include details **explicitly present** in the syllabus. No assumptions are made.

---

## 🖼️ Screenshots (Coming Soon)

📌 Loading animation (hello.gif)  
📌 Inline file preview with summary output  
📌 Summary-to-PDF formatting  
📌 Clean, mobile-responsive UI  

---

## 🔒 Privacy & Ethics

- 🚫 No files or personal data stored  
- ✅ Summaries generated only from the uploaded syllabus  
- 🧠 Follows responsible AI practices and transparent formatting  
- 📧 Automatically deletes uploaded files post-delivery

---

## 🛠️ Setup Instructions

1. **Connect Power Automate Flow** to your Power Pages form  
2. **Ensure Microsoft Form captures:**
   - Advisor name
   - Email
   - Syllabus file (PDF only)

3. **In Power Automate**:
   - Extract file content
   - Summarize using GPT-4o
   - Generate PDF (styled output)
   - Email summary to advisor
   - Delete uploaded file from temp storage

---

## 📁 Folder Structure

📂 flows/ # Power Automate JSON exports
📂 assets/ # GIFs, logos, images
📂 scripts/ # JS & CSS files for frontend UI
📂 templates/ # HTML summary layout & PDF export helpers
README.md # Project overview
LICENSE # MIT License


---

## 💬 Project Origin

This project builds on an earlier Retool prototype ([Retool version](https://github.com/rrishi0309/AI-Syllabus-Summarizer)). The Power Pages edition expands its capabilities into a scalable, secure web application.

---

## 📝 License

MIT License – free to use, adapt, and improve with attribution.

---

## 🤝 Contact

Built by **Rishi Ramesh**  
🔗 [LinkedIn](https://www.linkedin.com/in/rishi0309/)  
