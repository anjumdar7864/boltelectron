class StorageService {
    prefix = 'vyapar_';
    // Local storage methods
    setItem(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serializedValue);
        }
        catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    getItem(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }
    removeItem(key) {
        localStorage.removeItem(this.prefix + key);
    }
    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
    // Electron API integration
    async saveToElectron(key, data) {
        if (typeof window !== 'undefined' && window.electronAPI) {
            try {
                const result = await window.electronAPI.saveData({ key, data });
                return result.success;
            }
            catch (error) {
                console.error('Error saving to Electron:', error);
                return false;
            }
        }
        return false;
    }
    async loadFromElectron(key) {
        if (typeof window !== 'undefined' && window.electronAPI) {
            try {
                const result = await window.electronAPI.loadData(key);
                return result.success ? result.data : null;
            }
            catch (error) {
                console.error('Error loading from Electron:', error);
                return null;
            }
        }
        return null;
    }
    async syncData() {
        if (typeof window !== 'undefined' && window.electronAPI) {
            try {
                const result = await window.electronAPI.syncData();
                return result.success;
            }
            catch (error) {
                console.error('Error syncing data:', error);
                return false;
            }
        }
        return false;
    }
}
export default new StorageService();
