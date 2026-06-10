import React from 'react';

const IconGlobeBrown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8b5a2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="w-full pt-4 px-4 sm:px-6 z-50 absolute top-0 left-0 right-0">
      <nav className="max-w-[1400px] mx-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-full px-5 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        {/* Logo & Teks */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('beranda')}>
          <div className="w-10 h-10 rounded-full bg-[#fcecd4] flex items-center justify-center border border-[#e5a060]">
            <IconGlobeBrown />
          </div>
          <span className="text-xl font-extrabold tracking-wide text-slate-800">
            POLARIS
          </span>
        </div>

        {/* Menu Navigasi Tengah */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
          <button 
            onClick={() => setCurrentPage('beranda')} 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'beranda' ? 'bg-[#8b5a2b] text-white shadow-md' : 'text-slate-600 hover:text-[#8b5a2b] hover:bg-white'}`}
          >
            Beranda
          </button>
          <button 
            onClick={() => setCurrentPage('fitur')} 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'fitur' ? 'bg-[#8b5a2b] text-white shadow-md' : 'text-slate-600 hover:text-[#8b5a2b] hover:bg-white'}`}
          >
            Fitur
          </button>
          <button 
            onClick={() => setCurrentPage('peta')} 
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${currentPage === 'peta' ? 'bg-orange-500 text-white shadow-md' : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'}`}
          >
            Peta Bencana
          </button>
          <button 
            onClick={() => setCurrentPage('data')} 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'data' ? 'bg-[#8b5a2b] text-white shadow-md' : 'text-slate-600 hover:text-[#8b5a2b] hover:bg-white'}`}
          >
            Data Historis
          </button>
          <button 
            onClick={() => setCurrentPage('tentang')} 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'tentang' ? 'bg-[#8b5a2b] text-white shadow-md' : 'text-slate-600 hover:text-[#8b5a2b] hover:bg-white'}`}
          >
            Tentang
          </button>
        </div>

        {/* Kanan - Lampung Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8b5a2b]/10 border border-[#8b5a2b]/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-wider">Lampung</span>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
