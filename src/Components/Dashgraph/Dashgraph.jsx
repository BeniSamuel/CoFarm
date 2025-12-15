import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashgraph = () => {
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const intervalRef = useRef(null);

  // Sample data - in production, this would come from API
  const graphTypes = [
    {
      title: "Livestock Growth",
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Cattle",
            data: [12, 15, 18, 20, 22, 25],
            borderColor: "#184B05",
            backgroundColor: "rgba(24, 75, 5, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Goats",
            data: [8, 10, 12, 14, 16, 18],
            borderColor: "#49881F",
            backgroundColor: "rgba(73, 136, 31, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Chickens",
            data: [50, 55, 60, 65, 70, 75],
            borderColor: "#459438",
            backgroundColor: "rgba(69, 148, 56, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
    },
    {
      title: "Revenue & Income",
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue ($)",
            data: [5000, 6000, 5500, 7000, 8000, 9000],
            backgroundColor: "#83DF75",
            borderColor: "#184B05",
            borderWidth: 2,
          },
          {
            label: "Income ($)",
            data: [4500, 5500, 5000, 6500, 7500, 8500],
            backgroundColor: "#49881F",
            borderColor: "#184B05",
            borderWidth: 2,
          },
        ],
      },
    },
    {
      title: "Crops Production",
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Wheat (kg)",
            data: [1200, 1500, 1800, 2000, 2200, 2500],
            borderColor: "#184B05",
            backgroundColor: "rgba(24, 75, 5, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Corn (kg)",
            data: [800, 1000, 1200, 1400, 1600, 1800],
            borderColor: "#49881F",
            backgroundColor: "rgba(73, 136, 31, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Rice (kg)",
            data: [600, 750, 900, 1050, 1200, 1350],
            borderColor: "#459438",
            backgroundColor: "rgba(69, 148, 56, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
    },
  ];

  // Auto-rotate graphs every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentGraphIndex((prev) => (prev + 1) % graphTypes.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentGraph = graphTypes[currentGraphIndex];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Poppins",
            size: 12,
          },
          color: "#184B05",
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: "Poppins",
          },
          color: "#49881F",
        },
        grid: {
          color: "rgba(131, 223, 117, 0.2)",
        },
      },
      x: {
        ticks: {
          font: {
            family: "Poppins",
          },
          color: "#49881F",
        },
        grid: {
          color: "rgba(131, 223, 117, 0.2)",
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="text-sm md:text-base font-semibold text-[#184B05]">
          {currentGraph.title}
        </div>
        <div className="flex gap-2">
          {graphTypes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentGraphIndex(index);
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
                intervalRef.current = setInterval(() => {
                  setCurrentGraphIndex(
                    (prev) => (prev + 1) % graphTypes.length
                  );
                }, 5000);
              }}
              className={`h-2 w-2 rounded-full transition-all ${
                currentGraphIndex === index
                  ? "bg-[#184B05] w-8"
                  : "bg-[#83DF75]"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="bg-[#c2f0bb] h-64 md:h-80 rounded-lg p-4 shadow-md">
        {currentGraph.type === "line" ? (
          <Line data={currentGraph.data} options={chartOptions} />
        ) : (
          <Bar data={currentGraph.data} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default Dashgraph;
