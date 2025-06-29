import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(file: File, path: string): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Sanitize the filename to remove special characters
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
  const fullPath = `${path}/${uniqueFileName}`;
  
  const storageRef = ref(storage, fullPath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    // You might want to re-throw the error or handle it as per your app's needs
    throw error;
  }
}
