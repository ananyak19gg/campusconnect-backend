import * as admin from 'firebase-admin';

export const onPostCreate = async (postData: any) => {
  const db = admin.firestore();
  
  // 1. Calculate the initial Panic Level based on the deadline
  let panicLevel = 'LOW';
  const deadlineDate = new Date(postData.deadline).getTime();
  const now = Date.now();
  const daysUntil = (deadlineDate - now) / (1000 * 60 * 60 * 24);

  if (daysUntil <= 3) {
    panicLevel = 'HIGH'; // 🔴
  } else if (daysUntil <= 7) {
    panicLevel = 'MEDIUM'; // 🟡
  }

  // 2. Save it to the "tasks" collection in Firebase
  const taskRef = await db.collection('tasks').add({
    title: postData.title,
    description: postData.description,
    deadline: postData.deadline,
    panicLevel: panicLevel,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'TODO'
  });

  console.log(`✅ [CampusConnect] Task created with ID: ${taskRef.id}`);
  return taskRef.id;
};