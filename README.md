
# ProdoXus
## Secure Anonymous Messaging System

### Introduction
This project is a privacy-first, secure, and anonymous messaging system built with React (Vite) for the frontend and Node.js (Express) for the backend. It allows users to send encrypted text messages and files without requiring phone numbers, email addresses, or user registration. Communication is facilitated through unique public/private key pairs that serve as access codes.

This project is ideal for building secure communication tools for whistleblowers, darknet messaging portals, or anyone prioritizing privacy.

### Features
* No Identity Required: No signup, login, phone, or email — communication is enabled solely through public/private key pairs.

* Anonymous Inbox & Sent Box: Separate views for received and sent messages with a clean, intuitive interface.

* File Attachment Support: Securely send and receive files alongside messages.

* Key-Based Message Access: Messages are decrypted only with valid private keys.

* Auto-Refresh Inbox: Automatically updates messages every few seconds.

* Dark Mode UI: A sleek, custom-designed dark theme for all screens.

* Server File Storage: Uploaded files are securely stored in the /uploads folder and available for download.

* Simple JSON Storage: Keys and messages are stored in keys.json and messages.json for simplicity.

### Installation
#### Prerequisites
* Node.js (v16 or higher)
* npm (v8 or higher)
* Git

#### backend
* git clone https://github.com/DivakarBabuMP/ProdoXus.git
* cd ProdoXus/server
* node server.js

#### Frontend
* git clone https://github.com/DivakarBabuMP/ProdoXus.git
* cd ProdoXus
* npm install  
* npm run dev

### Reporting Bugs

Found a bug? Please open an issue at:
https://github.com/DivakarBabuMP/ProdoXus.git/issues

#### Include the following details:
* What you were doing when the issue occurred
* What happened (describe the bug)
* A screenshot (if applicable)
* Any console errors (if applicable)

### Known Issues (Work in Progress)
* Migrating JSON file storage to MongoDB for better scalability
* Improving mobile responsiveness
* Enhancing file encryption with optional password protection
* Adding message expiry or auto-deletion settings

### Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. Ensure your code follows the project's coding standards and includes appropriate tests.

### License
This project is licensed under the Mozilla Public License 2.0 . See the LICENSE file for details.