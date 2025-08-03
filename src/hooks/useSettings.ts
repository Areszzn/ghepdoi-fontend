import { useState, useEffect } from 'react';
import { settingsAPI } from '@/lib/api';

interface Settings {
  name_app?: string;
  logo_app?: string;
  bg_login?: string;
  bg_reg?: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getPublic();
        setSettings(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
