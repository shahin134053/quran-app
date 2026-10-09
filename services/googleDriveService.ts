import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

// Define the scopes requested by the user
export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata'
];

let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Handle Google Sign-in to request Google Drive access scopes
 */
export const signInWithGoogleDrive = async (): Promise<{ user: any; accessToken: string } | null> => {
  if (isSigningIn) return null;
  isSigningIn = true;

  try {
    const provider = new GoogleAuthProvider();
    DRIVE_SCOPES.forEach(scope => provider.addScope(scope));
    
    // Always prompt for consent to ensure we get the required tokens
    provider.setCustomParameters({
      prompt: 'consent'
    });

    const result: UserCredential = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential || !credential.accessToken) {
      throw new Error('Failed to retrieve access token from Google Sign-In');
    }

    cachedAccessToken = credential.accessToken;
    return {
      user: result.user,
      accessToken: credential.accessToken
    };
  } catch (error) {
    console.error('Error signing in with Google Drive:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get the cached access token
 */
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Manually set or update the access token (e.g. from app restore)
 */
export const setDriveAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Sign out and clear cached token
 */
export const clearDriveAccessToken = () => {
  cachedAccessToken = null;
};

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  webViewLink: string;
  iconLink?: string;
}

/**
 * List files and folders from Google Drive
 */
export const listDriveFiles = async (
  parentId: string = 'root',
  searchQuery: string = ''
): Promise<DriveFile[]> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Unauthenticated: Access token is missing');

  let queryParts = ["trashed = false"];
  
  if (parentId) {
    queryParts.push(`'${parentId}' in parents`);
  }

  if (searchQuery.trim()) {
    // Sanitize single quotes in search query to prevent injection
    const sanitizedSearch = searchQuery.replace(/'/g, "\\'");
    queryParts.push(`name contains '${sanitizedSearch}'`);
  }

  const q = queryParts.join(' and ');
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent('files(id, name, mimeType, size, createdTime, webViewLink, iconLink)')}&orderBy=folder,name&pageSize=100`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to list Google Drive files');
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (
  folderName: string,
  parentId: string = 'root'
): Promise<DriveFile> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Unauthenticated: Access token is missing');

  const url = 'https://www.googleapis.com/drive/v3/files';
  const body = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId ? [parentId] : undefined,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to create Google Drive folder');
  }

  return response.json();
};

/**
 * Upload a file to Google Drive using a multipart request
 */
export const uploadFileToDrive = async (
  file: File,
  parentId: string = 'root'
): Promise<DriveFile> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Unauthenticated: Access token is missing');

  const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  
  // Create metadata
  const metadata = {
    name: file.name,
    parents: parentId ? [parentId] : undefined,
  };

  const boundary = 'foo_bar_boundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  
  const fileDataPromise = new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });

  const arrayBuffer = await fileDataPromise;
  if (!arrayBuffer) throw new Error('Failed to read file content');

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaPartHeader = `\r\n--${boundary}\r\nContent-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;

  // Construct request body using a Blob to combine text and binary arrayBuffer
  const requestBody = new Blob([
    metadataPart,
    mediaPartHeader,
    arrayBuffer,
    closeDelimiter
  ]);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: requestBody,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to upload file to Google Drive');
  }

  return response.ok ? response.json() : Promise.reject('Upload failed');
};

/**
 * Delete a file or folder in Google Drive
 */
export const deleteDriveFile = async (fileId: string): Promise<boolean> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Unauthenticated: Access token is missing');

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to delete file from Google Drive');
  }

  return true;
};
