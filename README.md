# Xeno: AI-Native Shopper CRM

An intelligent, AI-first Customer Relationship Management (CRM) system designed for Direct-to-Consumer (D2C) brands. This platform allows marketers to build highly targeted shopper segments using natural language and orchestrate personalized messaging campaigns.

## Features

* **Natural Language Audience Terminal**: Simply type *"Find all VIP shoppers with an LTV over $1000"* and the AI Engine automatically translates your intent into complex MongoDB queries to instantly synthesize a target audience.
* **Intelligent Campaign Canvas**: Write a rough message template and the built-in AI will dynamically personalize the tone and content for each individual shopper based on their past purchase behavior and tags.
* **Real-Time Delivery Dashboard**: A beautifully designed analytics dashboard powered by WebSockets. Watch Delivery Rates and Click-to-Open rates tick up live as the mock channel service processes webhook receipts.
* **Premium Editorial UI**: A sophisticated, glassmorphism-inspired interface built from scratch using vanilla CSS and React, bypassing generic Tailwind/Bootstrap components for a deeply custom, high-end aesthetic.

## Architecture

The system is split into three core microservices:

1. **React Frontend (`/frontend`)**: The client-side dashboard featuring Recharts for interactive analytics and Socket.io for real-time Webhook updates.
2. **CRM Node.js Backend (`/backend`)**: The core API server connecting to MongoDB Atlas and the Gemini API. Handles segmentation, campaign tracking, and webhook ingest.
3. **Channel Service Stub (`/channel-service`)**: A simulated mock messaging provider (simulating WhatsApp/SMS). It accepts dispatch requests and asynchronously fires back webhooks (Delivered, Opened, Clicked) to the CRM with realistic delays.

## Tech Stack

* **Frontend**: React (Vite), React Router, Recharts, Lucide Icons, Sonner (Toasts)
* **Backend**: Node.js, Express, Mongoose (MongoDB), Socket.io, Google Gemini API SDK (`@google/genai`)
* **Database**: MongoDB Atlas
* **Data Seeding**: Faker.js

## Getting Started

### 1. Prerequisites
* Node.js (v18+)
* A MongoDB Atlas Cluster (or local MongoDB running on port `27017`)
* A Google Gemini API Key

### 2. Environment Setup

Create a `.env` file inside the `backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/xeno_crm?retryWrites=true&w=majority
PORT=3001
CHANNEL_SERVICE_URL=http://localhost:3002/api/send
```

### 3. Install & Seed the Database

Open a terminal and run the seeder to populate the database with 10,000 realistic shopper profiles:
```bash
cd backend
npm install
node src/seeds.js
```

### 4. Run the Servers

You will need **three separate terminals** to run the full microservice architecture.

**Terminal 1 (The Frontend):**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 (The Core CRM Backend):**
```bash
cd backend
node src/index.js
```

**Terminal 3 (The Mock Channel Service):**
```bash
cd channel-service
npm install
node src/index.js
```

## How to Test the E2E Flow

1. Open `http://localhost:5173`. Click "Open Workspace".
2. Navigate to the **Audience Terminal**. Type a query like *"Shoppers with an LTV over 2000"*.
3. Navigate to the **Campaign Canvas**. Create a campaign, paste the same query, and write a template message.
4. Click **Simulate Draft** to see the AI generate a personalized draft.
5. Click **Dispatch**. 
6. Quickly navigate to the **Dashboard**. Watch the "Delivery Rate" numbers update in real-time via WebSockets as the Channel Service processes the simulated deliveries!
