"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { CardProps } from "@heroui/react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import { Card, cn, Divider } from "@heroui/react";
import { TitleAnimation } from "../ui/titles/titleAnimation";

type ChartData = {
  name: string;
  value: number;
  color: string;
};

type CircleChartProps = {
  title: string;
  categories: string[];
  chartData: ChartData[];
};

const data: CircleChartProps[] = [
  {
    title: "FullStack",
    categories: ["Frontend", "Backend"],
    chartData: [
      { name: "Frontend", value: 75, color: "primary-500" },
      { name: "Backend", value: 25, color: "primary-600" },
    ],
  },
  {
    title: "Lenguajes",
    categories: ["Typescript", "Python"],
    chartData: [
      { name: "Typescript", value: 90, color: "primary-300" },
      { name: "Python", value: 10, color: "primary-400" },
    ],
  },
  {
    title: "Frameworks",
    categories: ["Nextjs", "Nestjs", "Django"],
    chartData: [
      { name: "Nextjs", value: 70, color: "primary-50" },
      { name: "Nestjs", value: 20, color: "primary-100" },
      { name: "Django", value: 10, color: "primary-200" },
    ],
  },
];

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.001;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const Chart = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="w-full max-w-7xl mx-auto px-7">
      <div
        onClick={handleToggle}
        className={cn(
          "relative transition-all duration-300 ease-in-out cursor-pointer",
          isOpen
            ? "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4"
            : "grid grid-cols-1"
        )}
        style={{ minHeight: isOpen ? undefined : 250 }}
      >
        {data.map((item, index) => {
          const stackOffsetY = 12;
          const closedTransform = {
            x: 0,
            y: index * stackOffsetY,
          };

          const closedStyle = {
            gridArea: "1 / 1 / 2 / 2",
            zIndex: data.length - index,
            position: "relative" as const,
          };

          return (
            <motion.div
              key={item.title}
              layout
              initial={false}
              style={isOpen ? undefined : closedStyle}
              animate={isOpen ? { x: 0, y: 0 } : closedTransform}
              whileHover={{ scale: 1.03, zIndex: 9999 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 20,
                mass: 0.6,
                delay: index * 0.1,
              }}
              className={cn(
                "w-full relative",
                isOpen ? "max-w-full" : "max-w-[350px] lg:max-w-[250px]"
              )}
            >
              <CircleChartCard {...item} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const formatTotal = (total: number) => {
  return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

const CircleChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, "children"> & CircleChartProps
>(({ className, title, categories, chartData, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        ` w-full
          h-full
          min-h-[240px]
          md:min-h-[300px]
          transition-all
          duration-500
          border border-default-200 dark:border-default-100`,
        className
      )}
      {...props}
    >
      <div className="flex flex-col ">
        <div className="flex items-center justify-center gap-x-2">
          <dt>
            <TitleAnimation title={title} className="text-2xl" />
          </dt>
        </div>
      </div>
      <Divider />
      <div className="flex h-full flex-wrap items-center justify-center gap-x-2 lg:flex-nowrap">
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none"
          height={200}
          width="100%"
        >
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              content={({ label, payload }) => (
                <div className="flex h-8 min-w-[120px] items-center gap-x-2 rounded-medium bg-background-foreground px-1 text-tiny shadow-small">
                  <span className="font-medium text-foreground">{label}</span>
                  {payload?.map((p, index) => {
                    const name = p.name;
                    const value = p.value;
                    const category =
                      categories.find((c) => c.toLowerCase() === name) ?? name;
                    return (
                      <div
                        key={`${index}-${name}`}
                        className="flex w-full items-center gap-x-2"
                      >
                        <div
                          className="h-2 w-2 flex-none rounded-full"
                          style={{
                            backgroundColor: `hsl(var(--heroui-${
                              chartData.find((data) => data.name === category)
                                ?.color ?? "default"
                            }))`,
                          }}
                        />
                        <div className="flex w-full items-center justify-between gap-x-2 pr-1 text-xs text-default-700">
                          <span className="text-default-500">{category}</span>
                          <span className="font-mono font-medium text-default-700">
                            {formatTotal(value as number)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              cursor={false}
            />
            <Pie
              animationDuration={1000}
              animationEasing="ease"
              data={chartData}
              dataKey="value"
              innerRadius="48%"
              nameKey="name"
              paddingAngle={-20}
              strokeWidth={0}
              labelLine
              label={renderCustomizedLabel}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--heroui-${_.color}))`}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex  flex-row md:flex-col justify-center gap-4 p-4 text-tiny text-default-500 lg:p-0">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-full"
                style={{
                  backgroundColor: `hsl(var(--heroui-${
                    chartData.find((data) => data.name === category)?.color ??
                    "default"
                  }))`,
                }}
              />
              <span className="font-bold capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
});

CircleChartCard.displayName = "CircleChartCard";
