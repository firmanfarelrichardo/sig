import React from 'react';

// Globe icon brown
const IconGlobeBrown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const Footer = ({ scrollToSection }) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#fcecd4] flex items-center justify-center border border-[#e5a060]">
                <IconGlobeBrown />
              </div>
              <span className="text-xl font-extrabold text-slate-900">POLARIS</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Sistem pendukung keputusan geospasial yang dirancang untuk membantu BPBD dan pihak berwenang dalam menganalisis dan merespons krisis bencana tanah longsor di Sumatera.
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-bold mb-4 uppercase text-sm tracking-wider">Tautan Pintas</h4>
            <ul className="space-y-3">
              <li><button onClick={() => scrollToSection('beranda')} className="text-slate-600 hover:text-orange-500 text-sm transition-colors">Beranda Utama</button></li>
              <li><button onClick={() => scrollToSection('fitur')} className="text-slate-600 hover:text-orange-500 text-sm transition-colors">Mekanisme Sistem</button></li>
              <li><button onClick={() => scrollToSection('peta-kerawanan')} className="text-slate-600 hover:text-orange-500 text-sm transition-colors">Data Kerawanan</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-bold mb-4 uppercase text-sm tracking-wider">Kontak Instansi</h4>
            <ul className="space-y-3">
              <li className="text-slate-600 text-sm">BPBD Provinsi Lampung</li>
              <li className="text-slate-600 text-sm">Jl. Raya Lintas Sumatera, Lampung</li>
              <li className="text-slate-600 text-sm">Email: pusdalops@lampungprov.go.id</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            &copy; {new Date().getFullYear()} POLARIS Analytics & BPBD Provinsi Lampung. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-slate-500 text-sm hover:text-orange-500 cursor-pointer transition-colors">Syarat & Ketentuan</span>
            <span className="text-slate-500 text-sm hover:text-orange-500 cursor-pointer transition-colors">Privasi Data</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
