import React from 'react';

const SkipNavLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
  >
    Skip to main content
  </a>
);

export default SkipNavLink;
