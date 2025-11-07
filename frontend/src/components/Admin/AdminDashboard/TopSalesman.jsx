import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesmen = [
  { name: "Ravi", sales: 120 },
  { name: "Mehak", sales: 200 },
  { name: "Aman", sales: 150 },
  { name: "Priya", sales: 180 },
  { name: "Karan", sales: 90 },
];

const TopSalesman = () => {
  return (
    <div className="rounded-lg lg:p-5 md:p-5 sm:p-5 p-3 bg-white dark:bg-gray-900 shadow hover:shadow-md transition-all">
      <h1 className="lg:text-xl md:text-xl text-sm font-semibold mb-4 dark:text-gray-300">
        Top Salesman Performance
      </h1>
      <div
        className="flex flex-col items-center justify-center w-full h-52 sm:h-52 sm:w-full md:h-80 md:w-full lg:w-full lg:h-80"
        tabIndex={-1}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={570} height={300} data={salesmen}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopSalesman;
