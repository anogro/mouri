import React, { useState } from 'react';
import type { BudgetRules } from '../types';
import { Settings, Check, Crown, Lock } from 'lucide-react';

interface Props {
  rules: BudgetRules;
  premiumMode: boolean;
  wishlistTarget: number;
  initialBalances: { give: number; spend: number; invest: number; extra: number };
  parentPin: string;
  onUpdateRules: (rules: BudgetRules) => void;
  onTogglePremium: (premium: boolean) => void;
  onUpdateWishlistTarget: (target: number) => void;
  onUpdateInitialBalances: (balances: { give: number; spend: number; invest: number; extra: number }) => void;
}

export const SettingsPanel: React.FC<Props> = ({ 
  rules, premiumMode, wishlistTarget, initialBalances, parentPin, 
  onUpdateRules, onTogglePremium, onUpdateWishlistTarget, onUpdateInitialBalances
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [localRules, setLocalRules] = useState<BudgetRules>(rules);
  const [localWishlist, setLocalWishlist] = useState<number>(wishlistTarget);
  const [localInitialBalances, setLocalInitialBalances] = useState(initialBalances);

  // Sync state when props change (e.g. child switched)
  React.useEffect(() => {
    setLocalRules(rules);
    setLocalWishlist(wishlistTarget);
    setLocalInitialBalances(initialBalances);
  }, [rules, wishlistTarget, initialBalances]);

  const handleOpenClick = () => {
    setIsOpen(true);
    setIsUnlocked(false);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === parentPin) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSave = () => {
    onUpdateRules(localRules);
    onUpdateWishlistTarget(localWishlist);
    onUpdateInitialBalances(localInitialBalances);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={handleOpenClick}
        className="fixed bottom-6 right-6 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50 flex items-center justify-center group"
      >
        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" /> 부모 설정 패널
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {!isUnlocked ? (
          <div className="p-8 text-center h-64 flex flex-col justify-center">
            <Lock className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="font-bold text-gray-800 mb-4">설정을 변경하려면 비밀번호를 입력하세요</h3>
            <form onSubmit={handlePinSubmit} className="max-w-xs mx-auto w-full">
              <input 
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-center tracking-widest text-lg font-bold mb-3 focus:outline-none focus:ring-2 ${pinError ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-200 focus:ring-indigo-500'}`}
                placeholder="PIN 4자리"
                autoFocus
              />
              {pinError && <p className="text-rose-500 text-xs mb-3 font-bold">비밀번호가 틀렸습니다.</p>}
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700">
                확인
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              {/* 기본 용돈 설정 */}
              <section className="mb-8">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">기본 용돈 및 배분 규칙</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">총 주급 용돈 (원)</label>
                  <input 
                    type="number" 
                    value={localRules.totalAmount}
                    onChange={(e) => setLocalRules({...localRules, totalAmount: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className={`grid gap-4 ${premiumMode ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  <div>
                    <label className="block text-xs font-medium text-pink-600 mb-1">기부 배분</label>
                    <input 
                      type="number" 
                      value={localRules.giveAmount}
                      onChange={(e) => setLocalRules({...localRules, giveAmount: Number(e.target.value)})}
                      className="w-full bg-pink-50 border border-pink-100 rounded-xl px-3 py-2 text-pink-800 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-600 mb-1">지출 배분</label>
                    <input 
                      type="number" 
                      value={localRules.spendAmount}
                      onChange={(e) => setLocalRules({...localRules, spendAmount: Number(e.target.value)})}
                      className="w-full bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-600 mb-1">투자 배분</label>
                    <input 
                      type="number" 
                      value={localRules.investAmount}
                      onChange={(e) => setLocalRules({...localRules, investAmount: Number(e.target.value)})}
                      className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                  {premiumMode && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">자유 배분</label>
                      <input 
                        type="number" 
                        value={localRules.extraAmount}
                        onChange={(e) => setLocalRules({...localRules, extraAmount: Number(e.target.value)})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* 초기 잔액 설정 */}
              <section className="mb-8">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">기존 용돈 (초기 잔액) 설정</h3>
                <p className="text-xs text-gray-500 mb-3">앱 시작 전에 이미 모아둔 용돈을 입력하세요.</p>
                <div className={`grid gap-4 ${premiumMode ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  <div>
                    <label className="block text-xs font-medium text-pink-600 mb-1">기존 기부</label>
                    <input 
                      type="number" 
                      value={localInitialBalances.give}
                      onChange={(e) => setLocalInitialBalances({...localInitialBalances, give: Number(e.target.value)})}
                      className="w-full bg-pink-50 border border-pink-100 rounded-xl px-3 py-2 text-pink-800 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-600 mb-1">기존 지출</label>
                    <input 
                      type="number" 
                      value={localInitialBalances.spend}
                      onChange={(e) => setLocalInitialBalances({...localInitialBalances, spend: Number(e.target.value)})}
                      className="w-full bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-600 mb-1">기존 투자</label>
                    <input 
                      type="number" 
                      value={localInitialBalances.invest}
                      onChange={(e) => setLocalInitialBalances({...localInitialBalances, invest: Number(e.target.value)})}
                      className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                  {premiumMode && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">기존 자유</label>
                      <input 
                        type="number" 
                        value={localInitialBalances.extra}
                        onChange={(e) => setLocalInitialBalances({...localInitialBalances, extra: Number(e.target.value)})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* 프리미엄 모드 토글 */}
              <section className="mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className={`w-5 h-5 ${premiumMode ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <h3 className="font-bold text-gray-800">프리미엄 기능</h3>
                  </div>
                  <button 
                    onClick={() => onTogglePremium(!premiumMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${premiumMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${premiumMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className={`transition-all duration-300 overflow-hidden ${premiumMode ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <label className="block text-xs font-bold text-indigo-700 mb-2">위시리스트 목표 금액 (원)</label>
                    <input 
                      type="number" 
                      value={localWishlist}
                      onChange={(e) => setLocalWishlist(Number(e.target.value))}
                      className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <label className="block text-xs font-bold text-indigo-700 mb-2">투자 보너스 (부모 매칭)</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setLocalRules({...localRules, bonusType: 'SIMPLE'})}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${localRules.bonusType === 'SIMPLE' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                      >
                        단리 (고정 비율)
                      </button>
                      <button
                        onClick={() => setLocalRules({...localRules, bonusType: 'COMPOUND'})}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1 ${localRules.bonusType === 'COMPOUND' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                      >
                        복리 (정기) <Crown className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={localRules.bonusRate}
                        onChange={(e) => setLocalRules({...localRules, bonusRate: Number(e.target.value)})}
                        className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-indigo-900 text-right"
                      />
                      <span className="font-bold text-indigo-800">%</span>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mt-4">
                    <label className="block text-xs font-bold text-indigo-700 mb-2">저금통 이름 및 이모지 설정</label>
                    <div className="space-y-3">
                      {['give', 'spend', 'invest', 'extra'].map((key) => {
                        const accKey = key as 'give' | 'spend' | 'invest' | 'extra';
                        const acc = localRules.customAccounts?.[accKey] || {
                          name: accKey === 'give' ? '기부 저금통' : accKey === 'spend' ? '지출 저금통' : accKey === 'invest' ? '투자 저금통' : '자유 저금통',
                          emoji: accKey === 'give' ? '🤝' : accKey === 'spend' ? '💳' : accKey === 'invest' ? '📈' : '💰'
                        };
                        return (
                          <div key={key} className="flex gap-2">
                            <input 
                              type="text" 
                              value={acc.emoji}
                              onChange={(e) => {
                                const newCustom = { ...(localRules.customAccounts || {} as any) };
                                if (!newCustom[accKey]) newCustom[accKey] = { ...acc };
                                newCustom[accKey].emoji = e.target.value;
                                setLocalRules({...localRules, customAccounts: newCustom});
                              }}
                              className="w-12 bg-white border border-indigo-200 rounded-lg px-2 py-2 text-center"
                              placeholder="이모지"
                            />
                            <input 
                              type="text" 
                              value={acc.name}
                              onChange={(e) => {
                                const newCustom = { ...(localRules.customAccounts || {} as any) };
                                if (!newCustom[accKey]) newCustom[accKey] = { ...acc };
                                newCustom[accKey].name = e.target.value;
                                setLocalRules({...localRules, customAccounts: newCustom});
                              }}
                              className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              placeholder="저금통 이름"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Check className="w-5 h-5" /> 저장하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
