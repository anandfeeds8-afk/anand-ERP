import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RateChart = () => {
  const data = [
    { date: "01 Jul", rate: 120 },
    { date: "05 Jul", rate: 135 },
    { date: "10 Jul", rate: 110 },
    { date: "15 Jul", rate: 145 },
    { date: "20 Jul", rate: 150 },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg lg:p-5 md:p-5 sm:p-5 p-3 shadow hover:shadow-md transition-all">
      <h1 className="lg:text-xl md:text-xl text-sm font-semibold mb-4 dark:text-gray-300">
        Rate Chart
      </h1>
      <div
        className="flex flex-col items-center justify-center w-full h-52 md:h-80 sm:h-52 sm:w-full md md:w-full lg:w-full lg:h-80"
        tabIndex={-1}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RateChart;
