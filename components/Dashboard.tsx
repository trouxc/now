import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import StudyFilesView from './StudyFilesView';

const Header: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
    <div className="text-xl font-bold text-white">
      <span className="text-indigo-400">دفعتنا</span> | لوحة التحكم
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

const StatCard: React.FC<{ title: string; value: string; icon: JSX.Element }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 space-x-reverse">
        <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const FeatureCard: React.FC<{ title: string; icon: JSX.Element; onClick: () => void }> = ({ title, icon, onClick }) => (
    <button onClick={onClick} className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 space-x-reverse hover:bg-gray-700/80 transition-transform transform hover:-translate-y-1 duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
        <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-lg font-bold text-white text-right">{title}</p>
        </div>
    </button>
);


const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;


const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState('main'); // 'main' or 'studyFiles'

  if (!user) {
    // This should not happen if App component logic is correct, but it's a good safeguard.
    return null;
  }

  if (view === 'studyFiles') {
      return <StudyFilesView onBack={() => setView('main')} user={user} onLogout={logout} />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header user={user} onLogout={logout} />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-8">أهلاً بك في لوحة التحكم، {user.username}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="المقررات المسجلة" value="6" icon={<BookOpenIcon />} />
            <StatCard title="إشعارات جديدة" value="3" icon={<BellIcon />} />
            <StatCard title="المهام القادمة" value="2" icon={<CalendarIcon />} />
            <FeatureCard title="ملفات دراسية" icon={<FolderIcon />} onClick={() => setView('studyFiles')} />
        </div>

        <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">إعلانات هامة</h2>
            <ul className="space-y-4">
                <li className="p-4 bg-gray-700/50 rounded-md">
                    <p className="font-semibold text-indigo-400">تأجيل امتحان التفاضل والتكامل</p>
                    <p className="text-sm text-gray-300 mt-1">تم تأجيل امتحان التفاضل والتكامل المقرر يوم الأحد القادم إلى إشعار آخر.</p>
                </li>
                <li className="p-4 bg-gray-700/50 rounded-md">
                    <p className="font-semibold text-indigo-400">ورشة عمل حول الذكاء الاصطناعي</p>
                    <p className="text-sm text-gray-300 mt-1">ندعوكم لحضور ورشة عمل مميزة يوم الثلاثاء في قاعة المؤتمرات الرئيسية.</p>
                </li>
            </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
