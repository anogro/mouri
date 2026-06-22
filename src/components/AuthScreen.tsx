import React, { useState } from 'react';
import type { ParentProfile, BudgetRules } from '../types';
import { UserPlus, Lock, Mail, Users, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    if (!parentName || !email || pin.length !== 4 || childNames.some(n => !n.trim())) {
      setError('모든 항목을 올바르게 입력해주세요 (비밀번호는 4자리 숫자).');
      return;
    }

    const newParent: ParentProfile = {
      parentName,
      email,
      pin,
      membershipTier: 'BASIC',
      children: childNames.filter(n => n.trim()).map(name => ({
        id: crypto.randomUUID(),
        name: name.trim(),
        rules: {
          ...DEFAULT_RULES,
          customAccounts: {
            give: { name: '기부 저금통', emoji: '🤝' },
            spend: { name: '지출 저금통', emoji: '💳' },
            invest: { name: '투자 저금통', emoji: '📈' },
            extra: { name: '자유 저금통', emoji: '💰' }
          }
        },
        initialBalances: { give: 0, spend: 0, invest: 0, extra: 0 },
        transactions: [],
        pendingTransactions: [],
        premiumMode: false,
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
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 text-6xl opacity-20 hidden md:block"
      >
        🎈
      </motion.div>
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 text-6xl opacity-20 hidden md:block"
      >
        🦄
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="glass-card w-full max-w-md rounded-[2.5rem] overflow-hidden relative z-10"
      >
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,255,255,0.3)] border border-white/40"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="relative text-4xl font-black text-white mb-2 tracking-tight">Mouri</h1>
          <p className="relative text-white/90 font-medium">우리 아이의 첫 핀테크 놀이터</p>
        </div>

        <div className="p-8 sm:p-10 bg-white/40 backdrop-blur-xl">
          {isLoginMode ? (
            <motion.form 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              onSubmit={handleLoginSubmit} className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">반가워요!</h2>
                <p className="text-gray-600 font-medium text-lg">
                  <span className="text-indigo-600 font-black">{existingProfile?.parentName}</span> 님, PIN을 입력해주세요
                </p>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-rose-600 text-center bg-rose-100/80 p-3 rounded-2xl font-bold">
                  {error}
                </motion.p>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">4자리 PIN 번호</label>
                <div className="relative">
                  <Lock className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                  <input 
                    type="password" 
                    maxLength={4}
                    value={loginPin}
                    onChange={e => setLoginPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-white/80 border-2 border-indigo-100 rounded-2xl pl-12 pr-4 py-4 text-2xl font-black text-gray-800 tracking-[0.5em] text-center focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner"
                    placeholder="****"
                  />
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                잠금 해제 <ArrowRight className="w-6 h-6" />
              </motion.button>

              <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                <button 
                  type="button" 
                  onClick={() => {
                    if (window.confirm('정말 기기를 초기화하시겠습니까? 데이터는 복구할 수 없습니다.')) {
                      onReset();
                    }
                  }}
                  className="text-sm font-semibold text-gray-400 hover:text-rose-500 transition-colors underline underline-offset-4"
                >
                  기기 데이터 초기화 (로그아웃)
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              onSubmit={handleRegister} className="space-y-5"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">새로운 여정 시작하기</h2>
                <p className="text-sm text-gray-500 mt-1">부모님 정보를 입력해주세요</p>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-rose-600 text-center bg-rose-100/80 p-3 rounded-2xl font-bold">
                  {error}
                </motion.p>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">부모님 이름</label>
                <div className="relative">
                  <UserPlus className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={parentName} onChange={e => setParentName(e.target.value)} className="w-full bg-white/70 border-2 border-transparent focus:border-indigo-300 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm" placeholder="예: 김아빠" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">이메일 주소</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/70 border-2 border-transparent focus:border-indigo-300 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm" placeholder="example@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">앱 비밀번호 (4자리 PIN) <span className="text-rose-500 font-medium ml-1">아이들이 모르게 하세요!</span></label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-white/70 border-2 border-transparent focus:border-indigo-300 rounded-xl pl-10 pr-3 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all tracking-[0.5em] shadow-sm" placeholder="숫자 4자리" />
                </div>
              </div>

              <div className="pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-gray-700 ml-1">아이 등록</label>
                  <button type="button" onClick={handleAddChild} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold hover:bg-indigo-200 transition-colors">+ 아이 추가</button>
                </div>
                <div className="space-y-3">
                  {childNames.map((name, idx) => {
                    const prefixes = ['첫째', '둘째', '셋째', '넷째', '다섯째'];
                    const placeholderText = prefixes[idx] ? `${prefixes[idx]} 아이 이름` : `${idx + 1}번째 아이 이름`;
                    return (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex gap-2 relative">
                        <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          value={name} 
                          onChange={e => handleChildNameChange(idx, e.target.value)} 
                          className="flex-1 bg-white/70 border-2 border-transparent focus:border-indigo-300 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm" 
                          placeholder={placeholderText} 
                        />
                        {childNames.length > 1 && (
                          <button type="button" onClick={() => handleRemoveChild(idx)} className="text-gray-400 hover:text-rose-500 px-3 transition-colors text-lg font-bold">×</button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-600/20"
              >
                가입 완료 및 시작하기
              </motion.button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
