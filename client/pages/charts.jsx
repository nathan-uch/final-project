import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FrequencyChart() {
  const [labels, setLabels] = useState(null);
  const [data] = useState(null);
  const { accessToken } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/user/all-workouts', { headers: { 'X-Access-Token': accessToken } })
      .then(response => response.json())
      .then(result => {
      })
      .catch(err => console.error('ERROR:', err));
  }, [accessToken]);

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + (((1 - 7 - date.getDay()) % 7) || 7));
    const weeks = [date.getTime()];
    for (let i = 0; i < 7; i++) {
      const current = date.setDate(date.getDate() - 7);
      weeks.push(current);
    }
    const result = [];
    weeks.forEach(week => {
      const a = ['Week'];
      const cur = new Date(week);
      const d = cur.toLocaleString('default', { day: 'numeric', month: 'short' });
      a.push(d);
      result.push(a);
    });
    setLabels(result);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Workouts Per Week'
      }
    },
    scales: {
      y: {
        suggestedMax: 5,
        ticks: { stepSize: 1 }
      }
    }
  };

  const chartData = {
    labels,
    datasets: [{
      label: 'Total Number of Workouts',
      backgroundColor: 'rgba(255, 226, 71, 0.75)',
      data
      // data: [4, 3, 4, 3, 2, 1, 4, 5]
    }]
  };

  return (
    <div className="body-container has-text-centered">
      {!labels
        ? <LoadingRing />
        : <div className="chart-container mx-auto p-2">
          <Bar
            options={options}
            data={chartData}
          />
        </div>
      }
    </div>
  );
}
