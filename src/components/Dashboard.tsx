import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface Props {
  state: {
    premiumMode: boolean;
    wishlistTarget: number;
    transactions: any[];
    rules?: any;
  };
  calculateBalances: () => { give: number; spend: number; invest: number; extra: number; wishlist: number };
  childName?: string;
}

export const Dashboard: React.FC<Props> = ({ state, calculateBalances, childName }) => {
  const balances = calculateBalances();

  const custom = state.rules?.customAccounts || {
    give: { name: '기부 저금통', emoji: '🤝' },
    spend: { name: '지출 저금통', emoji: '💳' },
    invest: { name: '투자 저금통', emoji: '📈' },
    extra: { name: '자유 저금통', emoji: '💰' }
  };

  const renderMascot = (balance: number, target: number = 0, defaultEmoji: string) => {
    const isHungry = balance <= target;
    return (
      <motion.div 
        whileHover={{ scale: 1.15, rotate: [0, -10, 10, -10, 0] }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex justify-center mb-6 cursor-pointer"
      >
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg border-2 border-white/60 backdrop-blur-md ${isHungry ? 'bg-white/80 grayscale opacity-90' : 'bg-white/40'}`}>
          {isHungry ? '😢' : defaultEmoji}
        </div>
      </motion.div>
    );
  };

  const chartData = [
    { name: custom.give.name.substring(0,4), value: balances.give > 0 ? balances.give : 0, color: '#fbcfe8' },
    { name: custom.spend.name.substring(0,4), value: balances.spend > 0 ? balances.spend : 0, color: '#fde68a' },
    { name: custom.invest.name.substring(0,4), value: balances.invest > 0 ? balances.invest : 0, color: '#a7f3d0' },
  ];
  
  if (state.premiumMode) {
    chartData.push({ name: custom.extra.name.substring(0,4), value: balances.extra > 0 ? balances.extra : 0, color: '#e5e7eb' });
    chartData.push({ name: '목표', value: balances.wishlist > 0 ? balances.wishlist : 0, color: '#bfdbfe' });
  }

  const hasData = chartData.some(d => d.value > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as any, stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="w-full max-w-5xl mx-auto p-4"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-black text-gray-800 mb-8 text-center tracking-tight drop-shadow-sm">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          {childName ? `${childName}의 놀이터` : '모으리 놀이터'}
        </span>
      </motion.h2>

      {state.premiumMode && (
        <motion.div variants={itemVariants} className="mb-8 glass-card rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          
          <h3 className="text-lg font-bold text-gray-700 mb-4 z-10">내 자산 한눈에 보기</h3>
          <div className="w-full h-64 z-10">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => `${Number(value).toLocaleString()}원`} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 'bold', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-medium">
                아직 모은 용돈이 없어요!
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      <motion.div variants={containerVariants} className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${state.premiumMode ? 'lg:grid-cols-5' : ''}`}>
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-card glass-card-hover rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-pink-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {renderMascot(balances.give, 0, custom.give.emoji)}
          <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{custom.give.name}</h3>
          <p className="text-3xl font-black text-pink-600 mb-6 relative z-10 drop-shadow-sm">{balances.give.toLocaleString()}원</p>
          <div className="w-full bg-white/60 backdrop-blur-md p-4 rounded-2xl text-sm text-gray-800 text-center mt-auto border border-white/50 relative z-10">
            <p className="font-bold text-sm mb-1">{custom.give.emoji} 나누는 기쁨</p>
            <p className="text-xs opacity-80 font-medium">착한 일에 써봐요</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-card glass-card-hover rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-amber-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {renderMascot(balances.spend, 0, custom.spend.emoji)}
          <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{custom.spend.name}</h3>
          <p className="text-3xl font-black text-amber-600 mb-6 relative z-10 drop-shadow-sm">{balances.spend.toLocaleString()}원</p>
          <div className="w-full bg-white/60 backdrop-blur-md p-4 rounded-2xl text-sm text-gray-800 text-center mt-auto border border-white/50 relative z-10">
            <p className="font-bold text-sm mb-1">{custom.spend.emoji} 내가 쓸 돈</p>
            <p className="text-xs opacity-80 font-medium">사고 싶은 걸 사요</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-card glass-card-hover rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {renderMascot(balances.invest, 0, custom.invest.emoji)}
          <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{custom.invest.name}</h3>
          <p className="text-3xl font-black text-emerald-600 mb-6 relative z-10 drop-shadow-sm">{balances.invest.toLocaleString()}원</p>
          <div className="w-full bg-white/60 backdrop-blur-md p-4 rounded-2xl text-sm text-gray-800 text-center mt-auto border border-white/50 relative z-10">
            <p className="font-bold text-sm mb-1">{custom.invest.emoji} 미래의 나에게</p>
            <p className="text-xs opacity-80 font-medium">저축하고 이자 받기</p>
          </div>
        </motion.div>

        {state.premiumMode && (
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-card glass-card-hover rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-md z-20">
              PREMIUM
            </div>
            {renderMascot(balances.extra, 0, custom.extra.emoji)}
            <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{custom.extra.name}</h3>
            <p className="text-3xl font-black text-gray-700 mb-6 relative z-10 drop-shadow-sm">{balances.extra.toLocaleString()}원</p>
            <div className="w-full bg-white/60 backdrop-blur-md p-4 rounded-2xl text-sm text-gray-800 text-center mt-auto border border-white/50 relative z-10">
              <p className="font-bold text-sm mb-1">{custom.extra.emoji} 마음대로</p>
              <p className="text-xs opacity-80 font-medium">조건 없는 비상금</p>
            </div>
          </motion.div>
        )}

        {state.premiumMode && (
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-card glass-card-hover rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-md z-20">
              PREMIUM
            </div>
            {renderMascot(balances.wishlist, state.wishlistTarget * 0.8 - 1, '🌟')}
            <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">🌟 위시리스트</h3>
            <p className="text-3xl font-black text-blue-600 mb-2 relative z-10 drop-shadow-sm">{balances.wishlist.toLocaleString()}원</p>
            
            <div className="w-full mb-6 relative z-10">
              <div className="flex justify-between text-xs text-gray-600 mb-2 font-bold">
                <span>달성률</span>
                <span className="text-blue-600">{state.wishlistTarget > 0 ? Math.min(100, Math.floor((balances.wishlist / state.wishlistTarget) * 100)) : 0}%</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-3 backdrop-blur-sm border border-white/40 shadow-inner overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${state.wishlistTarget > 0 ? Math.min(100, (balances.wishlist / state.wishlistTarget) * 100) : 0}%` }}
                  transition={{ duration: 1, type: "spring" }}
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full" 
                ></motion.div>
              </div>
              <p className="text-[11px] text-center text-gray-500 mt-2 font-bold">목표: {state.wishlistTarget.toLocaleString()}원</p>
            </div>
            
            <div className="w-full bg-white/60 backdrop-blur-md p-3 rounded-2xl text-center mt-auto border border-white/50 relative z-10">
              {balances.wishlist >= state.wishlistTarget * 0.8 && state.wishlistTarget > 0 ? (
                <p className="font-bold text-xs text-indigo-600 flex items-center justify-center gap-1">🎉 80% 달성 완료!</p>
              ) : (
                <p className="font-bold text-xs text-rose-500 flex items-center justify-center gap-1">💪 아직 모으는 중</p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
