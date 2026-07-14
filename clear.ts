import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const snapshot = await getDocs(collection(db, 'participants'));
    const data = [];
    const deletePromises = [];
    
    snapshot.forEach(d => {
      data.push({ id: d.id, ...d.data() });
      deletePromises.push(deleteDoc(doc(db, 'participants', d.id)));
    });
    
    console.log("=== DATA START ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("=== DATA END ===");
    
    await Promise.all(deletePromises);
    console.log("Successfully deleted " + deletePromises.length + " documents.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
