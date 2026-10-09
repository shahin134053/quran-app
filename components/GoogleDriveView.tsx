import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Folder, File, FileText, Headphones, Image, Trash2, 
  Plus, Search, RefreshCw, Upload, Download, LogOut, ChevronRight, 
  ExternalLink, AlertCircle, CheckCircle, Moon, FileUp
} from 'lucide-react';
import { 
  signInWithGoogleDrive, 
  listDriveFiles, 
  createDriveFolder, 
  uploadFileToDrive, 
  deleteDriveFile, 
  getDriveAccessToken, 
  clearDriveAccessToken,
  DriveFile 
} from '../services/googleDriveService';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface GoogleDriveViewProps {
  setActiveTab: (tab: string) => void;
}

interface Breadcrumb {
  id: string;
  name: string;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({ setActiveTab }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getDriveAccessToken());
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: 'root', name: 'Al-Muneer Cloud' }]);
  
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Auto-clear status messages
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setIsAuthenticated(false);
        clearDriveAccessToken();
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch files from Google Drive
  const fetchFiles = useCallback(async (folderId: string = currentFolder, query: string = searchQuery) => {
    if (!getDriveAccessToken()) return;
    setLoading(true);
    try {
      const data = await listDriveFiles(folderId, query);
      setFiles(data);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load drive files' });
      if (err.message?.includes('Unauthenticated') || err.message?.includes('401')) {
        setIsAuthenticated(false);
        clearDriveAccessToken();
      }
    } finally {
      setLoading(false);
    }
  }, [currentFolder, searchQuery]);

  // Trigger fetch on tab mount or authenticated change
  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles(currentFolder, searchQuery);
    }
  }, [isAuthenticated, currentFolder, searchQuery, fetchFiles]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogleDrive();
      if (result) {
        setIsAuthenticated(true);
        setStatusMessage({ type: 'success', text: 'Successfully authenticated with Google Drive!' });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to authenticate with Google Drive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearDriveAccessToken();
    setIsAuthenticated(false);
    setFiles([]);
    setBreadcrumbs([{ id: 'root', name: 'Al-Muneer Cloud' }]);
    setCurrentFolder('root');
    setStatusMessage({ type: 'success', text: 'Disconnected from Google Drive' });
  };

  // Create folder operation
  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    setActionLoading(true);
    try {
      const result = await createDriveFolder(newFolderName.trim(), currentFolder);
      setStatusMessage({ type: 'success', text: `Folder "${result.name}" created successfully` });
      setNewFolderName('');
      setShowCreateFolder(false);
      fetchFiles(currentFolder);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to create folder' });
    } finally {
      setActionLoading(false);
    }
  };

  // Upload file operation
  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    setActionLoading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setStatusMessage({ type: 'success', text: `Uploading "${file.name}"...` });
        await uploadFileToDrive(file, currentFolder);
      }
      setStatusMessage({ type: 'success', text: 'All files uploaded successfully' });
      fetchFiles(currentFolder);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload file(s)' });
    } finally {
      setActionLoading(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Delete operation - MANDATORY user confirmation included!
  const handleDeleteFile = async (file: DriveFile) => {
    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
    const message = `Are you sure you want to permanently delete the ${isFolder ? 'folder' : 'file'} "${file.name}"? This action cannot be undone.`;
    
    const confirmed = window.confirm(message);
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await deleteDriveFile(file.id);
      setStatusMessage({ type: 'success', text: `"${file.name}" was successfully deleted` });
      fetchFiles(currentFolder);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete' });
    } finally {
      setActionLoading(false);
    }
  };

  // Navigate deeper into folders
  const handleFolderClick = (folder: DriveFile) => {
    setCurrentFolder(folder.id);
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  // Navigate using breadcrumbs
  const handleBreadcrumbClick = (crumb: Breadcrumb, index: number) => {
    setCurrentFolder(crumb.id);
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  // Get File Icons matching mime types
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder size={24} className="text-amber-500 fill-amber-500" />;
    }
    if (mimeType.startsWith('image/')) {
      return <Image size={24} className="text-rose-500" />;
    }
    if (mimeType.startsWith('audio/') || mimeType === 'application/vnd.google-apps.audio') {
      return <Headphones size={24} className="text-emerald-500" />;
    }
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text/')) {
      return <FileText size={24} className="text-indigo-500" />;
    }
    return <File size={24} className="text-slate-400" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pt-4 pb-12"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('home')} 
            className="p-3 glass rounded-2xl active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-gradient">Islamic Cloud</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
              Sync and backup Islamic documents, Quran recitations & Dua notes
            </p>
          </div>
        </div>
        {isAuthenticated && (
          <button 
            onClick={handleSignOut}
            className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/30 dark:text-rose-400 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all"
            title="Disconnect Google Drive"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Disconnect</span>
          </button>
        )}
      </div>

      {/* Status messages alert toast */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center gap-3 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30' 
                : 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-xs font-bold">{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Processing file operation...</span>
          </div>
        </div>
      )}

      {/* Auth state screen */}
      {!isAuthenticated ? (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 card-shadow border border-white/20 dark:border-slate-700/30 text-center space-y-8 max-w-lg mx-auto mt-8">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2rem] rotate-45 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <Moon size={48} className="-rotate-45" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Connect with Google Drive</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
              Save your Islamic library books, recitation audios, and daily notes to your private cloud storage. With permission, Al-Muneer will let you upload, download, and manage your custom media files.
            </p>
          </div>
          
          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw size={24} className="animate-spin" />
            ) : (
              <>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.742-.079-1.306-.176-1.855H12.24z"/>
                </svg>
                <span>Authorize Google Drive</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Breadcrumbs Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 px-2 text-sm font-bold text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                {index > 0 && <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />}
                <button 
                  onClick={() => handleBreadcrumbClick(crumb, index)}
                  className={`hover:text-emerald-600 transition-colors ${
                    index === breadcrumbs.length - 1 ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search, New Folder, and Upload Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search files in Cloud..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] py-4 pl-14 pr-6 card-shadow focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-sm tracking-tight" 
              />
            </div>
            
            <div className="md:col-span-6 flex items-center gap-3">
              <button 
                onClick={() => setShowCreateFolder(!showCreateFolder)}
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 dark:text-indigo-400 rounded-2xl py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all"
              >
                <Plus size={16} />
                <span>New Folder</span>
              </button>
              
              <label 
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-2xl py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center"
              >
                <Upload size={16} />
                <span>Upload File</span>
                <input 
                  type="file" 
                  multiple 
                  onChange={(e) => handleFileUpload(e.target.files)} 
                  className="hidden" 
                />
              </label>

              <button 
                onClick={() => fetchFiles(currentFolder)}
                disabled={loading}
                className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-2xl transition-all"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Form to create a new folder */}
          <AnimatePresence>
            {showCreateFolder && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateFolderSubmit}
                className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center gap-4 overflow-hidden"
              >
                <input 
                  type="text" 
                  required
                  placeholder="Enter folder name..." 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-sm"
                />
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <button 
                    type="button"
                    onClick={() => setShowCreateFolder(false)}
                    className="flex-1 sm:flex-initial py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 sm:flex-initial py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                  >
                    Create
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Drag & Drop Upload Zone + Files list */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[400px] rounded-[2.5rem] border-2 border-dashed p-1 relative transition-colors duration-300 flex flex-col ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-50/20' 
                : 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800'
            }`}
          >
            {/* Dragging indicator overlay */}
            {isDragging && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-emerald-50/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-[2.5rem] pointer-events-none space-y-4">
                <div className="p-6 bg-emerald-500 text-white rounded-full animate-bounce shadow-lg">
                  <FileUp size={48} />
                </div>
                <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">Drop files to upload instantly</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Supports multiple document and media formats</p>
              </div>
            )}

            <div className="flex-1 p-6 flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
                  <RefreshCw size={40} className="animate-spin text-emerald-500" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Listing items...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400">
                    <Folder size={36} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-200">No items found</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-xs mx-auto">
                      This folder is empty. Drag & drop files here, or use the "Upload File" and "New Folder" buttons to start.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <div className="col-span-8 sm:col-span-9 md:col-span-10">Name</div>
                    <div className="col-span-4 sm:col-span-3 md:col-span-2 text-right">Actions</div>
                  </div>
                  
                  <div className="space-y-2">
                    {files.map((file) => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                      return (
                        <div 
                          key={file.id}
                          className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 transition-colors"
                        >
                          {/* Left: icon + name */}
                          <div 
                            className={`col-span-8 sm:col-span-9 md:col-span-10 flex items-center gap-4 ${isFolder ? 'cursor-pointer' : ''}`}
                            onClick={() => isFolder ? handleFolderClick(file) : window.open(file.webViewLink, '_blank')}
                          >
                            <div className="shrink-0">
                              {getFileIcon(file.mimeType)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate block group-hover:text-emerald-500 transition-colors">
                                {file.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1 text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                                <span>{isFolder ? 'Folder' : 'File'}</span>
                                {!isFolder && file.size && (
                                  <>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span>{(parseInt(file.size) / (1024 * 1024)).toFixed(2)} MB</span>
                                  </>
                                )}
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span>{new Date(file.createdTime).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: action buttons */}
                          <div className="col-span-4 sm:col-span-3 md:col-span-2 flex items-center justify-end gap-1.5 sm:gap-2">
                            {!isFolder && (
                              <a 
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 sm:p-2.5 bg-white hover:bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all"
                                title="Open in browser"
                              >
                                <ExternalLink size={15} />
                              </a>
                            )}
                            <button 
                              onClick={() => handleDeleteFile(file)}
                              className="p-2 sm:p-2.5 bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 rounded-xl transition-all"
                              title="Delete item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default GoogleDriveView;
