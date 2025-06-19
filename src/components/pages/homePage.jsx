import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from 'chart.js';
import './SalesDashboard.css';
import { getGraphDataStatistics, getSalesStatistics } from '../../utils/api';
// You need to install date-fns: npm install date-fns
import { eachDayOfInterval, format, parseISO } from 'date-fns';

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler
);

const SalesDashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weekLabels, setWeekLabels] = useState([]);
  const [weekSales, setWeekSales] = useState([]);
  const [stats, setStats] = useState(null);

  // Fetch graph data from API
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const data = await getGraphDataStatistics(startDate, endDate);
        console.log("data is fetched", data)
        if (!data.length) {
          setWeekLabels([]);
          setWeekSales([]);
          return;
        }
        // Fill missing days with 0
        const minDate = parseISO(data[0].date);
        const maxDate = parseISO(data[data.length - 1].date);
        const allDates = eachDayOfInterval({ start: minDate, end: maxDate }).map(d =>
          format(d, 'yyyy-MM-dd')
        );
        const dataMap = Object.fromEntries(data.map(d => [d.date, d.totalAmount]));
        const filledSales = allDates.map(date => dataMap[date] || 0);
        setWeekLabels(allDates);
        setWeekSales(filledSales);
      } catch {
        setWeekLabels([]);
        setWeekSales([]);
      }
    };
    fetchGraphData();
  }, [startDate, endDate]);

  // Fetch statistics data from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSalesStatistics(startDate, endDate);
        setStats(data);
      } catch {
        setStats(null);
      }
    };
    fetchStats();
  }, [startDate, endDate]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Sales Dashboard</h1>
        <div className="filters">
          {/* Time filter */}
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            placeholder="Start Date"
            style={{ marginLeft: 8 }}
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            placeholder="End Date"
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>

      <div className="main-graph">
        <Line
          data={{
            labels: weekLabels,
            datasets: [
              {
                label: 'Sales (PKR)',
                data: weekSales,
                borderColor: '#31C58D',
                backgroundColor: '#31C58D55',
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (ctx) => `Rs. ${ctx.raw?.toLocaleString?.() ?? ctx.raw}`,
                },
              },
              legend: { display: false },
            },
            scales: {
              y: {
                ticks: {
                  callback: (value) => `Rs. ${value}`,
                },
              },
            },
          }}
        />
      </div>

      {/* Render statistics below the graph */}
      {stats && (
        <div className="statistics-summary styled-stats-card">
          <h2>📊 Sales Statistics</h2>
          <div className="stats-total"><strong>Total Sales Amount:</strong> <span>Rs. {stats.totalAmount?.toLocaleString()}</span></div>

          {/* Product-wise stats */}
          <h3 style={{ marginTop: 16 }}>Product-wise Sales</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.products || {}).map(([product, details], idx) => (
                <tr key={product} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{product}</td>
                  <td>{details.quantity}</td>
                  <td>{details.salesAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Franchise-wise stats */}
          <h3>Franchise-wise Sales</h3>
          {stats.franchises?.map(fr => (
            <div key={fr.franchise} className="franchise-card">
              <div className="franchise-title"><strong>{fr.franchise}</strong> — Total Sales: <span>Rs. {fr.totalSaleAmount?.toLocaleString()}</span></div>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {fr.productwiseSales.map((p, idx) => (
                    <tr key={p.product} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                      <td>{p.product}</td>
                      <td>{p.quantity}</td>
                      <td>{p.salesAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;

// Add custom styles for statistics tables and cards
<style>{`
.styled-stats-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 32px 24px;
  margin: 0 auto 32px auto;
  max-width: 900px;
}
.stats-total {
  font-size: 1.2rem;
  margin-bottom: 18px;
  background: #f6f8fa;
  padding: 10px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.stats-total span {
  color: #31C58D;
  font-weight: bold;
}
.stats-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 18px;
  font-size: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}
.stats-table th {
  background: #31C58D;
  color: #fff;
  font-weight: 600;
  padding: 10px 8px;
  border: none;
  white-space: normal;
  text-align: left;
}
.stats-table td {
  padding: 10px 8px;
  border: none;
  text-align: center;
}
.stats-table td:last-child {
  text-align: left;
}
.even-row {
  background: #f6f8fa;
}
.odd-row {
  background: #fff;
}
.franchise-card {
  margin-bottom: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fcfcfc;
  padding: 18px 16px 8px 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
}
.franchise-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #222;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.franchise-title span {
  color: #31C58D;
  font-weight: bold;
}
`}</style>
