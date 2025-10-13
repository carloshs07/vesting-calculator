import React, { useState, useEffect } from 'react';
import './App.css';
import Timeline from './components/Timeline';
import VestingCalculator from './utils/VestingCalculator';

function App() {
  // Get current date for default values
  const currentYear = new Date().getFullYear();
  const currentMonthNumber = new Date().getMonth() + 1;
  
  // Configuration state
  const [config, setConfig] = useState({
    plazoAnios: 5,
    mesGranted: 'Agosto', // Month name instead of number
    mesesVest: [2, 8], // Febrero y Agosto
    startYear: currentYear,
    startMonth: currentMonthNumber,
    stocksPorPeriodo: {} // Will be populated with year -> stocks mapping
  });

  // Timeline state
  const [currentMonth, setCurrentMonth] = useState(0);
  const [vestingData, setVestingData] = useState([]);
  const [totalMonths, setTotalMonths] = useState(0);

  // Initialize stocks per period when plazoAnios or startYear changes
  useEffect(() => {
    const newStocksPorPeriodo = {};
    for (let i = 0; i < config.plazoAnios; i++) {
      const year = config.startYear + i;
      // Keep existing value or default to 10
      newStocksPorPeriodo[year] = config.stocksPorPeriodo[year] || 10;
    }
    if (JSON.stringify(newStocksPorPeriodo) !== JSON.stringify(config.stocksPorPeriodo)) {
      setConfig(prev => ({
        ...prev,
        stocksPorPeriodo: newStocksPorPeriodo
      }));
    }
  }, [config.plazoAnios, config.startYear]);

  // Calculate vesting data when config changes
  useEffect(() => {
    if (Object.keys(config.stocksPorPeriodo).length > 0) {
      const calculator = new VestingCalculator(config);
      const data = calculator.calculateVesting();
      setVestingData(data);
      setTotalMonths(config.plazoAnios * 12);
    }
  }, [config]);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStocksPerYearChange = (year, value) => {
    setConfig(prev => ({
      ...prev,
      stocksPorPeriodo: {
        ...prev.stocksPorPeriodo,
        [year]: parseInt(value) || 0
      }
    }));
  };

  const getMonthNames = () => {
    return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  };

  const getSummaryData = () => {
    if (vestingData.length === 0) return null;
    const calculator = new VestingCalculator(config);
    return calculator.getSummary(vestingData);
  };

  const getCurrentData = () => {
    if (vestingData.length === 0 || currentMonth >= vestingData.length) {
      return { totalStocks: 0, vestedStocks: 0, unvestedStocks: 0, grants: 0, vests: 0 };
    }
    return vestingData[currentMonth];
  };

  const currentData = getCurrentData();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculadora de Vesting de Acciones</h1>
        <p>Herramienta interactiva para calcular el progreso de vesting de acciones</p>
      </header>

        {/* Floating Summary Panel */}
        <div className="floating-summary">
          <h3>Resumen Actual</h3>
          <div className="floating-summary-stats">
            <div className="floating-stat">
              <span className="floating-label">Período:</span>
              <span className="floating-value">{currentData.monthName} {currentData.actualYear}</span>
            </div>
            <div className="floating-stat">
              <span className="floating-label">Mes:</span>
              <span className="floating-value">{currentMonth + 1}/{totalMonths}</span>
            </div>
            <div className="floating-stat total">
              <span className="floating-label">Total:</span>
              <span className="floating-value">{currentData.totalStocks}</span>
            </div>
            <div className="floating-stat vested">
              <span className="floating-label">Vested:</span>
              <span className="floating-value">{currentData.vestedStocks}</span>
            </div>
            <div className="floating-stat unvested">
              <span className="floating-label">Sin Vest:</span>
              <span className="floating-value">{currentData.unvestedStocks}</span>
            </div>
            {currentData.isGrantMonth && (
              <div className="floating-stat grant">
                <span className="floating-label">🎯 Grant:</span>
                <span className="floating-value">{currentData.grantsThisMonth}</span>
              </div>
            )}
            {currentData.isVestMonth && currentData.vestsThisMonth > 0 && (
              <div className="floating-stat vest">
                <span className="floating-label">⚡ Vest:</span>
                <span className="floating-value">{currentData.vestsThisMonth}</span>
              </div>
            )}
          </div>
        </div>

        <div className="main-container">
        {/* Configuration Panel */}
        <div className="config-panel">
          <h2>Configuración</h2>
          <div className="config-grid">
            <div className="config-item">
              <label htmlFor="plazoAnios">Plazo (años):</label>
              <input
                id="plazoAnios"
                type="number"
                min="1"
                max="10"
                value={config.plazoAnios}
                onChange={(e) => handleConfigChange('plazoAnios', parseInt(e.target.value))}
              />
            </div>
            
            <div className="config-item">
              <label htmlFor="startYear">Año de inicio:</label>
              <input
                id="startYear"
                type="number"
                min="2020"
                max="2035"
                value={config.startYear}
                onChange={(e) => handleConfigChange('startYear', parseInt(e.target.value))}
              />
            </div>
            
            <div className="config-item">
              <label htmlFor="startMonth">Mes de inicio:</label>
              <select
                id="startMonth"
                value={config.startMonth}
                onChange={(e) => handleConfigChange('startMonth', parseInt(e.target.value))}
              >
                {getMonthNames().map((month, index) => (
                  <option key={index + 1} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
            
            <div className="config-item">
              <label htmlFor="mesGranted">Mes de Grant:</label>
              <select
                id="mesGranted"
                value={config.mesGranted}
                onChange={(e) => handleConfigChange('mesGranted', e.target.value)}
              >
                {getMonthNames().map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Dynamic Stocks per Year */}
          <div className="stocks-per-year-section">
            <h3>Stocks por Año</h3>
            <div className="stocks-per-year-grid">
              {Object.keys(config.stocksPorPeriodo).map((year) => (
                <div key={year} className="config-item">
                  <label htmlFor={`stocks-${year}`}>{year}:</label>
                  <input
                    id={`stocks-${year}`}
                    type="number"
                    min="0"
                    value={config.stocksPorPeriodo[year] || 0}
                    onChange={(e) => handleStocksPerYearChange(year, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Component */}
        <div className="timeline-container">
          <Timeline
            data={vestingData}
            currentMonth={currentMonth}
            totalMonths={totalMonths}
            onMonthChange={setCurrentMonth}
            config={config}
          />
        </div>
      </div>
    </div>
  );
}

export default App;