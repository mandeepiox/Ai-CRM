'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '53px', marginTop: 'auto', borderTop: '1px solid var(--border)' }} />;
  }

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '12px', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
      <button 
        className="btn" 
        style={{ flex: 1, padding: '8px', background: theme === 'light' ? 'var(--bg-primary)' : 'transparent', border: theme === 'light' ? '1px solid var(--border)' : 'none' }}
        onClick={() => setTheme('light')}
        title="Light Mode"
      >
        <Sun size={14} color={theme === 'light' ? 'var(--text-primary)' : 'var(--text-tertiary)'} />
      </button>
      <button 
        className="btn" 
        style={{ flex: 1, padding: '8px', background: theme === 'system' ? 'var(--bg-primary)' : 'transparent', border: theme === 'system' ? '1px solid var(--border)' : 'none' }}
        onClick={() => setTheme('system')}
        title="System Theme"
      >
        <Monitor size={14} color={theme === 'system' ? 'var(--text-primary)' : 'var(--text-tertiary)'} />
      </button>
      <button 
        className="btn" 
        style={{ flex: 1, padding: '8px', background: theme === 'dark' ? 'var(--bg-primary)' : 'transparent', border: theme === 'dark' ? '1px solid var(--border)' : 'none' }}
        onClick={() => setTheme('dark')}
        title="Dark Mode"
      >
        <Moon size={14} color={theme === 'dark' ? 'var(--text-primary)' : 'var(--text-tertiary)'} />
      </button>
    </div>
  );
}
