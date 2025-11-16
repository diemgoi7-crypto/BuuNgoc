import React, { useRef } from 'react';
import type { Character } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface CharacterCardProps {
  character: Character;
  onUpdate: (id: string, updates: Partial<Character>) => void;
  onAnalyze: (id:string) => void;
  onDelete: (id: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onUpdate, onAnalyze, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string)?.split(',')[1] ?? null;
        onUpdate(character.id, { image: base64String, imageMimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex flex-col gap-3 border border-slate-700">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={character.name}
          onChange={(e) => onUpdate(character.id, { name: e.target.value })}
          placeholder="Tên nhân vật"
          className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={() => onDelete(character.id)}
          className="w-6 h-6 bg-red-500/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors text-sm font-bold flex-shrink-0"
          aria-label="Xóa nhân vật"
        >
          X
        </button>
      </div>
      
      <div 
        className="w-full h-48 bg-slate-700/50 rounded-md flex items-center justify-center border border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors overflow-hidden"
        onClick={handleImageUploadClick}
      >
        {character.image ? (
          <img 
            src={`data:${character.imageMimeType};base64,${character.image}`} 
            alt={character.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="text-center text-slate-400">
            <UploadIcon className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Tải lên hoặc Kéo thả</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <button 
        onClick={() => onAnalyze(character.id)}
        disabled={!character.image || character.isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {character.isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang phân tích...
          </>
        ) : (
          "Phân tích bằng AI"
        )}
      </button>

      {character.description && (
        <div className="mt-3">
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Kết quả Phân tích AI
          </label>
          <pre className="w-full h-40 bg-slate-900/70 border border-slate-600 rounded-md p-2 text-slate-300 overflow-auto text-xs whitespace-pre-wrap break-all">
            <code>
              {character.description}
            </code>
          </pre>
        </div>
      )}

    </div>
  );
};