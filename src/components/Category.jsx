import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { categoryDistribution, getColor } from "../utils/dataUtils";
import { useState, useEffect } from "react";

const Category = ({ questions }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!questions || questions.length === 0) {
    return (
      <div className="card-base">
        <h2 className="heading-lg text-secondary-800 mb-4">
          Questions by category
        </h2>
        <p className="text-body text-secondary-500">
          No questions available.
        </p>
      </div>
    )
  };
  const data = categoryDistribution(questions);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.count / questions.length) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-secondary-200 rounded-custom shadow-custom">
          <p className="font-semibold mb-1 text-sm text-secondary-800">{data.name}</p>
          <p className="text-secondary-600 text-sm mt-0.5">Questions: {data.count}</p>
          <p className="text-secondary-600 text-sm mt-0.5">Percentage: {percent}%</p>
        </div>
      );
    }
    return null;
  };

  const handleMouseEnter = (_, index) => setActiveItem(index);
  const handleMouseLeave = () => setActiveItem(null);

  return (
    <div className="card-base">
      <h2 className="heading-lg text-secondary-800 mb-4">
        Questions by category
      </h2>

      <div className="h-80 md:h-96 lg:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius="80%"
              innerRadius={0}
              dataKey="count"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(index)}
                  fillOpacity={activeItem === null ? 1 : activeItem === index ? 1 : 0.3}
                  stroke="#fff"
                  strokeWidth={2}
                ></Cell>
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="top"
              align="left"
              height={100}
              width={200}
              iconType="circle"
              wrapperStyle={{
                fontSize: "0.875rem",
                textAlign: "left",
                lineHeight: "1.5rem",
                paddingRight: 8,
                height: "100%",
                overflowY: "scroll",
                display: isMobile ? "none" : "inline-block",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  )
}

export default Category;