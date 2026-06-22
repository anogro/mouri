import { useState, useEffect } from 'react';
import type { ParentProfile, ChildProfile, Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { LedgerForm } from './components/LedgerForm';
import { SettingsPanel } from './components/SettingsPanel';
import { AuthScreen } from './components/AuthScreen';
import { ChildSelector } from './components/ChildSelector';
import { AdminPage } from './components/AdminPage';
import { Coins, LogOut } from 'lucide-react';

function App() {
  const [parent, setParent] = useState<ParentProfile | null>(() => {
    const saved = localStorage.getItem('mouri_parent');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentChildId, setCurrentChildId] = useState<string | null>(() => {
    const saved = localStorage.getItem('mouri_parent');
    if (saved) {
      const p = JSON.parse(saved);
      return p.children.length > 0 ? p.children[0].id : null;
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (parent) {
      localStorage.setItem('mouri_parent', JSON.stringify(parent));
      if (!currentChildId && parent.children.length > 0) {
        setCurrentChildId(parent.children[0].id);
      }
    }
  }, [parent, currentChildId]);

  // Check for pending transactions (like 1-week bonuses)
  useEffect(() => {
    if (!parent) return;
    const now = Date.now();
    let hasChanges = false;
    
    const newParent = { ...parent };
    newParent.children = newParent.children.map(child => {
      const pending = child.pendingTransactions || [];
      const due = pending.filter(p => now >= p.executeAt);
      const remaining = pending.filter(p => now < p.executeAt);
      
      if (due.length > 0) {
        hasChanges = true;
        const newTxs = due.map(p => ({
          ...p.txInfo,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString()
        }));
        
        // Sync to Google Sheets
        newTxs.forEach(tx => syncToGoogleSheets(tx, child));
        
        return {
          ...child,
          transactions: [...newTxs, ...child.transactions],
          pendingTransactions: remaining
        };
      }
      return child;
    });

    if (hasChanges) {
      setParent(newParent);
    }
  }, [parent]);

  const currentChild = parent?.children.find(c => c.id === currentChildId) || null;

  // --- GOOGLE SHEETS API SYNC ---
  const syncToGoogleSheets = async (data: any, childOverride?: ChildProfile) => {
    const child = childOverride || currentChild;
    if (!parent || !child) return;
    
    console.log('[Google Sheets API] Syncing data row:', data);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwHHmt5UVqsRRaLm5sdx6np60loJkNOl17y6Qtq0ADDxgWCqkPDwGMClsudAh2YtKOU_w/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          userId: `${parent.parentName}_${child.name}_${child.id.substring(0, 5)}`,
          childName: child.name,
          ...data
        })
      });
      console.log('Sync response status:', response.status);
    } catch (error) {
      console.error('Network error during sync:', error);
    }
  };

  const addTransaction = (txInfo: Omit<Transaction, 'id' | 'date'>) => {
    if (!parent || !currentChildId) return;

    const newTx: Transaction = {
      ...txInfo,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    
    setParent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        children: prev.children.map(c => 
          c.id === currentChildId 
            ? { ...c, transactions: [newTx, ...c.transactions] }
            : c
        )
      };
    });
    
    syncToGoogleSheets(newTx);
  };

  const handleGiveAllowance = () => {
    if (!currentChild) return;
    const { giveAmount, spendAmount, investAmount, bonusType, bonusRate } = currentChild.rules;
    
    if (giveAmount > 0) addTransaction({ type: 'GIVE', accountId: 'GIVE', category: '정기 용돈', amount: giveAmount, description: '이번 주 기부 용돈' });
    if (spendAmount > 0) addTransaction({ type: 'GIVE', accountId: 'SPEND', category: '정기 용돈', amount: spendAmount, description: '이번 주 지출 용돈' });
    if (investAmount > 0) addTransaction({ type: 'GIVE', accountId: 'INVEST', category: '정기 용돈', amount: investAmount, description: '이번 주 투자 용돈' });
    if (currentChild.rules.extraAmount > 0) addTransaction({ type: 'GIVE', accountId: 'EXTRA', category: '정기 용돈', amount: currentChild.rules.extraAmount, description: '이번 주 자유 저금통' });

    let bonusAmount = 0;
    if (bonusType === 'SIMPLE') {
      bonusAmount = Math.round(investAmount * (bonusRate / 100));
    } else {
      const balances = calculateBalances(currentChild);
      bonusAmount = Math.round(balances.invest * (bonusRate / 100));
    }

    if (bonusAmount > 0) {
      const executeAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      
      setParent(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          children: prev.children.map(c => 
            c.id === currentChildId 
              ? { 
                  ...c, 
                  pendingTransactions: [
                    ...c.pendingTransactions, 
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      executeAt,
                      txInfo: { type: 'BONUS', accountId: 'INVEST', category: '부모님 매칭 보너스', amount: bonusAmount, description: `[1주 뒤 지급] ${bonusType === 'SIMPLE' ? '단리' : '복리'} 이자` }
                    }
                  ] 
                }
              : c
          )
        };
      });
    }
  };

  const calculateBalances = (child: ChildProfile) => {
    let give = child.initialBalances?.give || 0;
    let spend = child.initialBalances?.spend || 0;
    let invest = child.initialBalances?.invest || 0;
    let extra = child.initialBalances?.extra || 0;
    let wishlist = 0;

    child.transactions.forEach(t => {
      if (t.accountId === 'GIVE') {
        if (t.type === 'GIVE' || t.type === 'EARN' || t.type === 'BONUS') give += t.amount;
        else if (t.type === 'SPEND') give -= t.amount;
      } else if (t.accountId === 'SPEND') {
        if (t.type === 'GIVE' || t.type === 'EARN' || t.type === 'BONUS') spend += t.amount;
        else if (t.type === 'SPEND') spend -= t.amount;
      } else if (t.accountId === 'INVEST') {
        if (t.type === 'GIVE' || t.type === 'EARN' || t.type === 'BONUS') invest += t.amount;
        else if (t.type === 'SPEND') invest -= t.amount;
      } else if (t.accountId === 'EXTRA') {
        if (t.type === 'GIVE' || t.type === 'EARN' || t.type === 'BONUS') extra += t.amount;
        else if (t.type === 'SPEND') extra -= t.amount;
      } else if (t.accountId === 'WISHLIST') {
        if (t.type === 'GIVE' || t.type === 'EARN' || t.type === 'BONUS') wishlist += t.amount;
        else if (t.type === 'SPEND') wishlist -= t.amount;
      }
    });

    return { give, spend, invest, extra, wishlist };
  };

  const handleRegister = async (newParent: ParentProfile) => {
    setParent(newParent);
    setCurrentChildId(newParent.children[0].id);
    setIsAuthenticated(true);
    
    // Send registration data to Google Sheets
    try {
      const childNamesStr = newParent.children.map(c => c.name).join(', ');
      await fetch('https://script.google.com/macros/s/AKfycbwHHmt5UVqsRRaLm5sdx6np60loJkNOl17y6Qtq0ADDxgWCqkPDwGMClsudAh2YtKOU_w/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'REGISTER',
          parentName: newParent.parentName,
          email: newParent.email,
          childrenCount: newParent.children.length,
          childNames: childNamesStr
        })
      });
      console.log('Registration info sent to Google Sheets');
    } catch (error) {
      console.error('Failed to send registration info:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const updateChildRules = (rules: any) => {
    setParent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        children: prev.children.map(c => c.id === currentChildId ? { ...c, rules } : c)
      };
    });
  };

  const updateChildPremium = (premiumMode: boolean) => {
    setParent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        children: prev.children.map(c => c.id === currentChildId ? { ...c, premiumMode } : c)
      };
    });
  };

  const updateChildWishlist = (wishlistTarget: number) => {
    setParent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        children: prev.children.map(c => c.id === currentChildId ? { ...c, wishlistTarget } : c)
      };
    });
  };

  const updateChildInitialBalances = (balances: { give: number; spend: number; invest: number; extra: number }) => {
    if (!parent || !currentChildId) return;
    const newParent = { ...parent };
    const childIndex = newParent.children.findIndex(c => c.id === currentChildId);
    if (childIndex !== -1) {
      newParent.children[childIndex].initialBalances = balances;
      setParent(newParent);
      localStorage.setItem('mouri_parent', JSON.stringify(newParent));
    }
  };

  const handleAdminUpgrade = () => {
    if (!parent) return;
    const newParent = { ...parent, membershipTier: 'PREMIUM' as const };
    newParent.children = newParent.children.map(child => ({
      ...child,
      premiumMode: true
    }));
    setParent(newParent);
    localStorage.setItem('mouri_parent', JSON.stringify(newParent));
  };

  const handleReset = () => {
    localStorage.removeItem('mouri_parent');
    setParent(null);
    setCurrentChildId(null);
    setIsAuthenticated(false);
  };

  // Admin Route
  if (window.location.pathname === '/admin') {
    return <AdminPage parent={parent} onUpgrade={handleAdminUpgrade} />;
  }

  // If not authenticated, show Auth Screen
  if (!isAuthenticated) {
    return <AuthScreen onRegister={handleRegister} onLogin={() => setIsAuthenticated(true)} onReset={handleReset} existingProfile={parent} />;
  }

  if (!currentChild) return null;

  return (
    <div className={`min-h-screen pb-20 font-sans selection:bg-indigo-100 ${currentChild.premiumMode ? 'mesh-bg-premium' : 'mesh-bg'}`}>
      <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
              <Coins className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">Mouri</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGiveAllowance}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <Coins className="w-4 h-4" /> 용돈 주기
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 p-2">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        {parent && parent.children.length > 1 && (
          <ChildSelector 
            childrenProfiles={parent.children} 
            currentChildId={currentChild.id} 
            onSelectChild={setCurrentChildId} 
          />
        )}
      </header>

      <main className="pt-8 space-y-12">
        <Dashboard 
          state={{
            rules: currentChild.rules,
            premiumMode: currentChild.premiumMode,
            wishlistTarget: currentChild.wishlistTarget,
            transactions: currentChild.transactions,
            parent,
            currentChildId,
            isAuthenticated
          } as any} // Pass modified state just for dashboard to extract premium/wishlist
          calculateBalances={() => calculateBalances(currentChild)} 
          childName={currentChild.name}
        />
        
        <LedgerForm 
          transactions={currentChild.transactions} 
          premiumMode={currentChild.premiumMode}
          rules={currentChild.rules}
          onAddTransaction={addTransaction}
        />
      </main>

      <SettingsPanel 
        rules={currentChild.rules}
        premiumMode={currentChild.premiumMode}
        wishlistTarget={currentChild.wishlistTarget}
        initialBalances={currentChild.initialBalances || { give: 0, spend: 0, invest: 0, extra: 0 }}
        parentPin={parent?.pin || ''}
        onUpdateRules={updateChildRules}
        onTogglePremium={updateChildPremium}
        onUpdateWishlistTarget={updateChildWishlist}
        onUpdateInitialBalances={updateChildInitialBalances}
      />
    </div>
  );
}

export default App;
