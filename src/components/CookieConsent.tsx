'use client';

import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
      window.googletag = window.googletag || { cmd: [] };
      window.googletag.cmd.push(() => {
        window.googletag.pubads().disableInitialLoad();
      });
    } else if (consent === 'custom') {
      const savedPrefs = localStorage.getItem('cookiePreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    window.googletag.cmd.push(() => {
      window.googletag.pubads().enableInitialLoad();
      window.googletag.pubads().refresh();
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setVisible(false);
    
    window.googletag.cmd.push(() => {
      if (preferences.advertising) {
        window.googletag.pubads().enableInitialLoad();
        window.googletag.pubads().refresh();
      } else {
        window.googletag.pubads().disableInitialLoad();
      }
    });
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-xl max-w-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
          We use cookies to personalize content and ads, provide social media features, 
          and analyze our traffic. By using our site you consent to our privacy policy.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={handleAccept} 
            className="text-xs px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Accept All
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="text-xs px-4 text-slate-600 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Manage Preferences
          </button>
        </div>
      </div>

      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full dark:bg-gray-800">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold text-slate-600 dark:text-white">Cookie Preferences</h3>
              <button 
                onClick={() => setShowPreferences(false)}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Essential Cookies</span>
                <input
                  type="checkbox"
                  checked={preferences.essential}
                  disabled
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Analytics Cookies</span>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    analytics: e.target.checked
                  }))}
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Advertising Cookies</span>
                <input
                  type="checkbox"
                  checked={preferences.advertising}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    advertising: e.target.checked
                  }))}
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-700">
              <button
                onClick={handleSavePreferences}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
