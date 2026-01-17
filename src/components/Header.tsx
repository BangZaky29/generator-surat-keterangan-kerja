import React from 'react';
import logo from '../assets/NS_white_01.png';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Brand Section */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* Logo - Cleaner display without heavy box */}
            <div className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Logo"
                className="h-10 w-auto md:h-12 object-contain"
              />
            </div>

            {/* Divider for desktop */}
            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            {/* Title Block */}
            <div className="flex flex-col justify-center">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">
                Generator Surat Keterangan Kerja
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Buat Surat Pengalaman Kerja (Paklaring) Profesional
              </p>
            </div>

          </div>

          {/* Right Side: Simple Badge */}
          <div className="hidden md:flex items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Gratis & Tanpa Watermark
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;