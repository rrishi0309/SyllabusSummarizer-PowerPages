# 📚 AI Syllabus Summarizer – Microsoft Power Platform Edition

> AI-powered syllabus intelligence with Microsoft-native automation. Built with **Power Pages**, **Power Automate**, **OpenAI GPT-4o**, and **PDF/HTML formatting** tools for a seamless advising experience.

---

## ✨ Description

The **AI Syllabus Summarizer** is a low-code, AI-enhanced tool designed to help **university advisors** extract structured summaries from course syllabi. By combining Microsoft's Power Platform with **OpenAI's GPT-4o**, this solution automates the full journey: from syllabus upload → to summary generation → to PDF/Word export → to email delivery. 

It eliminates manual review, ensures formatting consistency, and operates with **zero data retention**, making it ideal for FERPA-aware environments.

---

## 🔄 Supported Versions

### 1. **Power Pages Web App + Cloud Flow (Primary)**
- Clean web interface for uploading syllabi (PDF only)
- Uses **Power Automate** to:
  - Extract and summarize content with GPT-4o
  - Format into styled HTML → Convert to PDF
  - Auto-email the result to the advisor
  - Delete temporary files after use
- Includes inline preview, dark mode, and loading animations

### 2. **Microsoft Forms + Power Automate (Lightweight Mode)**
- Advisor submits a **simple Form** with syllabus upload
- Flow triggers on submission, processes the file, and emails the PDF summary back
- Great for quick interactions without signing into Power Pages

### 3. **Automated Folder Drop (Experimental)**
- A version that monitors a **OneDrive/SharePoint folder**
- When a new file is dropped:
  - It triggers the same AI summarization + export + email pipeline
- Ideal for backend automation, file sync integrations, or desktop agent extensions

---

## 📚 Key Features

- ✅ **GPT-4o Summarization**
- ✅ **Power Automate Flows** with HTML-to-PDF conversion
- ✅ **Responsive Power Pages UI** with file preview and loading feedback
- ✅ **Automatic Email Delivery** to advisors
- ✅ **File Cleanup** after processing for privacy
- ✅ **Dark Mode UI + Tailwind Styling (CDN)**
- ✅ **No user data stored** (temp files only during flow execution)
- ✅ **Supports DOCX and PDF export formats**

---

## 🎓 Summary Structure

The AI-generated summary follows a consistent academic template:

- **Course Title & Code**
- **Semester** (if available)
- **Instructor Info**
- **Class Schedule**
- **Course Description**
- **Prerequisites**
- **Key Learning Outcomes**
- **Technologies and Tools**
- **Assessment Methods**
- **Special Features**
- **AI-Suggested Job Roles**

All fields are conditionally included — if content is not present in the syllabus, it is excluded from the summary.

---

## 📁 File Structure

```
├── flows/                 # Power Automate JSON exports (Forms + Pages)
├── assets/                # Screenshots, UI gifs
├── scripts/               # HTML templates, CSS, JavaScript helpers
├── templates/             # PDF styling and layout files
└── README.md
```

---

## 📊 Visual Overview

### Power Pages App Screenshots
### Power Pages Upload Interface
![image](https://github.com/user-attachments/assets/aa0ee60e-e86d-4ade-8097-a16daf12826d)

### “How It Works” Modal Walkthrough
![image](https://github.com/user-attachments/assets/bc39ef5a-e496-4957-835a-c6dd53d1a16e)

### GPT-Generated Summary Side-by-Side Preview
![image](https://github.com/user-attachments/assets/1137484b-952f-462c-8b39-e3bb3a1a5102)

### Power Automate Flow (Power Pages Triggered)
![image](https://github.com/user-attachments/assets/6279bc1a-b089-4cac-a7c5-73befc7b3506)

### Power Automate + Forms Screenshots
### Mirosoft Forms
![image](https://github.com/user-attachments/assets/1bc2f8e4-a918-4814-8d39-8c94e535801f)

### Power Automate Flow (Forms Triggered)
![image](https://github.com/user-attachments/assets/56b2199b-1731-4ec9-bee6-f306470501af)

### Power Automate Forms - Email Screenshot
![image](https://github.com/user-attachments/assets/7f519b05-7818-4050-bc7c-5edcff325c90)
![image](https://github.com/user-attachments/assets/64215e57-51d9-47ac-8c16-abd412572b83)

### Power Automate Flow (Drop a Item to Folder to Trigger - Experimental)
![image](https://github.com/user-attachments/assets/ae08a4b8-240e-4cb8-89c4-fe0ec7ff90b2)

---

## 🔐 Privacy and AI Ethics

- ❌ **No long-term file storage**
- ✅ GPT prompt strictly limits hallucinations
- ✅ Only explicitly stated information is included in summaries
- ✅ Files are automatically deleted after flow execution

---

## 🔧 Setup Guide (for Power Users)

> You'll need Power Pages access, Power Automate Premium license, and OpenAI API access

1. **Set up the Power Pages Site**
   - Use Tailwind CDN in the design studio
   - Link file upload to Dataverse or use `eventData` POST trigger

2. **Import the Power Automate Flows** from `/flows`
   - Configure GPT API connection
   - Use HTML → PDF conversion connectors (OneDrive/SharePoint Premium)

3. **Test Email Delivery** and ensure cleanup of temp files

4. (Optional) **Deploy Microsoft Forms trigger** if enabling the lightweight version

5. (Optional) **Set up Folder Drop Flow** for automated processing from synced folders

---

## 🗓️ Project Background

This project was developed as part of my role as an **AI Solutions Engineer Intern** with the **MBA Team at the David Eccles School of Business**, University of Utah.

The Power Pages version represents a Microsoft-native evolution, adding production-readiness, accessibility, and data compliance.

Built by:
- 👤 Rishi Ramesh  
- 🔗 [LinkedIn](https://www.linkedin.com/in/rishi0309/)

---

## 📝 License

Licensed under the **MIT License** — free to modify, enhance, and share.
