import React, { useState } from 'react';
import type { AppState, BudgetRules } from '../types';
import { Settings, Check, Crown } from 'lucide-react';

interface Props {
  state: AppState;
  onUpdateRules: (rules: BudgetRules) => void;
  onTogglePremium: (premium: boolean) => void;
  onUpdateWishlistTarget: (target: number) => void;
}

export const SettingsPanel: React.FC<Props> = ({ state, onUpdateRules, onTogglePremium, onUpdateWishlistTarget }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localRules, setLocalRules] = useState<BudgetRules>(state.rules);
  const [localWishlist, setLocalWishlist] = useState<number>(state.wishlistTarget);

  const handleSave = () => {
    onUpdateRules(localRules);
    onUpdateWishlistTarget(localWishlist);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
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

        <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
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

            <div className="grid grid-cols-3 gap-4">
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
            </div>
            {localRules.totalAmount !== (localRules.giveAmount + localRules.spendAmount + localRules.investAmount) && !state.premiumMode && (
              <p className="text-xs text-rose-500 mt-2 font-medium">⚠️ 배분액의 합이 총 용돈과 일치하지 않습니다.</p>
            )}
          </section>

          {/* 프리미엄 모드 토글 */}
          <section className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${state.premiumMode ? 'text-indigo-600' : 'text-gray-400'}`} />
                <h3 className="font-bold text-gray-800">프리미엄 기능</h3>
              </div>
              <button 
                onClick={() => onTogglePremium(!state.premiumMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${state.premiumMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.premiumMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4">수잔 비첨식 4개 통장 분리(위시리스트 추가) 및 정기 복리 기능을 제공합니다.</p>

            <div className={`transition-all duration-300 overflow-hidden ${state.premiumMode ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4">
                <label className="block text-xs font-bold text-indigo-700 mb-2">위시리스트 목표 금액 (원)</label>
                <input 
                  type="number" 
                  value={localWishlist}
                  onChange={(e) => setLocalWishlist(Number(e.target.value))}
                  className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="예: 50000"
                />
                <p className="text-[10px] text-indigo-600 mt-1">목표액의 80% 달성 전까지 출금이 제한됩니다 (충동방지 락업).</p>
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
                    className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-right"
                  />
                  <span className="font-bold text-indigo-800">%</span>
                </div>
                <p className="text-[10px] text-indigo-600 mt-1">
                  {localRules.bonusType === 'SIMPLE' 
                    ? "매주 투자 통장에 입금된 금액에 대해 1회성으로 추가 지급합니다." 
                    : "투자 통장에 쌓인 전체 잔액에 대해 복리로 추가 지급합니다."}
                </p>
              </div>
            </div>
            
            {!state.premiumMode && (
              <div className="bg-gray-100 rounded-xl p-4 opacity-50 grayscale select-none pointer-events-none mt-4">
                <p className="text-xs font-bold mb-2">투자 보너스 (기본: 단리)</p>
                <div className="flex items-center gap-2">
                  <input disabled type="number" value={localRules.bonusRate} className="flex-1 bg-white border rounded-lg px-3 py-2 text-right" />
                  <span>%</span>
                </div>
              </div>
            )}
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
      </div>
    </div>
  );
};
