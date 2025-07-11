# 🥫 Food Expiry Tracker

A smart full-stack web application that allows users to track food expiry dates, receive automated email alerts before expiration (30, 15, and 5 days), and manage their inventory efficiently.

---

## 📌 Features

- ✅ Register/Login with JWT Authentication
- 📋 Add, edit, and delete food items with expiry dates
- ⏰ Email notifications 30, 15, and 5 days before food expiry
- 📊 Dashboard with filtering: All / Expiring Soon / Expired
- ✉️ Notification preference toggle
- 🔒 Protected routes and role-based access (Admin/Staff Ready)
- 📱 Fully responsive design

---

## 🚀 Live Demo

(Coming Soon after Deployment)

---

## 🧠 Tech Stack

| Layer     | Technology                              |
|-----------|------------------------------------------|
| Frontend  | React + Vite + Tailwind CSS + Bootstrap  |
| Backend   | Node.js + Express.js                     |
| Database  | MongoDB + Mongoose                       |
| Auth      | JWT (JSON Web Tokens)                    |
| Scheduler | node-cron + Nodemailer                   |

---

## 🛠️ Local Development Setup

### ⚙️ 1. Fork & Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
🧩 2. Backend Setup (/backend)
bash
Copy code
cd backend
npm install
🔐 Create a .env file inside /backend folder:
env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
Note: Use Google App Passwords for Gmail SMTP if 2FA is enabled.

▶️ Start Backend Server
bash
Copy code
npm start
The server runs on: http://localhost:5000

🎨 3. Frontend Setup (/frontend)
bash
Copy code
cd frontend
npm install
▶️ Start Frontend Server
bash
Copy code
npm run dev
Frontend runs on: http://localhost:5173

✉️ Email Notification System
Automatically runs every day at 9:00 AM

Sends email alerts to users for food items expiring in:

📅 30 days

📅 15 days

📅 5 days

Scheduler uses node-cron and nodemailer

✅ Users can enable/disable notification from the dashboard.

📂 Project Structure Overview
pgsql
Copy code
📁 root/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── emailScheduler.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
│
├── README.md
└── package.json
🐞 Troubleshooting
500 Server Error?
Check your .env variables and ensure MongoDB URI & email credentials are correct.

Email not sending?
Ensure less secure apps are enabled or use app password for Gmail SMTP.

CORS issues?
Confirm your backend has proper CORS configuration.

📦 Build for Production
To create production builds:

Backend (Optional for deployment):
bash
Copy code
npm run build   # if using TS or Babel
Frontend:
bash
Copy code
npm run build
🧑‍💻 Author
Deepak Jain
GitHub: @deepakjain06

🤝 Contributing
Contributions are welcome! Feel free to fork this repo, make changes, and submit a pull request.

📝 License
This project is licensed under the MIT License.


---
