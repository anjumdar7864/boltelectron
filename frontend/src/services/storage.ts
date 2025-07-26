class StorageService {
  private prefix = 'vyapar_';

  // Local storage methods
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Electron API integration
  async saveToElectron(key: string, data: any): Promise<boolean> {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      try {
        const result = await (window as any).electronAPI.saveData({ key, data });
        return result.success;
      } catch (error) {
        console.error('Error saving to Electron:', error);
        return false;
      }
    }
    return false;
  }

  async loadFromElectron(key: string): Promise<any> {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      try {
        const result = await (window as any).electronAPI.loadData(key);
        return result.success ? result.data : null;
      } catch (error) {
        console.error('Error loading from Electron:', error);
        return null;
      }
    }
    return null;
  }

  async syncData(): Promise<boolean> {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      try {
        const result = await (window as any).electronAPI.syncData();
        return result.success;
      } catch (error) {
        console.error('Error syncing data:', error);
        return false;
      }
    }
    return false;
  }
}

export default new StorageService();