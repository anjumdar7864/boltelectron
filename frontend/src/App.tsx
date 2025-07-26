import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import POS from './pages/POS';
import { useElectronAPI } from './hooks/useElectronAPI';

function App() {
  const { electronAPI } = useElectronAPI();

  useEffect(() => {
    if (electronAPI) {
      electronAPI.onMenuAction((action: string) => {
        // Handle menu actions from Electron
        console.log('Menu action received:', action);
        // You can navigate programmatically here based on the action
      });

      return () => {
        electronAPI.removeAllListeners('menu-action');
      };
    }
  }, [electronAPI]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/create" element={<CreateInvoice />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="pos" element={<POS />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;