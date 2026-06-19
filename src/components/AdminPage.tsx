import React, { useState } from 'react';
import type { ParentProfile } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface Props {
  parent: ParentProfile | null;
  onUpgrade: () => void;
}

export const AdminPage: React.FC<Props> = ({ parent, onUpgrade }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [upgraded, setUpgraded] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin1234') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
      setPassword('');
    }
  };

  const handleUpgrade = () => {
    onUpgrade();
    setUpgraded(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center text-gray-800 mb-2">시스템 관리자 전용</h1>
        <p className="text-center text-gray-500 text-sm mb-8">권한이 없는 사용자는 접근할 수 없습니다.</p>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg font-bold">{error}</p>}
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-red-500 focus:outline-none"
              autoFocus
            />
            <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
              접속하기
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-500 mb-2">현재 로그인된 계정 정보</h3>
              {parent ? (
                <>
                  <p className="text-lg font-black text-gray-800">{parent.parentName}</p>
                  <p className="text-sm text-gray-600 mb-2">{parent.email}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-gray-200 rounded">현재 등급</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${parent.membershipTier === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {parent.membershipTier}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-red-500 font-bold">현재 기기에 로그인된 계정이 없습니다.</p>
              )}
            </div>

            {parent && parent.membershipTier !== 'PREMIUM' && !upgraded && (
              <button 
                onClick={handleUpgrade}
                className="w-full py-4 bg-amber-500 text-white font-black text-lg rounded-xl shadow-lg hover:bg-amber-600 transition-colors animate-pulse"
              >
                PREMIUM 등급으로 즉시 승급
              </button>
            )}

            {upgraded && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-bold border border-emerald-200">
                프리미엄 승급이 완료되었습니다! 🎉
              </div>
            )}

            <button 
              onClick={() => window.location.href = '/'}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 앱으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
