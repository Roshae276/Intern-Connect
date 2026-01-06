# 🇮🇳 InternConnect: National Internship Oversight Portal
### *Governance. Protection. Impact.*

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green) ![SIH 2025](https://img.shields.io/badge/Hackathon-SIH_2025-orange) ![Status](https://img.shields.io/badge/Status-Prototype-blue)

> **The Problem:** Existing portals are just "Job Boards." They lack oversight, leading to unpaid labor exploitation and a disconnect between student skills and national goals.
>
> **The Solution:** InternConnect is a **Regulatory Compliance Engine** designed for the Ministry of Skill Development. It doesn't just list internships; it **audits** them for fair pay, safety, and alignment with schemes like *Digital India* and *Green Hydrogen Mission*.

---

## 🚀 Key Innovations

### 🏛️ 1. Government Regulatory Command Center (Admin)
The "Brain" of the operation for Ministry Officials.
* **📜 Policy Configuration Engine:** A "No-Code" panel to set dynamic rules (e.g., *"Minimum Stipend for Delhi = ₹12,000"*). The AI enforces these rules instantly nationwide.
* **📊 National Internship Health Index (NIHI):** Live dashboard tracking the ecosystem's pulse: Exploitation Rates, Tier-3 Participation, and Mission Alignment.
* **🚨 Live Exploitation Detection:** Automated auditing that flags **Unpaid Labor (>2 months)** or **Below Minimum Wage** violations with specific legal codes (e.g., `#LAB-02`).
* **🇮🇳 National Mission Alignment:** NLP Engine tags internships to national schemes (*Make in India*, *Digital India*), visualizing workforce distribution.

### 🛡️ 2. Student Protection & Smart Dashboard
Empowering students with data and safety.
* **✅ Internship Viability Index (IVI):** A single **0-100 Trust Score** on every job card combining Economic Fairness, Location Priority, and Skill Demand.
* **🔒 Exploitation Shield:** The "Apply" button is **physically locked** for high-risk listings. Students can only override this via an **Informed Consent** modal, logging the risk.
* **🤖 AI Resume Parser:** Integrated `pdf-parse` extracts skills from uploaded resumes automatically, removing manual entry friction.

### 🔐 3. Security & Architecture
* **NIC SSO Simulation:** Replaces standard login with a simulated **National Informatics Centre (NIC)** secure gateway handshake.
* **Data Ingestion Layer:** Designed to aggregate data from **NIP (National Internship Portal)**, **AICTE**, and **MCA** (Ministry of Corporate Affairs).
* **2G / Offline Mode:** Failsafe local caching ensures the app works in remote Tier-3 villages even with unstable internet.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Lucide React (Icons)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas/Local)
* **AI/Tools:** `pdf-parse` (Resume Analysis), Cloudinary (Secure Storage), Google Translate API (Bhashini Support).

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js installed
* MongoDB URI (Local or Atlas)
* Cloudinary Account (Optional for images)

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/InternConnect-SIH.git](https://github.com/YOUR_USERNAME/InternConnect-SIH.git)
cd InternConnect-SIH

2. Backend Setup
Bash

cd server
npm install
Create a .env file in the server folder:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the Server:

Bash

npm start
3. Frontend Setup
Bash

# Open a new terminal
cd client
npm install
Start React Dev Server:

Bash

npm run dev
📸 Usage Guide (The "Golden Path" Demo)
Government Login:

Go to Login -> Toggle "Government" -> Click "Authenticate with NIC SSO".

Observation: Watch the simulated secure handshake.

Policy Engine:

Go to Admin Dashboard -> Policy Engine.

Change "Minimum Stipend" and see how it flags existing jobs in the "Live Simulation".

Student Protection:

Login as Student.

Try to apply to a "Red Flagged" internship.

Observation: See the IVI Score and the Consent Override Modal.

📊 Projected National Impact
If implemented at scale, InternConnect projects:

📉 40% Reduction in Unpaid Internships via algorithmic enforcement.

📈 25% Rise in Tier-2/3 City Student Participation via verified remote opportunities.

🎯 60% Alignment of the youth workforce to Prime Minister's Vision (Digital/Green India).

🤝 Contributing
Built with ❤️ for Smart India Hackathon.
