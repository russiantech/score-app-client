// v3
// Simple, Clear Performance Charts
// src/components/charts/PerformanceCharts.tsx

import type { CoursePerformance } from '@/types/performance';
import React from 'react';
// import type { CoursePerformance } from '@/hooks/usePerformance';

// ============================================================================
// PERFORMANCE BAR CHART
// ============================================================================

interface PerformanceChartProps {
  data: CoursePerformance[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="fa fa-chart-bar fa-3x mb-3" />
        <p>No performance data available</p>
      </div>
    );
  }
  
  return (
    <div className="performance-chart">
      {data.map((course, idx) => {
        const percentage = course.overall_average;
        const color = percentage >= 80 ? '#28a745' : 
                     percentage >= 70 ? '#007bff' : 
                     percentage >= 60 ? '#17a2b8' : 
                     percentage >= 50 ? '#ffc107' : '#dc3545';
        
        return (
          <div key={idx} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="d-flex flex-column">
                <span className="fw-semibold small">{course.course.code}</span>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {course.course.title}
                </small>
              </div>
              <span className="badge" style={{ backgroundColor: color }}>
                {percentage}%
              </span>
            </div>
            <div className="progress" style={{ height: '20px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color
                }}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="small fw-semibold">{course.overall_grade}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// GRADE DISTRIBUTION PIE CHART
// ============================================================================

interface GradeDistributionChartProps {
  data: { [key: string]: number };
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-5 text-muted">
        <p>No grade distribution data</p>
      </div>
    );
  }

  const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
  const colors: { [key: string]: string } = {
    'A+': '#28a745',
    'A': '#20c997',
    'B+': '#007bff',
    'B': '#17a2b8',
    'C+': '#6610f2',
    'C': '#6c757d',
    'D+': '#fd7e14',
    'D': '#ffc107',
    'F': '#dc3545'
  };

  const totalGrades = Object.values(data).reduce((sum, count) => sum + count, 0);

  return (
    <div className="grade-distribution">
      {totalGrades === 0 ? (
        <div className="text-center py-4 text-muted">
          <p>No grades recorded yet</p>
        </div>
      ) : (
        <>
          {/* Visual Distribution Bars */}
          <div className="mb-3">
            {grades.map(grade => {
              const count = data[grade] || 0;
              const percentage = totalGrades > 0 ? (count / totalGrades) * 100 : 0;
              
              if (count === 0) return null;
              
              return (
                <div key={grade} className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-semibold">{grade}</span>
                    <span className="badge" style={{ backgroundColor: colors[grade] }}>
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="progress" style={{ height: '12px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[grade]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
            {grades.map(grade => {
              const count = data[grade] || 0;
              if (count === 0) return null;
              
              return (
                <div key={grade} className="d-flex align-items-center gap-1">
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: colors[grade],
                      borderRadius: '2px'
                    }}
                  />
                  <small className="text-muted">{grade}</small>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// PERFORMANCE TREND LINE CHART
// ============================================================================

interface TrendChartProps {
  data: Array<{ month: string; average: number }>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="fa fa-line-chart fa-3x mb-3" />
        <p>Not enough data for trend analysis</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.average), 100);
  const minValue = Math.min(...data.map(d => d.average), 0);
  const range = maxValue - minValue || 100;

  // Create chart points
  const chartHeight = 200;
  const chartWidth = 100; // percentage
  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((item.average - minValue) / range) * chartHeight;
    return { x, y, value: item.average };
  });

  // Create SVG path
  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}`
  ).join(' ');

  return (
    <div className="trend-chart">
      {/* Chart */}
      <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '20px' }}>
        <svg
          width="100%"
          height={chartHeight}
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
                  x2="100%"
                  y2={y}
                  stroke="#e9ecef"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text
                  x="5"
                  y={y - 5}
                  fill="#6c757d"
                  fontSize="10"
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
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={`${point.x}%`}
                cy={point.y}
                r="5"
                fill="#007bff"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={`${point.x}%`}
                y={point.y - 10}
                fill="#495057"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {point.value.toFixed(1)}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Month labels */}
      <div className="d-flex justify-content-between px-2">
        {data.map((item, idx) => (
          <small key={idx} className="text-muted text-center" style={{ flex: 1 }}>
            {item.month}
          </small>
        ))}
      </div>

      {/* Summary */}
      <div className="row g-2 mt-3">
        <div className="col-4">
          <div className="text-center p-2 bg-light rounded">
            <small className="text-muted d-block">Average</small>
            <span className="fw-semibold">
              {(data.reduce((sum, d) => sum + d.average, 0) / data.length).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="col-4">
          <div className="text-center p-2 bg-light rounded">
            <small className="text-muted d-block">Highest</small>
            <span className="fw-semibold text-success">
              {Math.max(...data.map(d => d.average)).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="col-4">
          <div className="text-center p-2 bg-light rounded">
            <small className="text-muted d-block">Lowest</small>
            <span className="fw-semibold text-danger">
              {Math.min(...data.map(d => d.average)).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  PerformanceChart,
  GradeDistributionChart,
  TrendChart
};
