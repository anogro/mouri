import { useState } from 'react';
import type { AppState, BudgetRules, Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { LedgerForm } from './components/LedgerForm';
import { SettingsPanel } from './components/SettingsPanel';
import { Coins, Loader2 } from 'lucide-react';

const INITIAL_RULES: BudgetRules = {
  totalAmount: 5000,
  giveAmount: 500,
  spendAmount: 3000,
  investAmount: 1500,
  bonusType: 'SIMPLE',
  bonusRate: 50,
};

function App() {
  const [state, setState] = useState<AppState>({
    rules: INITIAL_RULES,
    transactions: [],
    premiumMode: false,
    wishlistTarget: 50000,
  });
  
  const [isSyncing, setIsSyncing] = useState(false);

  // --- GOOGLE SHEETS API SYNC ---
  const syncToGoogleSheets = async (data: any) => {
    setIsSyncing(true);
    console.log('[Google Sheets API] Syncing data row:', data);
    
    try {
      // API call to Vercel Serverless Function
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'Family_01', // User ID (Mock for now, can be added to Settings)
          ...data
        })
      });
      
      const result = await response.json();
      if (!result.success) {
        console.error('Sync failed:', result.error);
      }
    } catch (error) {
      console.error('Network error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addTransaction = (txInfo: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...txInfo,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    
    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));
    
    syncToGoogleSheets(newTx);
  };

  const handleGiveAllowance = () => {
    const { giveAmount, spendAmount, investAmount, bonusType, bonusRate } = state.rules;
    
    // 1. Give basic allowance
    if (giveAmount > 0) addTransaction({ type: 'GIVE', accountId: 'GIVE', category: '정기 용돈', amount: giveAmount, description: '이번 주 기부 용돈' });
    if (spendAmount > 0) addTransaction({ type: 'GIVE', accountId: 'SPEND', category: '정기 용돈', amount: spendAmount, description: '이번 주 지출 용돈' });
    if (investAmount > 0) addTransaction({ type: 'GIVE', accountId: 'INVEST', category: '정기 용돈', amount: investAmount, description: '이번 주 투자 용돈' });

    // 2. Calculate Bonus for Invest
    let bonusAmount = 0;
    if (bonusType === 'SIMPLE') {
      // Simple Interest: Parent matches a % of the *current week's* invest amount.
      bonusAmount = Math.round(investAmount * (bonusRate / 100));
    } else {
      // Compound Interest (Premium): Parent matches a % of the *entire current balance*.
      const balances = calculateBalances();
      bonusAmount = Math.round(balances.invest * (bonusRate / 100));
    }

    if (bonusAmount > 0) {
      setTimeout(() => {
        addTransaction({ type: 'BONUS', accountId: 'INVEST', category: '부모님 매칭 보너스', amount: bonusAmount, description: `${bonusType === 'SIMPLE' ? '단리' : '복리'} 이자` });
      }, 500); // slight delay for UI effect
    }
  };

  const calculateBalances = () => {
    let give = 0;
    let spend = 0;
    let invest = 0;
    let wishlist = 0;

    state.transactions.forEach(tx => {
      const isDeduction = tx.type === 'SPEND';
      const amount = isDeduction ? -tx.amount : tx.amount;

      switch(tx.accountId) {
        case 'GIVE': give += amount; break;
        case 'SPEND': spend += amount; break;
        case 'INVEST': invest += amount; break;
        case 'WISHLIST': wishlist += amount; break;
      }
    });

    return { give, spend, invest, wishlist };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans selection:bg-indigo-100">
      <header className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
              <Coins className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">Mouri</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isSyncing && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> 구글 시트 동기화 중...
              </div>
            )}
            <button 
              onClick={handleGiveAllowance}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <Coins className="w-4 h-4" /> 용돈 주기
            </button>
          </div>
        </div>
      </header>

      <main className="pt-8 space-y-12">
        <Dashboard 
          state={state} 
          calculateBalances={calculateBalances} 
        />
        
        <LedgerForm 
          transactions={state.transactions} 
          premiumMode={state.premiumMode}
          onAddTransaction={addTransaction}
        />
      </main>

      <SettingsPanel 
        state={state}
        onUpdateRules={(rules) => setState(prev => ({...prev, rules}))}
        onTogglePremium={(premium) => setState(prev => ({...prev, premiumMode: premium}))}
        onUpdateWishlistTarget={(target) => setState(prev => ({...prev, wishlistTarget: target}))}
      />
    </div>
  );
}

export default App;
