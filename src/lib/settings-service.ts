
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { PrintSettings } from '@/types/settings';
import { db } from './firebase';

const settingsCollectionRef = 'print_settings';
const defaultSettingsDocId = 'default';

export async function getPrintSettings(): Promise<PrintSettings | null> {
  try {
    const settingsDocRef = doc(db, settingsCollectionRef, defaultSettingsDocId);
    const docSnap = await getDoc(settingsDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PrintSettings;
    } else {
      // Return default or empty settings if not found
      return null;
    }
  } catch (error) {
    console.error("Error fetching print settings: ", error);
    throw error;
  }
}

export async function updatePrintSettings(settings: Partial<PrintSettings>): Promise<void> {
  try {
    const settingsDocRef = doc(db, settingsCollectionRef, defaultSettingsDocId);
    // Use setDoc with merge: true to create or update the document
    await setDoc(settingsDocRef, settings, { merge: true }); 
  } catch (error) {
    console.error("Error updating print settings: ", error);
    throw error;
  }
}
