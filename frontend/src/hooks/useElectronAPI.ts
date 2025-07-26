import { useEffect, useState } from 'react';

interface ElectronAPI {
  saveData: (data: any) => Promise<any>;
  loadData: (key: string) => Promise<any>;
  syncData: () => Promise<any>;
  onMenuAction: (callback: (action: string) => void) => void;
  removeAllListeners: (channel: string) => void;
}

export const useElectronAPI = () => {
  const [electronAPI, setElectronAPI] = useState<ElectronAPI | null>(null);

  useEffect(() => {
    // Check if we're running in Electron
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      setElectronAPI((window as any).electronAPI);
    }
  }, []);

  return { electronAPI, isElectron: !!electronAPI };
};