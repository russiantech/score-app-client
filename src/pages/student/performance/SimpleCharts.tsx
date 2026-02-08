// Simple Chart Components - Easy to understand
// src/pages/student/performance/SimpleCharts.tsx

import type { CoursePerformance, PerformanceTrend } from '@/types/performance';
import React from 'react';
// import type { CoursePerformance, PerformanceTrend } from '@/hooks/usePerformance';

// ============================================================================
// SIMPLE BAR CHART
// ============================================================================

interface SimpleBarChartProps {
  courses: CoursePerformance[];
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="fa fa-chart-bar fa-3x mb-3" />
        <p>No course data available</p>
      </div>
    );
  }

  const getColor = (percentage: number): string => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 70) return '#007bff';
    if (percentage >= 60) return '#17a2b8';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'D+';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="simple-bar-chart">
      {courses.map((course, idx) => {
        const percentage = course.overall_average;
        const color = getColor(percentage);
        const grade = getGrade(percentage);
        
        return (
          <div key={idx} className="mb-4">
            {/* Course Info */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="fw-semibold">{course.course.code}</div>
                <small className="text-muted d-none d-md-block">{course.course.title}</small>
              </div>
              <div className="text-end">
                <span className="badge" style={{ backgroundColor: color }}>
                  {percentage}%
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="progress" style={{ height: '15px' }}>
              <div
                className="progress-bar d-flex align-items-center justify-content-center"
                role="progressbar"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {percentage > 15 && grade}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// SIMPLE TREND CHART
// ============================================================================

interface SimpleTrendChartProps {
  data: PerformanceTrend[];
}

export const SimpleTrendChart: React.FC<SimpleTrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="fa fa-line-chart fa-3x mb-3" />
        <p>Not enough data for trend analysis</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.average), 100);
  const chartHeight = 200;
  
  // Calculate points
  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = chartHeight - ((item.average / maxValue) * chartHeight);
    return { x, y, value: item.average };
  });

  // Create path
  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  return (
    <div className="simple-trend-chart">
      {/* Chart */}
      <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '20px' }}>
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 100 ${chartHeight}`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => {
            const y = chartHeight - (percent / 100) * chartHeight;
            return (
              <g key={percent}>
                <line
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="#e9ecef"
                  strokeWidth="0.2"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x="2"
                  y={y - 3}
                  fill="#6c757d"
                  fontSize="8"
                  vectorEffect="non-scaling-stroke"
                >
                  {percent}%
                </text>
              </g>
            );
          })}

          {/* Trend line */}
          <path
            d={pathData}
            fill="none"
            stroke="#007bff"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {points.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill="#007bff"
                stroke="white"
                strokeWidth="0.3"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Month labels */}
      <div className="d-flex justify-content-between px-2 mb-3">
        {data.map((item, idx) => (
          <div key={idx} className="text-center" style={{ flex: 1 }}>
            <small className="text-muted d-block">{item.month}</small>
            <small className="fw-bold text-primary">{item.average.toFixed(1)}%</small>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="row g-2">
        <div className="col-4">
          <div className="text-center p-3 bg-light rounded">
            <small className="text-muted d-block mb-1">Average</small>
            <div className="fw-bold">
              {(data.reduce((sum, d) => sum + d.average, 0) / data.length).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="text-center p-3 bg-light rounded">
            <small className="text-muted d-block mb-1">Highest</small>
            <div className="fw-bold text-success">
              {Math.max(...data.map(d => d.average)).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="text-center p-3 bg-light rounded">
            <small className="text-muted d-block mb-1">Lowest</small>
            <div className="fw-bold text-danger">
              {Math.min(...data.map(d => d.average)).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  SimpleBarChart,
  SimpleTrendChart
};
