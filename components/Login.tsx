
import React, { useState } from 'react';
import Input from './common/Input';
import Button from './common/Button';
import { useAuth } from '../hooks/useAuth';

const GraduationCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 1.66 4 3 10 0v-5"/>
    </svg>
);


const LoginForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">مرحباً بعودتك</h2>
      <p className="text-gray-400 mb-8 text-center">سجل الدخول للمتابعة</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="login-username"
          label="اسم المستخدم"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          id="login-password"
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <Button type="submit" isLoading={loading}>
          تسجيل الدخول
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        ليس لديك حساب؟{' '}
        <button onClick={onSwitch} className="font-medium text-indigo-400 hover:text-indigo-300">
          إنشاء حساب
        </button>
      </p>
    </div>
  );
};

const SignupForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    return (
        <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h2>
            <p className="text-gray-400 mb-8">انضم إلى مجتمعنا الأكاديمي</p>
            <form className="space-y-6">
                <Input id="signup-username" label="اسم المستخدم" type="text" required />
                <Input id="signup-email" label="البريد الإلكتروني" type="email" required />
                <Input id="signup-password" label="كلمة المرور" type="password" required />
                <Button type="submit">
                    إنشاء حساب
                </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-400">
                لديك حساب بالفعل؟{' '}
                <button onClick={onSwitch} className="font-medium text-indigo-400 hover:text-indigo-300">
                    تسجيل الدخول
                </button>
            </p>
        </div>
    );
};

const Login: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl min-h-[600px] bg-gray-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center order-2 md:order-1">
          <div className="w-full max-w-sm mx-auto">
            {isLoginView ? (
              <LoginForm onSwitch={() => setIsLoginView(false)} />
            ) : (
              <SignupForm onSwitch={() => setIsLoginView(true)} />
            )}
             <p className="text-xs text-gray-500 text-center mt-12">
                All Rights Reserved © Ali Maytham
             </p>
          </div>
        </div>

        {/* Branding Panel */}
        <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-indigo-800 to-gray-900 flex flex-col justify-center items-center text-center order-1 md:order-2">
            <GraduationCapIcon />
            <h1 className="text-5xl font-bold mt-4">دفعتنا</h1>
            <p className="text-indigo-200 mt-4 leading-relaxed">
                بوابتك نحو مستقبل أكاديمي مشرق. تواصل، تعلم، وتفوق.
            </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
