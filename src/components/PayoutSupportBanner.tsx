import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PayoutSupportBanner = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem('payout_banner_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('payout_banner_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
              <div className="text-center sm:text-left">
                <div className="font-semibold text-sm sm:text-base">✅ Trade With Confidence!</div>
                <div className="text-xs sm:text-sm opacity-95">If your payout ever gets rejected, we’ve got your back. Buy accounts using our code & get support from the Payout Cases team.</div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="https://x.com/Payout_cases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-white/15 hover:bg-white/25 text-white px-3 py-2 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                    <path d="M18.244 2H21.5l-7.67 8.766L23 22h-6.937l-5.42-6.33L4.2 22H.94l8.2-9.38L1 2h7.063l4.91 5.657L18.244 2Zm-1.214 18.286h1.942L7.05 3.64H5.01l12.02 16.647Z" />
                  </svg>
                  Follow Payout Cases
                </a>
                <button
                  aria-label="Close banner"
                  onClick={handleClose}
                  className="p-1 rounded-md hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PayoutSupportBanner;
