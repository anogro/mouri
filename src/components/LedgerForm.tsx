import React, { useState } from 'react';
import type { Transaction, TransactionType } from '../types';
import { PlusCircle, MinusCircle, Wallet, Coffee, Gamepad2, Gift, Pencil, Star } from 'lucide-react';

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
  const [category, setCategory] = useState<string>('🍔 간식');

  const categories = [
    { id: '🍔 간식', icon: <Coffee className="w-4 h-4" /> },
    { id: '✏️ 문구/장난감', icon: <Pencil className="w-4 h-4" /> },
    { id: '🎮 오락/문화', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: '🎁 선물', icon: <Gift className="w-4 h-4" /> },
    { id: '🌟 기타', icon: <Star className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    onAddTransaction({
      type,
      accountId,
      amount: Number(amount),
      description,
      category: type === 'SPEND' ? category : '입금'
    });
    
    setAmount('');
    setDescription('');
  };

  const getAccountColor = (id: string) => {
    switch(id) {
      case 'GIVE': return 'text-pink-600 bg-pink-100';
      case 'SPEND': return 'text-amber-600 bg-amber-100';
      case 'INVEST': return 'text-emerald-600 bg-emerald-100';
      case 'EXTRA': return 'text-gray-600 bg-gray-200';
      case 'WISHLIST': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const custom = rules?.customAccounts || {
    give: { name: '기부 통장', emoji: '🤝' },
    spend: { name: '지출 통장', emoji: '💳' },
    invest: { name: '투자 통장', emoji: '📈' },
    extra: { name: '자유 저금통', emoji: '💰' }
  };

  const getAccountName = (id: string) => {
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
    <div className="w-full max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
      {/* 입력 폼 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-indigo-500" /> 용돈 기입장 쓰기
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('SPEND')}
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${type === 'SPEND' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'}`}
            >
              <MinusCircle className="w-4 h-4" /> 썼어요
            </button>
            <button
              type="button"
              onClick={() => setType('GIVE')} // Used generally as "Deposit" or "Give" here, mapped to account
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${type === 'GIVE' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-500'}`}
            >
              <PlusCircle className="w-4 h-4" /> 넣었어요
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">어느 저금통에서?</label>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setAccountId('GIVE')} className={`py-2 text-xs font-bold rounded-xl border transition-colors ${accountId === 'GIVE' ? 'bg-pink-100 border-pink-200 text-pink-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>{custom.give.name.substring(0,2)}</button>
              <button type="button" onClick={() => setAccountId('SPEND')} className={`py-2 text-xs font-bold rounded-xl border transition-colors ${accountId === 'SPEND' ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>{custom.spend.name.substring(0,2)}</button>
              <button type="button" onClick={() => setAccountId('INVEST')} className={`py-2 text-xs font-bold rounded-xl border transition-colors ${accountId === 'INVEST' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>{custom.invest.name.substring(0,2)}</button>
              {premiumMode && (
                <>
                  <button type="button" onClick={() => setAccountId('EXTRA')} className={`py-2 text-xs font-bold rounded-xl border transition-colors ${accountId === 'EXTRA' ? 'bg-gray-200 border-gray-300 text-gray-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>{custom.extra.name.substring(0,2)}</button>
                  <button type="button" onClick={() => setAccountId('WISHLIST')} className={`col-span-2 py-2 text-xs font-bold rounded-xl border transition-colors ${accountId === 'WISHLIST' ? 'bg-blue-100 border-blue-200 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>위시리스트 (프리미엄)</button>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">얼마를 {type === 'SPEND' ? '썼나요?' : '넣었나요?'}</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="예: 1500"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-2xl font-black text-gray-800 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">원</span>
            </div>
          </div>

          {type === 'SPEND' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">어디에 썼나요?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${category === cat.id ? 'bg-indigo-100 border-indigo-200 text-indigo-700 scale-105' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    {cat.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">메모 (선택)</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 포켓몬 지우개 샀음"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-md transition-transform active:scale-95 ${type === 'SPEND' ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600' : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600'}`}
          >
            기록하기
          </button>
        </form>
      </div>

      {/* 타임라인 피드 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-[600px]">
        <h3 className="text-xl font-bold text-gray-800 mb-6">최근 내역</h3>
        
        <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4">
          {transactions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <Wallet className="w-16 h-16 mb-4" />
              <p>아직 기록된 내역이 없어요!</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${getAccountColor(tx.accountId || 'SPEND')}`}>
                    {getAccountName(tx.accountId || 'SPEND').substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{tx.category} <span className="text-sm font-normal text-gray-500 ml-1">{tx.description}</span></p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(tx.date).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                  </div>
                </div>
                <div className={`text-lg font-black ${tx.type === 'SPEND' ? 'text-rose-500' : 'text-indigo-600'}`}>
                  {tx.type === 'SPEND' ? '-' : '+'}{tx.amount.toLocaleString()}원
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
