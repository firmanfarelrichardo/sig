import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/landing/HeroSection';
import FeatureSection from './components/landing/FeatureSection';
import HistoricalDataSection from './components/landing/HistoricalDataSection';
import AboutSection from './components/landing/AboutSection';
import Footer from './components/landing/Footer';
import MapDashboard from './components/MapDashboard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [geodata, setGeodata] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('beranda');
  const mainRef = useRef(null);

  // Fix #1: Scroll to top when switching pages
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const fetchGeodata = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/geodata`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal mengambil data geospasial`);
      }
      const data = await response.json();
      setGeodata(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeodata();
  }, [fetchGeodata]);

  const handleToggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const handleRegionChange = (regionValue) => {
    setSelectedRegion(regionValue);
  };

  const handleYearChange = (yearValue) => {
    setSelectedYear(yearValue);
  };

  const calculateStats = useCallback(() => {
    if (!geodata) return { totalFaskes: 0, totalJalan: 0, totalKejadian: 0, zonaKritis: 0 };

    const stats = {
      totalFaskes: 0,
      totalJalan: 0,
      totalKejadian: 0,
      zonaKritis: 0
    };

    geodata.features.forEach(feature => {
      const { type } = feature.geometry;
      const props = feature.properties;

      if (type === 'Point') {
        if (props.tipe) stats.totalFaskes++;
        if (props.tanggal_kejadian) stats.totalKejadian++;
      } else if (type === 'LineString') {
        stats.totalJalan++;
      } else if (type === 'Polygon') {
        stats.zonaKritis++;
      }
    });

    return stats;
  }, [geodata]);

  const stats = calculateStats();

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
      <Navbar currentPage={currentPage} setCurrentPage={navigateTo} />
      
      <main ref={mainRef} className="flex-1 overflow-y-auto relative w-full h-full">
        {currentPage === 'beranda' && (
          <div className="flex flex-col min-h-full animate-fadeIn">
            <HeroSection onExplore={() => navigateTo('peta')} />
            <Footer setCurrentPage={navigateTo} />
          </div>
        )}
        
        {currentPage === 'fitur' && (
          <div className="flex flex-col min-h-full pt-20 animate-fadeIn">
            <FeatureSection />
            <Footer setCurrentPage={navigateTo} />
          </div>
        )}
        
        {currentPage === 'data' && (
          <div className="flex flex-col min-h-full pt-20 animate-fadeIn">
            <HistoricalDataSection stats={stats} geodata={geodata} />
            <Footer setCurrentPage={navigateTo} />
          </div>
        )}
        
        {currentPage === 'tentang' && (
          <div className="flex flex-col min-h-full pt-20 animate-fadeIn">
            <AboutSection onExplore={() => navigateTo('peta')} />
            <Footer setCurrentPage={navigateTo} />
          </div>
        )}
        
        {currentPage === 'peta' && (
          <MapDashboard 
            geodata={geodata}
            isSimulating={isSimulating}
            onToggleSimulation={handleToggleSimulation}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            stats={stats}
            isLoading={isLoading}
            error={error}
          />
        )}
      </main>
    </div>
  );
}

export default App;
