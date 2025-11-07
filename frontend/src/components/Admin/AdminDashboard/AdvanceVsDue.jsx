import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdvanceVsDue = () => {
  const data = [
    { name: "Week 1", advance: 4000, due: 2400 },
    { name: "Week 2", advance: 3000, due: 1398 },
    { name: "Week 3", advance: 2000, due: 980 },
    { name: "Week 4", advance: 2780, due: 3908 },
  ];

  return (
    <div className="rounded-lg lg:p-5 md:p-5 sm:p-5 p-3 bg-white dark:bg-gray-900 shadow hover:shadow-md transition-all w-full">
      <h1 className="lg:text-xl md:text-xl text-sm font-semibold mb-4 dark:text-gray-300">
        Advance vs Due
      </h1>
      <div
        className="flex flex-col items-center justify-center w-full h-52 md:h-80 sm:h-52 sm:w-full md:w-full lg:w-full lg:h-80"
        tabIndex={-1}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width="100%" height="100%" data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="advance" fill="#4CAF50" />
            <Bar dataKey="due" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdvanceVsDue;
