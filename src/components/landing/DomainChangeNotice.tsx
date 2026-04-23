import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'simutrade_domain_notice_dismissed';

const DomainChangeNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-secondary text-lg">📢</span>
            <h3 className="text-secondary font-bold text-base tracking-tight">
              Domain &amp; Email Migration Notice
            </h3>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss notice"
            className="text-secondary/70 hover:text-secondary transition-colors rounded-full p-1 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="bg-white dark:bg-gray-900 px-6 py-5 text-sm text-slate-700 dark:text-slate-200 space-y-3">
          <p>
            From{' '}
            <span className="font-semibold text-primary dark:text-secondary">
              May 6th, 2026
            </span>
            , Simutrade will transition to new domains as{' '}
            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
              simutrade.app
            </code>{' '}
            will not be renewed:
          </p>

          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">🌐</span>
              <span>
                <span className="font-semibold">Website:</span>{' '}
                <a
                  href="https://simutrade.faizath.com"
                  className="text-primary dark:text-secondary underline underline-offset-2 break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  simutrade.faizath.com
                </a>{' '}
                <span className="text-slate-400 text-xs">(formerly simutrade.app)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">⚙️</span>
              <span>
                <span className="font-semibold">API:</span>{' '}
                <a
                  href="https://simutrade-api.faizath.com"
                  className="text-primary dark:text-secondary underline underline-offset-2 break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  simutrade-api.faizath.com
                </a>{' '}
                <span className="text-slate-400 text-xs">(formerly api.simutrade.app)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">📧</span>
              <span>
                <span className="font-semibold">Email:</span>{' '}
                <a
                  href="mailto:contact@simutrade.faizath.com"
                  className="text-primary dark:text-secondary underline underline-offset-2 break-all"
                >
                  contact@simutrade.faizath.com
                </a>{' '}
                <span className="text-slate-400 text-xs">(formerly contact@simutrade.app)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">🛰️</span>
              <span>
                <span className="font-semibold">CDN:</span>{' '}
                <span className="text-slate-600 dark:text-slate-300 break-all">
                  simutrade-cdn.faizath.com
                </span>{' '}
                <span className="text-slate-400 text-xs">(formerly cdn.simutrade.app)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">📈</span>
              <span>
                <span className="font-semibold">Status Pages:</span>{' '}
                <a
                  href="https://status.faizath.com/status/simutrade"
                  className="text-primary dark:text-secondary underline underline-offset-2 break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  status.faizath.com/status/simutrade
                </a>{' '}
                <span className="text-slate-400 text-xs">(formerly status.simutrade.app)</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="bg-secondary/10 dark:bg-secondary/5 border-t border-secondary/20 px-6 py-3 flex justify-end">
          <button
            onClick={dismiss}
            className="bg-primary text-secondary text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default DomainChangeNotice;
