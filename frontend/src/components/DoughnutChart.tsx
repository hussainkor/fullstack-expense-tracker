import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./Title";

const COLORS = ["#0088FE", "#FF8828", "#FF8042", "#00C49F"];

type DoughnutType = {
  dt: any;
};

export default function DoughnutChart({ dt }: DoughnutType) {
  const data = [
    { name: "Income", value: Number(dt.totalIncome) },
    { name: "Expense", value: Number(dt.totalExpense) },
  ];
  return (
    <div className="w-full md:w-1/3 flex flex-col items-center">
      <Title title="Summary" />
      <PieChart width={500} height={400}>
        <Pie
          data={data}
          cx={230}
          cy={150}
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
