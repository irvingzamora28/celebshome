"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference) {
      setIsDarkMode(storedPreference === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-indigo-600 font-bold text-lg dark:text-white">
          CelebsHome
        </Link>
        <div className="space-x-6">
          <Link href="/privacy" className="text-gray-600 hover:text-indigo-600 text-sm dark:text-white">
            Privacy Policy
          </Link>
          <Link href="/zodiac" className="text-gray-600 hover:text-indigo-600 text-sm dark:text-white">
            Zodiac Signs
          </Link>
        </div>
        <button
          type="button"
          className="text-gray-600 hover:text-indigo-600 dark:text-white"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <FaMoon className="w-6 h-6" /> : <FaSun className="w-6 h-6" />}
        </button>
      </div>
    </nav>
  );
}
