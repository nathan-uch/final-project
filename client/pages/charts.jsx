import React, { useState, useEffect } from 'react';
import LoadingRing from '../components/loading-ring';
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
      const cur = new Date(week);
      const d = cur.toLocaleString('default', { day: 'numeric', month: 'short' });
      result.push(d);
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
    }
  };

  const data = {
    labels,
    datasets: [{
      label: 'Total Number of Workouts',
      backgroundColor: 'rgba(255, 226, 71, 0.75)',
      data: [4, 3, 4, 3, 2, 1, 4, 5]
    }]
  };

  return (
    <div className="body-container has-text-centered">
      {!labels
        ? <LoadingRing />
        : <div className="chart-container mx-auto p-2">
          <Bar
            options={options}
            data={data}
          />
        </div>
      }
    </div>
  );
}
