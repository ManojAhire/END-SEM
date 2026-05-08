import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: 'rgba(15, 16, 40, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#00d4ff', secondary: '#0a0a1f' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a1f' } },
        }}
      />
    </ThemeProvider>
  );
}
