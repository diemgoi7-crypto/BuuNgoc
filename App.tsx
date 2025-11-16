import React, { useState, useEffect, useCallback } from 'react';
import type { Character } from './types';
import { ApiKeyManager } from './components/ApiKeyManager';
import { CharacterCard } from './components/CharacterCard';
import { AddCharacterCard } from './components/AddCharacterCard';
import { generateDescriptionFromImage, generateJsonFromImage } from './services/geminiService';
import { DownloadIcon } from './components/icons/DownloadIcon';


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [aggregatedJsonString, setAggregatedJsonString] = useState('');
  const [isGeneratingJson, setIsGeneratingJson] = useState(false);


  useEffect(() => {
    const savedKey = localStorage.getItem('gemini-api-key');
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyInput(savedKey);
    }
    if (characters.length === 0) {
      addCharacter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const saveApiKey = useCallback(() => {
    localStorage.setItem('gemini-api-key', apiKeyInput);
    setApiKey(apiKeyInput);
    alert('API Key đã được lưu!');
  }, [apiKeyInput]);

  const deleteApiKey = useCallback(() => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
    setApiKeyInput('');
    alert('API Key đã được xóa!');
  }, []);

  const addCharacter = () => {
    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: `Nhân vật ${characters.length + 1}`,
      image: null,
      imageMimeType: null,
      description: '',
      isLoading: false,
    };
    setCharacters(prev => [...prev, newCharacter]);
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(prev =>
      prev.map(char => (char.id === id ? { ...char, ...updates } : char))
    );
  };
  
  const deleteCharacter = useCallback((id: string) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
  }, []);

  const analyzeCharacter = async (id: string) => {
    const character = characters.find(c => c.id === id);
    if (!character || !character.image || !character.imageMimeType) {
      alert("Vui lòng tải ảnh lên trước khi phân tích.");
      return;
    }
     if (!apiKey) {
      alert("Vui lòng lưu API Key của Gemini trước khi phân tích.");
      return;
    }

    updateCharacter(id, { isLoading: true, description: 'Đang tạo mô tả...' });

    try {
      const description = await generateDescriptionFromImage(apiKey, character.image, character.imageMimeType);
      updateCharacter(id, { description });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn.";
      updateCharacter(id, { description: `Lỗi: ${errorMessage}` });
    } finally {
      updateCharacter(id, { isLoading: false });
    }
  };

  const handleGenerateJson = async () => {
    if (!apiKey) {
      alert("Vui lòng lưu API Key của Gemini trước.");
      return;
    }
    const charactersWithImages = characters.filter(c => c.image && c.imageMimeType);
    if (charactersWithImages.length === 0) {
        alert("Không có nhân vật nào có ảnh để tạo JSON.");
        return;
    }

    setIsGeneratingJson(true);
    setAggregatedJsonString('Đang tạo JSON chi tiết (character_lock), vui lòng đợi...');

    const characterLockData: { [key: string]: any } = {};

    for (const [index, char] of charactersWithImages.entries()) {
        const charKey = `CHAR_${index + 1}`;
        try {
            const jsonStringFromAi = await generateJsonFromImage(apiKey, char.image!, char.imageMimeType!);
            const aiData = JSON.parse(jsonStringFromAi);
            
            const finalCharData = {
                id: charKey,
                name: char.name, 
                ...aiData,
            };

            characterLockData[charKey] = finalCharData;
        } catch (error) {
            console.error(`Lỗi khi tạo JSON cho nhân vật ${char.name}:`, error);
            const charKeyOnError = `CHAR_${index + 1}`;
            characterLockData[charKeyOnError] = {
                id: charKeyOnError,
                name: char.name,
                error: `Không thể tạo JSON. ${error instanceof Error ? error.message : 'Lỗi không xác định.'}`
            };
        }
    }
    
    const finalJsonObject = { character_lock: characterLockData };
    setAggregatedJsonString(JSON.stringify(finalJsonObject, null, 2));
    setIsGeneratingJson(false);
  };

  const exportJson = () => {
    if (!aggregatedJsonString || aggregatedJsonString.startsWith('Đang tạo')) {
      alert("Chưa có dữ liệu JSON để xuất. Vui lòng tạo JSON trước.");
      return;
    }
    const blob = new Blob([aggregatedJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'characters.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans antialiased">
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Tạo Mô Tả Nhân Vật Từ Ảnh
            </h1>
            <p className="mt-2 text-lg text-green-400 font-semibold tracking-wider">
                PHÁT TRIỂN BỞI BỬU NGỌC
            </p>
        </div>

        <ApiKeyManager 
            apiKeyInput={apiKeyInput}
            setApiKeyInput={setApiKeyInput}
            saveApiKey={saveApiKey}
            deleteApiKey={deleteApiKey}
        />
        
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">
                Danh sách Nhân vật
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {characters.map(char => (
                    <CharacterCard 
                        key={char.id} 
                        character={char} 
                        onUpdate={updateCharacter}
                        onAnalyze={analyzeCharacter}
                        onDelete={deleteCharacter}
                    />
                ))}
                <AddCharacterCard onClick={addCharacter} />
            </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-slate-700 pb-2 gap-4">
                <h2 className="text-xl font-bold text-slate-300 flex-shrink-0">
                    Danh sách JSON Nhân vật
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleGenerateJson}
                        disabled={isGeneratingJson}
                        className="w-full sm:w-auto flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                         {isGeneratingJson ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tạo...
                          </>
                        ) : (
                          "Tạo JSON Nhân vật"
                        )}
                    </button>
                    <button
                        onClick={exportJson}
                        disabled={!aggregatedJsonString || isGeneratingJson}
                        className="w-full sm:w-auto flex-1 px-4 py-2 bg-slate-600 text-white rounded-md font-semibold hover:bg-slate-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 flex items-center justify-center"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        Xuất ra File (json)
                    </button>
                </div>
            </div>
            <pre className="w-full h-80 bg-slate-900/70 border border-slate-600 rounded-md p-3 text-slate-300 overflow-auto text-sm whitespace-pre-wrap break-all">
                <code>
                    {aggregatedJsonString || 'Nhấn "Tạo JSON Nhân vật" để tạo cấu trúc character_lock.'}
                </code>
            </pre>
        </div>
      </main>
      <footer className="text-center p-6 text-slate-400">
        Bản quyền thuộc về <span className="font-bold text-blue-400">BỬU NGỌC</span>
      </footer>
    </div>
  );
};

export default App;