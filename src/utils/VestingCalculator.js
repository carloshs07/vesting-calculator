class VestingCalculator {
  constructor(config) {
    this.plazoAnios = config.plazoAnios;
    this.stocksPorPeriodo = config.stocksPorPeriodo || {}; // Object with year -> stocks mapping
    this.mesGranted = config.mesGranted; // Month name (e.g., 'Agosto')
    this.mesesVest = [2, 8]; // Febrero y Agosto
    this.totalMonths = this.plazoAnios * 12;
    this.startYear = config.startYear || new Date().getFullYear();
    this.startMonth = config.startMonth || 1; // 1-12
    
    // Convert month names to numbers
    this.mesGrantedNumber = this.getMonthNumber(this.mesGranted);
  }

  calculateVesting() {
    const vestingData = [];
    let totalGranted = 0;
    let totalVested = 0;
    
    // Array para trackear stocks pendientes por año de grant
    const stocksPendientesPorAno = [];

    for (let month = 0; month < this.totalMonths; month++) {
      const currentYear = Math.floor(month / 12);
      const currentMonthInYear = (month % 12) + 1; // 1-12
      const actualYear = this.startYear + currentYear;
      
      let grantsThisMonth = 0;
      let vestsThisMonth = 0;

      // Check if this is a grant month
      if (currentMonthInYear === this.mesGrantedNumber) {
        // Get stocks for this specific year, default to 0 if not specified
        grantsThisMonth = this.stocksPorPeriodo[actualYear] || 0;
        totalGranted += grantsThisMonth;
        
        // Add new stocks to pending array only if there are grants
        if (grantsThisMonth > 0) {
          stocksPendientesPorAno.push({
            year: currentYear,
            actualYear: actualYear,
            stocksRemaining: grantsThisMonth,
            vestingSchedule: this.createVestingSchedule(currentYear)
          });
        }
      }

      // Check if this is a vesting month (February and August)
      if (this.mesesVest.includes(currentMonthInYear)) {
        // Process vesting for all granted stock batches
        for (let batch of stocksPendientesPorAno) {
          if (batch.stocksRemaining > 0 && this.shouldVest(batch, currentYear, currentMonthInYear)) {
            const vestAmount = Math.min(1, batch.stocksRemaining); // Vest 1 stock max per batch per vesting period
            batch.stocksRemaining -= vestAmount;
            vestsThisMonth += vestAmount;
            totalVested += vestAmount;
          }
        }
      }

      const unvestedStocks = totalGranted - totalVested;

      vestingData.push({
        month: month,
        year: currentYear,
        actualYear: actualYear,
        monthInYear: currentMonthInYear,
        monthName: this.getMonthName(currentMonthInYear),
        totalStocks: totalGranted,
        vestedStocks: totalVested,
        unvestedStocks: unvestedStocks,
        grantsThisMonth: grantsThisMonth,
        vestsThisMonth: vestsThisMonth,
        isGrantMonth: grantsThisMonth > 0,
        isVestMonth: vestsThisMonth > 0,
        stocksPendientesPorAno: stocksPendientesPorAno.map(batch => ({
          actualYear: batch.actualYear,
          stocksRemaining: batch.stocksRemaining
        }))
      });
    }

    return vestingData;
  }

  createVestingSchedule(grantYear) {
    // Create vesting schedule for a grant made in a specific year
    // Each grant vests 1 stock in February and August for multiple years
    const schedule = [];
    
    // Start vesting from the February after the grant year
    const startYear = grantYear + (this.mesGranted <= 2 ? 0 : 1);
    
    for (let year = startYear; year < grantYear + this.plazoAnios; year++) {
      this.mesesVest.forEach(vestMonth => {
        schedule.push({ year, month: vestMonth });
      });
    }
    
    return schedule;
  }

  shouldVest(batch, currentYear, currentMonth) {
    // Check if stocks from this batch should vest in the current month/year
    return batch.vestingSchedule.some(
      schedule => schedule.year === currentYear && schedule.month === currentMonth
    );
  }

  getMonthName(monthNumber) {
    const months = [
      '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber];
  }

  getMonthNumber(monthName) {
    const months = {
      'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4, 'Mayo': 5, 'Junio': 6,
      'Julio': 7, 'Agosto': 8, 'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
    };
    return months[monthName] || 8; // Default to August
  }

  getMonthNames() {
    return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  }

  // Helper method to get summary statistics
  getSummary(vestingData) {
    const lastMonth = vestingData[vestingData.length - 1];
    const totalGrants = vestingData.reduce((sum, month) => sum + month.grantsThisMonth, 0);
    const totalVests = lastMonth.vestedStocks;
    const totalUnvested = lastMonth.unvestedStocks;
    const remainingStocksByYear = lastMonth.stocksPendientesPorAno || [];
    
    // Calculate vested stocks by year
    const vestedByYear = {};
    Object.keys(this.stocksPorPeriodo).forEach(year => {
      const grantedForYear = this.stocksPorPeriodo[year] || 0;
      const remainingForYear = remainingStocksByYear.find(batch => batch.actualYear == year)?.stocksRemaining || 0;
      vestedByYear[year] = grantedForYear - remainingForYear;
    });

    return {
      totalGrants,
      totalVests,
      totalUnvested,
      remainingStocksByYear,
      vestedByYear,
      vestingPercentage: totalGrants > 0 ? (totalVests / totalGrants) * 100 : 0
    };
  }

  // Get all grant and vest events for timeline visualization
  getEvents(vestingData) {
    const events = [];
    
    vestingData.forEach((monthData, index) => {
      if (monthData.isGrantMonth) {
        events.push({
          month: index,
          type: 'grant',
          amount: monthData.grantsThisMonth,
          description: `Grant de ${monthData.grantsThisMonth} stocks`
        });
      }
      
      if (monthData.isVestMonth) {
        events.push({
          month: index,
          type: 'vest',
          amount: monthData.vestsThisMonth,
          description: `Vest de ${monthData.vestsThisMonth} stocks`
        });
      }
    });
    
    return events;
  }
}

export default VestingCalculator;