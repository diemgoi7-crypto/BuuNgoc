import React from 'react';

interface ApiKeyManagerProps {
  apiKeyInput: string;
  setApiKeyInput: (key: string) => void;
  saveApiKey: () => void;
  deleteApiKey: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKeyInput, setApiKeyInput, saveApiKey, deleteApiKey }) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg mb-8 border border-slate-700">
      <label htmlFor="api-key" className="block text-sm font-medium text-slate-300 mb-2">
        Gemini API Key (Đã lưu vào trình duyệt của bạn)
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="api-key"
          type="password"
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          placeholder="***************************************"
          className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
            <a 
              href="https://aistudio.google.com/app/api-keys" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 bg-amber-500 text-white rounded-md font-semibold hover:bg-amber-600 transition-colors text-sm text-center"
            >
              Lấy Key
            </a>
            <button
              onClick={saveApiKey}
              className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition-colors text-sm"
            >
              Lưu Key
            </button>
            <button
              onClick={deleteApiKey}
              className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors text-sm"
            >
              Xóa Key
            </button>
        </div>
      </div>
    </div>
  );
};
