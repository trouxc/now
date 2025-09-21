import React, { useState, useEffect, useMemo } from 'react';
import type { StudyFile, User } from '../types';
import Input from './common/Input';
import Button from './common/Button';

// Icons
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

// A static folder structure definition
const FOLDER_STRUCTURE: Record<string, any> = {
    'ملفات وزارية': {
        'العناية المركزة': 'ministerial-intensive-care',
        'اسس التخدير': 'ministerial-anesthesia-basics',
    },
    'ملفات مواد غير وزارية': {},
};

// Custom hook to manage file state with localStorage
const useFileStorage = (subjectKey: string | null) => {
    const [files, setFiles] = useState<StudyFile[]>([]);

    useEffect(() => {
        if (!subjectKey) return;
        try {
            const item = window.localStorage.getItem(subjectKey);
            if (item) {
                setFiles(JSON.parse(item));
            } else {
                setFiles([]);
            }
        } catch (error) {
            console.error('Error reading from localStorage', error);
            setFiles([]);
        }
    }, [subjectKey]);

    const addFile = (file: { name: string; url: string }) => {
        if (!subjectKey) return;
        const newFile = { ...file, id: Date.now().toString() };
        try {
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            window.localStorage.setItem(subjectKey, JSON.stringify(updatedFiles));
        } catch (error) {
            console.error('Error writing to localStorage', error);
        }
    };

    return { files, addFile };
};

const Header: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-white">
        <span className="text-indigo-400">دفعتنا</span> | ملفات دراسية
      </div>
      <div className="flex items-center">
        <span className="text-gray-300 mr-4">مرحباً، {user.username}</span>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
        >
          تسجيل الخروج
        </button>
      </div>
    </header>
  );

const StudyFilesView: React.FC<{ onBack: () => void; user: User; onLogout: () => void; }> = ({ onBack, user, onLogout }) => {
    const [path, setPath] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [newFileUrl, setNewFileUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const { currentLevel, subjectKey } = useMemo(() => {
        let level: any = FOLDER_STRUCTURE;
        for (const segment of path) {
            level = level?.[segment];
        }
        return {
            currentLevel: level,
            subjectKey: typeof level === 'string' ? level : null,
        };
    }, [path]);

    const { files, addFile } = useFileStorage(subjectKey);
    
    const handleAddFile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFileName.trim() || !newFileUrl.trim()) return;
        
        try {
             // Basic URL validation
            new URL(newFileUrl);
        } catch (_) {
            alert('الرجاء إدخال رابط صحيح.');
            return;
        }

        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            addFile({ name: newFileName, url: newFileUrl });
            setNewFileName('');
            setNewFileUrl('');
            setIsModalOpen(false);
            setLoading(false);
        }, 500);
    };

    const renderContent = () => {
        if (subjectKey) { // File list view
            return (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                        <h2 className="text-2xl font-bold text-white">الملفات المتاحة</h2>
                        <Button onClick={() => setIsModalOpen(true)}>
                           <PlusIcon/> إضافة ملف
                        </Button>
                    </div>
                    {files.length > 0 ? (
                        <ul className="space-y-3">
                            {files.map(file => (
                                <li key={file.id}>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors duration-200 group">
                                        <div className="flex items-center">
                                            <FileTextIcon />
                                            <span className="mr-4 font-medium text-gray-200">{file.name}</span>
                                        </div>
                                        <ExternalLinkIcon />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-400">لا توجد ملفات في هذا المجلد بعد.</p>
                            <p className="text-gray-500 text-sm mt-2">يمكنك إضافة الملف الأول الآن.</p>
                        </div>
                    )}
                </div>
            );
        }

        if (currentLevel && typeof currentLevel === 'object') { // Folder view
            return (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Object.keys(currentLevel).length > 0 ? Object.keys(currentLevel).map(folderName => (
                         <button key={folderName} onClick={() => setPath([...path, folderName])} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-3 hover:bg-gray-700/80 transition-transform transform hover:-translate-y-1 duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                             <FolderIcon />
                             <span className="font-bold text-white text-lg text-center">{folderName}</span>
                         </button>
                     )) : (
                        <div className="col-span-full text-center py-10">
                           <p className="text-gray-400">لا توجد مجلدات فرعية هنا.</p>
                        </div>
                     )}
                 </div>
            );
        }
        
        return null;
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header user={user} onLogout={onLogout} />
            <main className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center text-sm text-gray-400 font-medium space-x-2 space-x-reverse">
                        <button onClick={onBack} className="hover:text-indigo-400">لوحة التحكم</button>
                        {path.map((segment, index) => (
                           <React.Fragment key={index}>
                                <span>/</span>
                                <button onClick={() => setPath(path.slice(0, index + 1))} className="hover:text-indigo-400">{segment}</button>
                           </React.Fragment>
                        ))}
                    </div>
                     <button onClick={path.length === 0 ? onBack : () => setPath(path.slice(0, -1))} className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm font-medium">
                        <ArrowRightIcon />
                        رجوع
                    </button>
                </div>
                {renderContent()}
            </main>

            {/* Add File Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-8">
                        <h2 id="modal-title" className="text-2xl font-bold text-white mb-6">إضافة ملف جديد</h2>
                        <form onSubmit={handleAddFile} className="space-y-6">
                             <Input
                                id="file-name"
                                label="اسم الملف"
                                type="text"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                placeholder="مثال: المحاضرة الأولى"
                                required
                            />
                            <Input
                                id="file-url"
                                label="رابط الملف"
                                type="url"
                                value={newFileUrl}
                                onChange={(e) => setNewFileUrl(e.target.value)}
                                placeholder="https://example.com/file.pdf"
                                required
                            />
                            <div className="flex justify-end items-center space-x-4 space-x-reverse pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-300 hover:text-white">
                                    إلغاء
                                </button>
                                <Button type="submit" isLoading={loading} className="w-auto px-6">
                                    إضافة
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyFilesView;
