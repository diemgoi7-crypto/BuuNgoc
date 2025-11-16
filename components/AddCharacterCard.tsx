
import React from 'react';

interface AddCharacterCardProps {
  onClick: () => void;
}

export const AddCharacterCard: React.FC<AddCharacterCardProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-slate-800/30 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:bg-slate-700/30 hover:border-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span>Thêm nhân vật</span>
    </button>
  );
};
