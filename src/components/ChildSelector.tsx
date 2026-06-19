import React from 'react';
import type { ChildProfile } from '../types';
import { Users } from 'lucide-react';

interface Props {
  childrenProfiles: ChildProfile[];
  currentChildId: string;
  onSelectChild: (id: string) => void;
}

export const ChildSelector: React.FC<Props> = ({ childrenProfiles, currentChildId, onSelectChild }) => {
  if (childrenProfiles.length <= 1) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-gray-500 font-bold text-sm bg-gray-100 px-3 py-1.5 rounded-full shrink-0">
          <Users className="w-4 h-4" /> 자녀 선택
        </div>
        <div className="flex gap-2">
          {childrenProfiles.map(child => (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                child.id === currentChildId
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {child.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
