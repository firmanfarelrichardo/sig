import React from 'react';

const HazardMapSection = () => {
  return (
    <section id="peta-kerawanan" className="py-24 bg-slate-50 relative">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Kolom Kiri: Visualisasi Mockup / Kartu Berlapis */}
          <div className="order-2 lg:order-1 relative h-full min-h-[400px]">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 absolute top-0 left-0 right-12 bottom-12 z-10 flex flex-col">
              <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"></div>
                {/* Simulated Chart/Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-2 h-20 opacity-50">
                  <div className="w-1/6 bg-slate-300 rounded-t-md h-2/6"></div>
                  <div className="w-1/6 bg-slate-300 rounded-t-md h-4/6"></div>
                  <div className="w-1/6 bg-orange-400 rounded-t-md h-full"></div>
                  <div className="w-1/6 bg-slate-300 rounded-t-md h-3/6"></div>
                  <div className="w-1/6 bg-slate-300 rounded-t-md h-5/6"></div>
                  <div className="w-1/6 bg-slate-300 rounded-t-md h-1/6"></div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
              </div>
            </div>

            {/* Float Card 2 */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-slate-100 absolute bottom-0 right-0 z-20 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Monitoring</p>
                <p className="text-sm font-bold text-slate-800">Rute Alternatif Aktif</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Teks & List */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-200 text-slate-600 font-bold text-[10px] tracking-widest uppercase mb-4">
              <span className="w-2 h-2 bg-slate-500 rounded-sm"></span> Visualisasi Interaktif
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Ubah Data Rumit Menjadi <span className="text-orange-500">Wawasan Nyata</span>
            </h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              Visualisasi geospasial canggih kami mengubah puluhan ribu baris data mentah menjadi peta interaktif yang mudah dipahami. Prediksi area terisolasi dan temukan jalan keluar strategis secara presisi.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Peta Interaktif & Layer Dinamis</h5>
                  <p className="text-xs text-slate-500 mt-0.5">Eksplorasi data spasial secara real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Heatmap Keterisolasian</h5>
                  <p className="text-xs text-slate-500 mt-0.5">Menemukan area blank spot paling rentan</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Laporan & Ekspor Data</h5>
                  <p className="text-xs text-slate-500 mt-0.5">Unduh data populasi terdampak dengan mudah</p>
                </div>
              </div>
            </div>

            <button className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-orange-500 transition-colors flex items-center gap-2">
              Pelajari Visualisasi &rarr;
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HazardMapSection;
