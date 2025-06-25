import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from 'chart.js';
import { getGraphDataStatistics, getSalesStatistics } from '../../utils/api';
import { eachDayOfInterval, format, parse, parseISO, subDays, endOfDay } from 'date-fns';
import '../../App.css';

ChartJS.register(
  LineElement,
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

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
  const weekAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd');
    setEndDate(today);
    setStartDate(weekAgo);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchDashboardData = async () => {
      try {
        const start = parse(startDate, 'yyyy-MM-dd', new Date());
        const end = endOfDay(parse(endDate, 'yyyy-MM-dd', new Date()));
        console.log('Sending to API:', { start, end });

        const [graphData, statsData] = await Promise.all([
          getGraphDataStatistics(start.toISOString(), end.toISOString()),
          getSalesStatistics(start.toISOString(), end.toISOString()),
        ]);

        if (graphData && graphData.length > 0) {
          const allDates = eachDayOfInterval({
            start: parseISO(graphData[0].date),
            end: parseISO(graphData[graphData.length - 1].date),
          }).map((d) => format(d, 'yyyy-MM-dd'));

          const dataMap = Object.fromEntries(
            graphData.map((d) => [d.date, d.totalAmount])
          );
          const filledSales = allDates.map((date) => dataMap[date] || 0);

          setWeekLabels(allDates);
          setWeekSales(filledSales);
        } else {
          setWeekLabels([]);
          setWeekSales([]);
        }

        setStats(statsData);
      } catch {
        setWeekLabels([]);
        setWeekSales([]);
        setStats(null);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  return (
    <div >
      <div className="dashboard-header section-header">
        <h2>Statistics</h2>
        <div className="section-header-actions">
          <div className="date-picker-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-picker-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      </div>

      <div className="content-area">
        <Line
          data={{
            labels: weekLabels,
            datasets: [
              {
                label: 'Sales (PKR)',
                data: weekSales,
                borderColor: 'var(--accent-green)',
                backgroundColor: '#31C58D44',
                tension: 0.4,
                pointRadius: 4,
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
                  label: ctx => `Rs. ${ctx.raw?.toLocaleString?.() ?? ctx.raw}`,
                },
              },
              legend: { display: false },
            },
            scales: {
              y: {
                ticks: {
                  callback: value => `Rs. ${value}`,
                  color: 'white',
                },
                grid: { color: 'rgba(255,255,255,0.05)' },
              },
              x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255,255,255,0.03)' },
              },
            },
          }}
        />
      </div>

      {stats && (
        <div className="content-area" style={{ marginTop: '30px' }}>
          <h3>📈 Total Sales Amount: <span style={{ color: 'var(--accent-green)' }}>Rs. {stats.totalAmount?.toFixed(2)}</span></h3>
          <h3> Total Sales Count # <span style={{ color: 'var(--accent-green)' }}>{stats.totalCount?.toFixed(0)}</span></h3>

          <div className="stats-section">
            <h4>Product-wise Sales</h4>
            <table className="stats-table">
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {Object.entries(stats.products || {}).map(([product, d]) => (
                  <tr key={product}>
                    <td>{product}</td>
                    <td>{d.quantity}</td>
                    <td>Rs. {d.salesAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Franchise-wise Sales</h4>
            {stats.franchises?.map(fr => (
              <div key={fr.franchise} className="franchise-card">
                <div className="franchise-title">{fr.franchise} — <span>Rs. {fr.totalSaleAmount?.toFixed(2)} / Total Count # {fr?.totalCount} </span></div>
                <table className="stats-table">
                  <thead><tr><th>Product</th><th>Qty</th><th>Amount</th></tr></thead>
                  <tbody>
                    {fr.productwiseSales.map((p) => (
                      <tr key={p.product}>
                        <td>{p.product}</td>
                        <td>{p.quantity}</td>
                        <td>Rs. {p.salesAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
