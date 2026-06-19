import React from 'react';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  calculateBalances: () => { give: number; spend: number; invest: number; wishlist: number };
}

export const Dashboard: React.FC<Props> = ({ state, calculateBalances }) => {
  const balances = calculateBalances();

  const renderMascot = (balance: number, target: number = 0) => {
    const isHungry = balance <= target;
    return (
      <div className="flex justify-center mb-4 transition-transform hover:scale-110 cursor-pointer">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md transition-all duration-300 ${isHungry ? 'bg-white opacity-90' : 'bg-white'}`}>
          {isHungry ? '😢' : '😍'}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-tight">모으리 (Mouri) 대시보드</h2>
      
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${state.premiumMode ? 'lg:grid-cols-4' : ''}`}>
        {/* 기부 저금통 (Give) */}
        <div className="bg-pink-100 rounded-3xl p-6 shadow-sm border border-pink-200 flex flex-col items-center hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 group-hover:opacity-70 transition-opacity"></div>
          {renderMascot(balances.give, 0)}
          <h3 className="text-xl font-bold text-pink-700 mb-2 relative z-10">기부 저금통</h3>
          <p className="text-3xl font-black text-pink-900 mb-6 relative z-10">{balances.give.toLocaleString()}원</p>
          <div className="w-full bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-sm text-pink-800 text-center mt-auto relative z-10">
            <p className="font-bold text-sm mb-1">🤝 마음 나누기</p>
            <p className="text-xs opacity-80">유니세프 어린이 돕기 후원</p>
          </div>
        </div>

        {/* 지출 저금통 (Spend) */}
        <div className="bg-amber-100 rounded-3xl p-6 shadow-sm border border-amber-200 flex flex-col items-center hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 group-hover:opacity-70 transition-opacity"></div>
          {renderMascot(balances.spend, 0)}
          <h3 className="text-xl font-bold text-amber-800 mb-2 relative z-10">지출 저금통</h3>
          <p className="text-3xl font-black text-amber-950 mb-6 relative z-10">{balances.spend.toLocaleString()}원</p>
          <div className="w-full bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-sm text-amber-900 text-center mt-auto relative z-10">
            <p className="font-bold text-sm mb-1">💳 똑똑한 소비</p>
            <p className="text-xs opacity-80">아이쿠카 선불카드 제휴</p>
          </div>
        </div>

        {/* 투자 저금통 (Invest) */}
        <div className="bg-emerald-100 rounded-3xl p-6 shadow-sm border border-emerald-200 flex flex-col items-center hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 group-hover:opacity-70 transition-opacity"></div>
          {renderMascot(balances.invest, 0)}
          <h3 className="text-xl font-bold text-emerald-800 mb-2 relative z-10">투자 저금통</h3>
          <p className="text-3xl font-black text-emerald-950 mb-6 relative z-10">{balances.invest.toLocaleString()}원</p>
          <div className="w-full bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-sm text-emerald-900 text-center mt-auto relative z-10">
            <p className="font-bold text-sm mb-1">📈 쑥쑥 불리기</p>
            <p className="text-xs opacity-80">키움증권 소수점 주식 모으기</p>
          </div>
        </div>

        {/* 위시리스트 저금통 (Wishlist - Premium) */}
        {state.premiumMode && (
          <div className="bg-blue-50 rounded-3xl p-6 shadow-sm border border-blue-200 flex flex-col items-center hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm z-20">
              PREMIUM
            </div>
            {renderMascot(balances.wishlist, state.wishlistTarget * 0.8 - 1)}
            <h3 className="text-xl font-bold text-blue-800 mb-2 relative z-10">🌟 위시리스트</h3>
            <p className="text-3xl font-black text-blue-950 mb-2 relative z-10">{balances.wishlist.toLocaleString()}원</p>
            
            <div className="w-full mb-6 relative z-10">
              <div className="flex justify-between text-xs text-blue-800 mb-1.5 font-medium">
                <span>진행률</span>
                <span>{state.wishlistTarget > 0 ? Math.min(100, Math.floor((balances.wishlist / state.wishlistTarget) * 100)) : 0}%</span>
              </div>
              <div className="w-full bg-blue-200/50 rounded-full h-2.5 backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${state.wishlistTarget > 0 ? Math.min(100, (balances.wishlist / state.wishlistTarget) * 100) : 0}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-center text-blue-700 mt-2 font-medium">목표: {state.wishlistTarget.toLocaleString()}원</p>
            </div>
            
            <div className="w-full bg-white/60 backdrop-blur-sm p-3 rounded-2xl text-center mt-auto relative z-10">
              {balances.wishlist >= state.wishlistTarget * 0.8 && state.wishlistTarget > 0 ? (
                <p className="font-bold text-xs text-indigo-600 flex items-center justify-center gap-1"><span>🔓</span> 출금 가능 (목표 80% 달성!)</p>
              ) : (
                <p className="font-semibold text-xs text-rose-500 flex items-center justify-center gap-1"><span>🔒</span> 80% 달성 전 출금 락업</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
