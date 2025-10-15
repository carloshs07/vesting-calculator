import React, { useRef, useEffect } from 'react';

import { Chart } from 'react-chartjs-2';
import './Timeline.css';

const Timeline = ({ data, currentMonth, totalMonths, onMonthChange, config }) => {
  const chartRef = useRef();

  // Prepare chart data with highlighted vesting months
  const getVestingMonthNames = () => ['Febrero', 'Agosto'];
  
  const chartData = {
    labels: data.map((d, index) => {
      if (index % 6 === 0 || d.isGrantMonth || d.isVestMonth) {
        const isVestingMonth = getVestingMonthNames().includes(d.monthName);
        return isVestingMonth ? `★ ${d.monthName} ${d.actualYear}` : `${d.monthName} ${d.actualYear}`;
      }
      return '';
    }),
    datasets: [
      {
        type: 'line',
        label: 'Total Stocks',
        data: data.map(d => d.totalStocks),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        type: 'line',
        label: 'Stocks Vested',
        data: data.map(d => d.vestedStocks),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
      },
      {
        type: 'bar',
        label: 'Grants',
        data: data.map(d => d.grantsThisMonth),
        backgroundColor: 'rgba(168, 85, 247, 0.7)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Vests',
        data: data.map(d => d.vestsThisMonth),
        backgroundColor: 'rgba(245, 101, 101, 0.7)',
        borderColor: 'rgb(245, 101, 101)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso de Vesting de Acciones',
      },
      tooltip: {
        callbacks: {
          afterBody: function(context) {
            const dataIndex = context[0].dataIndex;
            const monthData = data[dataIndex];
            if (!monthData) return [];
            
            return [
              `Mes: ${monthData.monthName} Año ${monthData.actualYear}`,
              `Stocks Sin Vest: ${monthData.unvestedStocks}`,
              monthData.isGrantMonth ? `📈 Grant: ${monthData.grantsThisMonth} stocks` : '',
              monthData.isVestMonth && monthData.vestsThisMonth > 0 ? `📉 Vest: ${monthData.vestsThisMonth} stocks` : ''
            ].filter(line => line !== '');
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Línea de Tiempo'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          callback: function(value, index, values) {
            const label = this.getLabelForValue(value);
            return label;
          },
          color: function(context) {
            const label = context.tick.label;
            if (label && label.includes('★')) {
              return '#8b5cf6'; // Purple color for vesting months
            }
            return '#64748b'; // Default gray
          },
          font: function(context) {
            const label = context.tick.label;
            if (label && label.includes('★')) {
              return {
                weight: 'bold',
                size: 12
              };
            }
            return {
              weight: 'normal',
              size: 11
            };
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Número de Stocks'
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Grants/Vests por Mes'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        onMonthChange(clickedIndex);
      }
    }
  };

  // Update chart annotation for current month
  useEffect(() => {
    const chart = chartRef.current;
    if (chart && data.length > 0) {
      // Add vertical line for current month
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      
      if (chartArea) {
        chart.update('none');
      }
    }
  }, [currentMonth]);

  const handleSliderChange = (e) => {
    const month = parseInt(e.target.value);
    onMonthChange(month);
  };

  const currentData = data[currentMonth] || {};

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>Línea de Tiempo Interactiva</h2>
        <div className="timeline-info">
          <span className="current-period">
            {currentData.monthName} {currentData.actualYear} 
            ({currentMonth + 1} de {totalMonths} meses)
          </span>
        </div>
      </div>

      <div className="chart-container">
        <Chart
          ref={chartRef}
          type="bar"
          data={chartData}
          options={chartOptions}
        />
      </div>

      <div className="timeline-controls">
        <div className="slider-container">
          <label htmlFor="timeline-slider">Navegar en el tiempo:</label>
          <div className="current-period-indicator">
            <span className="period-text">{currentData.monthName} {currentData.actualYear}</span>
            <span className="progress-text">Mes {currentMonth + 1} de {totalMonths}</span>
          </div>
          <input
            id="timeline-slider"
            type="range"
            min="0"
            max={Math.max(0, totalMonths - 1)}
            value={currentMonth}
            onChange={handleSliderChange}
            className="timeline-slider"
          />
          <div className="slider-labels">
            <span>Inicio</span>
            <span>{currentData.monthName} {currentData.actualYear}</span>
            <span>Final</span>
          </div>
        </div>

        <div className="timeline-buttons">
          <button 
            onClick={() => onMonthChange(Math.max(0, currentMonth - 1))}
            disabled={currentMonth === 0}
            className="nav-button"
          >
            ← Mes Anterior
          </button>
          <button 
            onClick={() => onMonthChange(0)}
            className="nav-button"
          >
            Inicio
          </button>
          <button 
            onClick={() => onMonthChange(totalMonths - 1)}
            className="nav-button"
          >
            Final
          </button>
          <button 
            onClick={() => onMonthChange(Math.min(totalMonths - 1, currentMonth + 1))}
            disabled={currentMonth === totalMonths - 1}
            className="nav-button"
          >
            Mes Siguiente →
          </button>
        </div>
      </div>

      {/* Event indicators */}
      <div className="event-indicators">
        <div className="event-legend">
          <div className="legend-item">
            <div className="legend-color grant-color"></div>
            <span>Mes de Grant</span>
          </div>
          <div className="legend-item">
            <div className="legend-color vest-color"></div>
            <span>Mes de Vest</span>
          </div>
        </div>
        
        {currentData.isGrantMonth && (
          <div className="event-notification grant-event">
            📈 Grant de {currentData.grantsThisMonth} stocks en {currentData.monthName} {currentData.actualYear}
          </div>
        )}
        
        {currentData.isVestMonth && currentData.vestsThisMonth > 0 && (
          <div className="event-notification vest-event">
            📉 Vest de {currentData.vestsThisMonth} stocks en {currentData.monthName} {currentData.actualYear}
          </div>
        )}
      </div>

      <div className="timeline-summary">
        <div className="progress-bar">
          <div className="progress-label">Progreso del Vesting</div>
          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ 
                width: `${currentData.totalStocks > 0 ? (currentData.vestedStocks / currentData.totalStocks) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <div className="progress-text">
            {currentData.totalStocks > 0 
              ? `${((currentData.vestedStocks / currentData.totalStocks) * 100).toFixed(1)}%`
              : '0%'
            } vested
          </div>
        </div>
        
        {/* Show vested stocks summary at the end of the period */}
        {currentMonth === totalMonths - 1 && (
          <div className="end-period-summaries">
            <div className="vested-by-year-section">
              <h4>Resumen de Stocks Vested por Año</h4>
              <div className="vested-by-year-grid">
                {config.stocksPorPeriodo && Object.keys(config.stocksPorPeriodo).map((year) => {
                  const granted = config.stocksPorPeriodo[year] || 0;
                  const remaining = currentData.stocksPendientesPorAno?.find(batch => batch.actualYear == year)?.stocksRemaining || 0;
                  const vested = granted - remaining;
                  const vestingPercentage = granted > 0 ? ((vested / granted) * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={year} className="vested-year-card">
                      <div className="vested-year-header">
                        <span className="vested-year-title">Año {year}</span>
                        <span className="vested-percentage">{vestingPercentage}%</span>
                      </div>
                      <div className="vested-year-stats">
                        <div className="vested-stat">
                          <span className="vested-stat-label">Granted:</span>
                          <span className="vested-stat-value granted">{granted}</span>
                        </div>
                        <div className="vested-stat">
                          <span className="vested-stat-label">Vested:</span>
                          <span className="vested-stat-value vested">{vested}</span>
                        </div>
                        <div className="vested-stat">
                          <span className="vested-stat-label">Restante:</span>
                          <span className="vested-stat-value remaining">{remaining}</span>
                        </div>
                      </div>
                      <div className="vested-progress-bar">
                        <div 
                          className="vested-progress-fill"
                          style={{ width: `${vestingPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Show remaining stocks at the end of the period */}
            <div className="remaining-stocks-section">
              <h4>Stocks Remanentes al Final del Período</h4>
              <div className="remaining-stocks">
                {currentData.stocksPendientesPorAno?.length > 0 ? (
                  currentData.stocksPendientesPorAno.map((batch, index) => (
                    <div key={index} className="remaining-batch">
                      <span className="batch-year">Año {batch.actualYear}:</span>
                      <span className="batch-stocks">{batch.stocksRemaining} stocks</span>
                    </div>
                  ))
                ) : (
                  <p className="no-remaining">No hay stocks remanentes sin vest</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;