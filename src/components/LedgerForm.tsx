import React, { useState } from 'react';
import type { Transaction, TransactionType } from '../types';
import { PlusCircle, MinusCircle, Wallet, Coffee, Gamepad2, Gift, Pencil, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  transactions: Transaction[];
  premiumMode: boolean;
  rules?: any;
  onAddTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void;
}

export const LedgerForm: React.FC<Props> = ({ transactions, premiumMode, rules, onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>('SPEND');
  const [accountId, setAccountId] = useState<'GIVE' | 'SPEND' | 'INVEST' | 'EXTRA' | 'WISHLIST'>('SPEND');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('간식');

  const categories = [
    { id: '간식', icon: <Coffee className="w-4 h-4" /> },
    { id: '장난감', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: '학용품', icon: <Pencil className="w-4 h-4" /> },
    { id: '선물', icon: <Gift className="w-4 h-4" /> },
    { id: '기타', icon: <Star className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    onAddTransaction({
      type,
      accountId,
      amount: Number(amount),
      description: description || category,
      category
    });

    setAmount('');
    setDescription('');
  };

  const getAccountColor = (id: string) => {
    switch(id) {
      case 'GIVE': return 'text-pink-600 bg-pink-100/50 border-pink-200';
      case 'SPEND': return 'text-amber-600 bg-amber-100/50 border-amber-200';
      case 'INVEST': return 'text-emerald-600 bg-emerald-100/50 border-emerald-200';
      case 'EXTRA': return 'text-gray-600 bg-gray-200/50 border-gray-300';
      case 'WISHLIST': return 'text-blue-600 bg-blue-100/50 border-blue-200';
      default: return 'text-gray-600 bg-gray-100/50 border-gray-200';
    }
  };

  const custom = rules?.customAccounts || {
    give: { name: '기부 통장', emoji: '🤝' },
    spend: { name: '지출 통장', emoji: '💳' },
    invest: { name: '투자 통장', emoji: '📈' },
    extra: { name: '자유 저금통', emoji: '💰' }
  };

  const getAccountName = (id: string | undefined) => {
    switch(id) {
      case 'GIVE': return custom.give.name;
      case 'SPEND': return custom.spend.name;
      case 'INVEST': return custom.invest.name;
      case 'EXTRA': return custom.extra.name;
      case 'WISHLIST': return '위시리스트';
      default: return '기타';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 폼 영역 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 } as any}
        className="glass-card rounded-[2rem] p-6 lg:p-8"
      >
        <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <Wallet className="text-indigo-500" /> 용돈 기입장 쓰기
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => { setType('EARN'); setAccountId('SPEND'); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === 'EARN' || type === 'BONUS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              용돈 받기
            </button>
            <button
              type="button"
              onClick={() => { setType('SPEND'); setAccountId('SPEND'); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === 'SPEND' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              용돈 쓰기
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">어느 저금통에서?</label>
            <div className="grid grid-cols-3 gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setAccountId('GIVE')} className={`py-3 text-sm font-bold rounded-2xl border-2 transition-colors ${accountId === 'GIVE' ? 'bg-pink-50 border-pink-300 text-pink-700' : 'bg-white/60 border-transparent text-gray-500 hover:bg-white'}`}>{custom.give.name.substring(0,4)}</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setAccountId('SPEND')} className={`py-3 text-sm font-bold rounded-2xl border-2 transition-colors ${accountId === 'SPEND' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white/60 border-transparent text-gray-500 hover:bg-white'}`}>{custom.spend.name.substring(0,4)}</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setAccountId('INVEST')} className={`py-3 text-sm font-bold rounded-2xl border-2 transition-colors ${accountId === 'INVEST' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white/60 border-transparent text-gray-500 hover:bg-white'}`}>{custom.invest.name.substring(0,4)}</motion.button>
              {premiumMode && (
                <>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setAccountId('EXTRA')} className={`py-3 text-sm font-bold rounded-2xl border-2 transition-colors ${accountId === 'EXTRA' ? 'bg-gray-100 border-gray-300 text-gray-800' : 'bg-white/60 border-transparent text-gray-500 hover:bg-white'}`}>{custom.extra.name.substring(0,4)}</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setAccountId('WISHLIST')} className={`col-span-2 py-3 text-sm font-bold rounded-2xl border-2 transition-colors ${accountId === 'WISHLIST' ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white/60 border-transparent text-gray-500 hover:bg-white'}`}>위시리스트 (프리미엄)</motion.button>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">얼마를 쓸까요?</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xl">₩</span>
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/80 border-2 border-indigo-100 focus:border-indigo-400 rounded-2xl pl-10 pr-4 py-4 text-2xl font-black text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="0"
                required
              />
            </div>
          </div>

          {type === 'SPEND' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">어디에 썼나요?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map(c => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={c.id}
                    type="button"
                    onClick={() => { setCategory(c.id); setDescription(c.id); }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${category === c.id ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white/60 border-transparent text-gray-600 hover:bg-white'}`}
                  >
                    {c.icon} {c.id}
                  </motion.button>
                ))}
              </div>
              <input 
                type="text" 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white/80 border-2 border-indigo-100 focus:border-indigo-400 rounded-2xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="직접 입력할 수 있어요"
              />
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 transition-colors ${type === 'EARN' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/20' : 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/20'}`}
          >
            {type === 'EARN' ? <><PlusCircle className="w-6 h-6" /> 받았어요!</> : <><MinusCircle className="w-6 h-6" /> 썼어요!</>}
          </motion.button>
        </form>
      </motion.div>

      {/* 내역 목록 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 } as any}
        className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col h-[600px]"
      >
        <h3 className="text-xl font-black text-gray-800 mb-6">최근 내역</h3>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
          <AnimatePresence>
            {transactions.slice().reverse().map((t) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/70 backdrop-blur-sm border border-white p-4 rounded-2xl shadow-sm flex justify-between items-center group hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border shadow-inner ${getAccountColor(t.accountId || '')}`}>
                    {t.accountId === 'GIVE' ? custom.give.emoji : t.accountId === 'SPEND' ? custom.spend.emoji : t.accountId === 'INVEST' ? custom.invest.emoji : t.accountId === 'EXTRA' ? custom.extra.emoji : '🌟'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg mb-0.5">{t.description}</p>
                    <div className="flex gap-2 text-xs font-medium">
                      <span className="text-gray-400">{t.date}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">{getAccountName(t.accountId)}</span>
                    </div>
                  </div>
                </div>
                <div className={`font-black text-xl ${t.type === 'SPEND' ? 'text-rose-500' : 'text-indigo-600'}`}>
                  {t.type === 'SPEND' ? '-' : '+'}{t.amount.toLocaleString()}원
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {transactions.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Wallet className="w-16 h-16 mb-4 text-gray-300" />
              <p className="font-bold">아직 쓴 내역이 없어요</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
