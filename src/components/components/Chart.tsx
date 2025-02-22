'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CardProps } from '@heroui/react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Card, cn, Divider } from '@heroui/react';
import { TitleAnimation } from '../ui/titles/titleAnimation';

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
    title: 'FullStack',
    categories: ['Frontend', 'Backend'],
    chartData: [
      { name: 'Frontend', value: 75, color: 'primary-500' },
      { name: 'Backend', value: 25, color: 'primary-600' },
    ],
  },
  {
    title: 'Lenguajes',
    categories: ['Typescript', 'Python'],
    chartData: [
      { name: 'Typescript', value: 90, color: 'primary-300' },
      { name: 'Python', value: 10, color: 'primary-400' },
    ],
  },
  {
    title: 'Frameworks',
    categories: ['Nextjs', 'Nestjs', 'Django'],
    chartData: [
      { name: 'Nextjs', value: 70, color: 'primary-50' },
      { name: 'Nestjs', value: 20, color: 'primary-100' },
      { name: 'Django', value: 10, color: 'primary-200' },
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
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      className='font-bold'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const Chart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const closedOffsets = { marginLeft: -9, marginTop: 10 };
  const openOffsets = { marginLeft: 325, marginTop: 325 };

  const containerClass = 'grid';

  return (
    <div onClick={handleToggle} className={`${containerClass} cursor-pointer`}>
      {data.map((item, index) => (
        <motion.div
          key={index}
          layout
          initial={{ marginLeft: 0, marginTop: 0 }}
          animate={
            isMobile
              ? {
                  marginTop: isOpen
                    ? index * openOffsets.marginTop
                    : index * 10,
                }
              : {
                  marginLeft: isOpen
                    ? index * openOffsets.marginLeft
                    : index * closedOffsets.marginLeft,
                }
          }
          whileHover={{
            scale: 1.05,
            zIndex: 10,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: index * 0.1,
          }}
          style={{ gridArea: '1 / 1 / 2 / 2' }}
          className='w-72 h-80'
        >
          <CircleChartCard {...item} />
        </motion.div>
      ))}
    </div>
  );
};

const formatTotal = (total: number) => {
  return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

const CircleChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & CircleChartProps
>(({ className, title, categories, chartData, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        'min-h-[240px] border border-default-200 dark:border-default-100',
        className
      )}
      {...props}
    >
      <div className='flex flex-col my-3'>
        <div className='flex items-center justify-center gap-x-2'>
          <dt>
            <TitleAnimation title={title} className='text-2xl' />
          </dt>
        </div>
      </div>
      <Divider />
      <div className='flex h-full flex-wrap items-center justify-center gap-x-2 lg:flex-nowrap'>
        <ResponsiveContainer
          className='[&_.recharts-surface]:outline-none'
          height={200}
          width='100%'
        >
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              content={({ label, payload }) => (
                <div className='flex h-8 min-w-[120px] items-center gap-x-2 rounded-medium bg-background-foreground px-1 text-tiny shadow-small'>
                  <span className='font-medium text-foreground'>{label}</span>
                  {payload?.map((p, index) => {
                    const name = p.name;
                    const value = p.value;
                    const category =
                      categories.find((c) => c.toLowerCase() === name) ?? name;
                    return (
                      <div
                        key={`${index}-${name}`}
                        className='flex w-full items-center gap-x-2'
                      >
                        <div
                          className='h-2 w-2 flex-none rounded-full'
                          style={{
                            backgroundColor: `hsl(var(--heroui-${
                              chartData.find((data) => data.name === category)
                                ?.color ?? 'default'
                            }))`,
                          }}
                        />
                        <div className='flex w-full items-center justify-between gap-x-2 pr-1 text-xs text-default-700'>
                          <span className='text-default-500'>{category}</span>
                          <span className='font-mono font-medium text-default-700'>
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
              animationEasing='ease'
              data={chartData}
              dataKey='value'
              innerRadius='48%'
              nameKey='name'
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
        <div className='flex w-1/3 sm:flex-row md:flex-col justify-center gap-4 p-4 text-tiny text-default-500 lg:p-0'>
          {categories.map((category, index) => (
            <div key={index} className='flex items-center gap-2'>
              <span
                className='h-5 w-5 rounded-full'
                style={{
                  backgroundColor: `hsl(var(--heroui-${
                    chartData.find((data) => data.name === category)?.color ??
                    'default'
                  }))`,
                }}
              />
              <span className='font-bold capitalize'>{category}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
});

CircleChartCard.displayName = 'CircleChartCard';
