import React, { useState } from 'react';
import type { ParentProfile, BudgetRules } from '../types';
import { UserPlus, Lock, Mail, Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  onRegister: (profile: ParentProfile) => void;
  onLogin: () => void;
  onReset: () => void;
  existingProfile: ParentProfile | null;
}

const DEFAULT_RULES: BudgetRules = {
  totalAmount: 5000,
  giveAmount: 500,
  spendAmount: 3000,
  investAmount: 1500,
  extraAmount: 0,
  bonusType: 'SIMPLE',
  bonusRate: 50,
};

export const AuthScreen: React.FC<Props> = ({ onRegister, onLogin, onReset, existingProfile }) => {
  const [isLoginMode] = useState(!!existingProfile);
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [membershipTier, setMembershipTier] = useState<'BASIC' | 'PREMIUM'>('BASIC');
  const [childNames, setChildNames] = useState<string[]>(['']);
  
  const [loginPin, setLoginPin] = useState('');
  const [error, setError] = useState('');

  const handleAddChild = () => setChildNames([...childNames, '']);
  const handleChildNameChange = (index: number, value: string) => {
    const newNames = [...childNames];
    newNames[index] = value;
    setChildNames(newNames);
  };
  const handleRemoveChild = (index: number) => {
    if (childNames.length > 1) {
      setChildNames(childNames.filter((_, i) => i !== index));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !email || pin.length !== 4) {
      setError('모든 정보를 정확히 입력해주세요. (PIN 4자리)');
      return;
    }
    
    const validChildren = childNames.filter(n => n.trim() !== '');
    if (validChildren.length === 0) {
      setError('최소 1명의 자녀를 등록해주세요.');
      return;
    }

    const newParent: ParentProfile = {
      parentName,
      email,
      pin,
      membershipTier,
      children: validChildren.map((name) => ({
        id: crypto.randomUUID ? crypto.randomUUID() : `child_${Math.random().toString(36).substr(2, 9)}`,
        name,
        rules: { ...DEFAULT_RULES },
        initialBalances: { give: 0, spend: 0, invest: 0, extra: 0 },
        transactions: [],
        pendingTransactions: [],
        premiumMode: membershipTier === 'PREMIUM',
        wishlistTarget: 50000,
      }))
    };

    onRegister(newParent);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingProfile && existingProfile.pin === loginPin) {
      onLogin();
    } else {
      setError('비밀번호가 일치하지 않습니다.');
      setLoginPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Mouri</h1>
          <p className="text-indigo-100 text-sm">우리 아이 첫 디지털 저금통</p>
        </div>

        <div className="p-8">
          {isLoginMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-6">부모님 인증</h2>
              {error && <p className="text-sm text-rose-500 text-center bg-rose-50 p-2 rounded-lg">{error}</p>}
              
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm">환영합니다, <strong>{existingProfile?.parentName}</strong>님!</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">4자리 PIN 번호</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    maxLength={4}
                    value={loginPin}
                    onChange={e => setLoginPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-gray-800 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="****"
                  />
                </div>
              </div>
              
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2">
                잠금 해제 <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <button 
                  type="button" 
                  onClick={() => {
                    if (window.confirm('정말 로그아웃(기기 데이터 초기화) 하시겠습니까? 복구할 수 없습니다.')) {
                      onReset();
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-rose-500 transition-colors underline underline-offset-2"
                >
                  기기 데이터 초기화 (완전 로그아웃)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-6">가족 계정 만들기</h2>
              {error && <p className="text-sm text-rose-500 text-center bg-rose-50 p-2 rounded-lg">{error}</p>}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">부모님 이름</label>
                <div className="relative">
                  <UserPlus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={parentName} onChange={e => setParentName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="예: 김아빠" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">이메일 주소</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="example@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">비밀번호 (4자리 PIN) <span className="text-rose-500 font-normal ml-1">아이들이 설정에 못 들어가게 합니다</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none tracking-widest" placeholder="숫자 4자리" />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-700">자녀 등록</label>
                  <button type="button" onClick={handleAddChild} className="text-xs text-indigo-600 font-bold hover:underline">+ 자녀 추가</button>
                </div>
                <div className="space-y-2">
                  {childNames.map((name, idx) => {
                    const prefixes = ['첫째', '둘째', '셋째', '넷째', '다섯째'];
                    const placeholderText = prefixes[idx] ? `${prefixes[idx]} 아이 이름` : `${idx + 1}번째 아이 이름`;
                    return (
                      <div key={idx} className="flex gap-2 relative">
                        <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          value={name} 
                          onChange={e => handleChildNameChange(idx, e.target.value)} 
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                          placeholder={placeholderText} 
                        />
                        {childNames.length > 1 && (
                          <button type="button" onClick={() => handleRemoveChild(idx)} className="text-gray-400 hover:text-rose-500 px-2">✕</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-2">멤버십 선택</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMembershipTier('BASIC')}
                    className={`p-3 rounded-xl border-2 text-left transition-colors ${membershipTier === 'BASIC' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <div className="font-bold text-sm text-gray-800">베이직 (무료)</div>
                    <div className="text-xs text-gray-500 mt-1">3개의 저금통, 기본 통계</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMembershipTier('PREMIUM')}
                    className={`p-3 rounded-xl border-2 text-left transition-colors ${membershipTier === 'PREMIUM' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                  >
                    <div className="font-bold text-sm text-amber-700">👑 프리미엄</div>
                    <div className="text-xs text-amber-600 mt-1">자유 저금통 추가, 파이 차트</div>
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
                가입 및 시작하기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
