import { useEffect, useState } from 'react';
export const useElectronAPI = () => {
    const [electronAPI, setElectronAPI] = useState(null);
    useEffect(() => {
        // Check if we're running in Electron
        if (typeof window !== 'undefined' && window.electronAPI) {
            setElectronAPI(window.electronAPI);
        }
    }, []);
    return { electronAPI, isElectron: !!electronAPI };
};
