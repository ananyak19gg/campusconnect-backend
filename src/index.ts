import express from 'express';
import * as admin from 'firebase-admin';
import cron from 'node-cron';
import { onPostCreate } from './triggers/onPostCreate';
import { recalculatePanicLevels } from './panicRecalculator';
import { sendDailyNotifications } from './notifications';

const app = express();
app.use(express.json());

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp();
}

// 🕒 Daily Task Audit (Midnight)
cron.schedule('0 0 * * *', async () => {
  console.log("🕒 [CampusConnect] Running Daily Task Audit...");
  await recalculatePanicLevels();
  await sendDailyNotifications();
});

// 📥 API: Create Task from Student Post
app.post('/api/posts', async (req, res) => {
  try {
    const postData = req.body;
    console.log("📩 [CampusConnect] New post received:", postData.title);
    await onPostCreate(postData); 
    res.status(200).send({ 
        status: "success", 
        message: "CampusConnect: Task created successfully!" 
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).send({ status: "error", message: "Failed to create task" });
  }
});

// 🌐 Health Check
app.get('/', (req, res) => {
    res.send('🚀 CampusConnect Backend is Live and Healthy!');
});

// 🛠️ Debug Route: Manually trigger color recalculation
app.post('/api/debug-audit', async (req, res) => {
  await recalculatePanicLevels();
  res.send({ message: "CampusConnect: Panic levels updated!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`📡 [CampusConnect] Server is running on port ${PORT}`);
});