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
  const [data, setData] = useState(null);
  const { accessToken } = useContext(AppContext);

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
      result.unshift(a);
    });
    setLabels(result);
  }, []);

  useEffect(() => {
    fetch('/api/user/all-workouts', { headers: { 'X-Access-Token': accessToken } })
      .then(response => response.json())
      .then(result => {
        if (labels) {
          const r = [0, 0, 0, 0, 0, 0, 0, 0];
          const oldest = new Date(labels[0][1]);
          result.forEach(workout => {
            const completeDate = new Date(workout.completedAt);
            const year = completeDate.getFullYear();
            if (year !== new Date().getFullYear()) return;
            if (completeDate < oldest) return;
            if (completeDate > new Date(labels[0][1] && completeDate < new Date(labels[1][1]))) {
              r[7]++;
            } else if (completeDate > new Date(labels[1][1] && completeDate < new Date(labels[2][1]))) {
              r[6]++;
            } else if (completeDate > new Date(labels[2][1] && completeDate < new Date(labels[3][1]))) {
              r[5]++;
            } else if (completeDate > new Date(labels[3][1] && completeDate < new Date(labels[4][1]))) {
              r[4]++;
            } else if (completeDate > new Date(labels[4][1] && completeDate < new Date(labels[5][1]))) {
              r[3]++;
            } else if (completeDate > new Date(labels[5][1] && completeDate < new Date(labels[6][1]))) {
              r[2]++;
            } else if (completeDate > new Date(labels[6][1] && completeDate < new Date(labels[7][1]))) {
              r[1]++;
            } else if (completeDate > new Date(labels[7][1])) {
              r[0]++;
            }
          });
          setData(r);
        }
      })
      .catch(err => console.error('ERROR:', err));
  }, [accessToken, labels]);

  const options = {
    maintainAspectRatio: false,
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
    }]
  };

  return (
    <div className="body-container has-text-centered">
      <h4 className="is-size-2 my-4 center">Progress</h4>
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
