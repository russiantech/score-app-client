// // Performance Chart Components using Chart.js
// // src/components/charts/PerformanceChart.tsx

// import { useEffect, useRef } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// //   ChartOptions
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // ============================================================================
// // Performance Trend Chart (Bar Chart)
// // ============================================================================

// interface PerformanceChartProps {
//   data: any[];
// }

// export const PerformanceChart = ({ data }: PerformanceChartProps) => {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstance = useRef<ChartJS | null>(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     // Destroy previous chart
//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     const ctx = chartRef.current.getContext('2d');
//     if (!ctx) return;

//     const labels = data.map(d => d.course.code);
//     const scores = data.map(d => d.overall_average);

//     chartInstance.current = new ChartJS(ctx, {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [
//           {
//             label: 'Overall Score',
//             data: scores,
//             backgroundColor: scores.map(score => {
//               if (score >= 90) return 'rgba(40, 167, 69, 0.8)';
//               if (score >= 80) return 'rgba(0, 123, 255, 0.8)';
//               if (score >= 70) return 'rgba(23, 162, 184, 0.8)';
//               if (score >= 60) return 'rgba(255, 193, 7, 0.8)';
//               return 'rgba(220, 53, 69, 0.8)';
//             }),
//             borderColor: scores.map(score => {
//               if (score >= 90) return 'rgb(40, 167, 69)';
//               if (score >= 80) return 'rgb(0, 123, 255)';
//               if (score >= 70) return 'rgb(23, 162, 184)';
//               if (score >= 60) return 'rgb(255, 193, 7)';
//               return 'rgb(220, 53, 69)';
//             }),
//             borderWidth: 2,
//             borderRadius: 8
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             callbacks: {
//               label: (context) => {
//                 return `Score: ${context.parsed.y.toFixed(1)}%`;
//               }
//             }
//           }
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             max: 100,
//             ticks: {
//               callback: (value) => `${value}%`
//             },
//             grid: {
//               color: 'rgba(0, 0, 0, 0.05)'
//             }
//           },
//           x: {
//             grid: {
//               display: false
//             }
//           }
//         }
//       }
//     });

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [data]);

//   return (
//     <div style={{ height: '300px', position: 'relative' }}>
//       <canvas ref={chartRef} />
//     </div>
//   );
// };


// // ============================================================================
// // Grade Distribution Chart (Doughnut Chart)
// // ============================================================================

// export const GradeDistributionChart = ({ data }: PerformanceChartProps) => {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstance = useRef<ChartJS | null>(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     const ctx = chartRef.current.getContext('2d');
//     if (!ctx) return;

//     // Count grades
//     const gradeCounts: Record<string, number> = {};
//     data.forEach(d => {
//       const grade = d.overall_grade.charAt(0); // Get letter only
//       gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
//     });

//     const gradeOrder = ['A', 'B', 'C', 'D', 'F'];
//     const labels = gradeOrder.filter(g => gradeCounts[g] > 0);
//     const counts = labels.map(g => gradeCounts[g]);

//     const colors = {
//       'A': 'rgba(40, 167, 69, 0.8)',
//       'B': 'rgba(0, 123, 255, 0.8)',
//       'C': 'rgba(23, 162, 184, 0.8)',
//       'D': 'rgba(255, 193, 7, 0.8)',
//       'F': 'rgba(220, 53, 69, 0.8)'
//     };

//     chartInstance.current = new ChartJS(ctx, {
//       type: 'doughnut',
//       data: {
//         labels,
//         datasets: [
//           {
//             data: counts,
//             backgroundColor: labels.map(l => colors[l as keyof typeof colors]),
//             borderWidth: 2,
//             borderColor: '#fff'
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'bottom',
//             labels: {
//               padding: 15,
//               font: {
//                 size: 12
//               }
//             }
//           },
//           tooltip: {
//             callbacks: {
//               label: (context) => {
//                 const total = counts.reduce((sum, c) => sum + c, 0);
//                 const percentage = ((context.parsed / total) * 100).toFixed(1);
//                 return `${context.label}: ${context.parsed} (${percentage}%)`;
//               }
//             }
//           }
//         }
//       }
//     });

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [data]);

//   return (
//     <div style={{ height: '280px', position: 'relative' }}>
//       <canvas ref={chartRef} />
//     </div>
//   );
// };


// // ============================================================================
// // Attendance Trend Chart (Line Chart)
// // ============================================================================

// interface AttendanceTrendProps {
//   data: {
//     dates: string[];
//     attendance_rates: number[];
//   };
// }

// export const AttendanceTrendChart = ({ data }: AttendanceTrendProps) => {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstance = useRef<ChartJS | null>(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     const ctx = chartRef.current.getContext('2d');
//     if (!ctx) return;

//     chartInstance.current = new ChartJS(ctx, {
//       type: 'line',
//       data: {
//         labels: data.dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
//         datasets: [
//           {
//             label: 'Attendance Rate',
//             data: data.attendance_rates,
//             fill: true,
//             backgroundColor: 'rgba(23, 162, 184, 0.1)',
//             borderColor: 'rgb(23, 162, 184)',
//             borderWidth: 2,
//             tension: 0.4,
//             pointBackgroundColor: 'rgb(23, 162, 184)',
//             pointBorderColor: '#fff',
//             pointBorderWidth: 2,
//             pointRadius: 4,
//             pointHoverRadius: 6
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             callbacks: {
//               label: (context) => `Attendance: ${context.parsed.y.toFixed(1)}%`
//             }
//           }
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             max: 100,
//             ticks: {
//               callback: (value) => `${value}%`
//             },
//             grid: {
//               color: 'rgba(0, 0, 0, 0.05)'
//             }
//           },
//           x: {
//             grid: {
//               display: false
//             }
//           }
//         }
//       }
//     });

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [data]);

//   return (
//     <div style={{ height: '250px', position: 'relative' }}>
//       <canvas ref={chartRef} />
//     </div>
//   );
// };


// // ============================================================================
// // Score Comparison Chart (Multi-bar chart for different assessment types)
// // ============================================================================

// interface ScoreComparisonProps {
//   data: {
//     homework: number[];
//     classwork: number[];
//     quiz: number[];
//     labels: string[]; // Lesson names
//   };
// }

// export const ScoreComparisonChart = ({ data }: ScoreComparisonProps) => {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstance = useRef<ChartJS | null>(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     const ctx = chartRef.current.getContext('2d');
//     if (!ctx) return;

//     chartInstance.current = new ChartJS(ctx, {
//       type: 'bar',
//       data: {
//         labels: data.labels,
//         datasets: [
//           {
//             label: 'Homework',
//             data: data.homework,
//             backgroundColor: 'rgba(0, 123, 255, 0.8)',
//             borderColor: 'rgb(0, 123, 255)',
//             borderWidth: 1,
//             borderRadius: 4
//           },
//           {
//             label: 'Classwork',
//             data: data.classwork,
//             backgroundColor: 'rgba(23, 162, 184, 0.8)',
//             borderColor: 'rgb(23, 162, 184)',
//             borderWidth: 1,
//             borderRadius: 4
//           },
//           {
//             label: 'Quiz',
//             data: data.quiz,
//             backgroundColor: 'rgba(255, 193, 7, 0.8)',
//             borderColor: 'rgb(255, 193, 7)',
//             borderWidth: 1,
//             borderRadius: 4
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'top',
//             labels: {
//               padding: 15,
//               usePointStyle: true
//             }
//           },
//           tooltip: {
//             callbacks: {
//               label: (context) => {
//                 return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
//               }
//             }
//           }
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             max: 100,
//             ticks: {
//               callback: (value) => `${value}%`
//             },
//             grid: {
//               color: 'rgba(0, 0, 0, 0.05)'
//             }
//           },
//           x: {
//             grid: {
//               display: false
//             }
//           }
//         }
//       }
//     });

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [data]);

//   return (
//     <div style={{ height: '350px', position: 'relative' }}>
//       <canvas ref={chartRef} />
//     </div>
//   );
// };
// export default PerformanceChart;




// // v2
// // src/components/charts/PerformanceCharts.tsx
// /**
//  * Modern chart components for performance visualization
//  * Using Recharts library for responsive, interactive charts
//  */

// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';
// import type { CoursePerformance, PerformanceTrend } from '@/hooks/usePerformance';

// // Chart color palette
// const COLORS = {
//   primary: '#0d6efd',
//   success: '#198754',
//   info: '#0dcaf0',
//   warning: '#ffc107',
//   danger: '#dc3545',
//   secondary: '#6c757d'
// };

// const GRADE_COLORS = {
//   A: COLORS.success,
//   B: COLORS.primary,
//   C: COLORS.info,
//   D: COLORS.warning,
//   F: COLORS.danger
// };

// // ============================================================================
// // PERFORMANCE TREND CHART (Line Chart)
// // ============================================================================

// interface PerformanceChartProps {
//   data: CoursePerformance[];
// }

// export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
//   // Transform data for chart
//   const chartData = data.map(course => ({
//     name: course.course.code,
//     score: course.overall_average,
//     assessments: course.total_assessments
//   }));

//   if (chartData.length === 0) {
//     return (
//       <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
//         <p className="text-muted">No performance data available</p>
//       </div>
//     );
//   }

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <BarChart data={chartData}>
//         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//         <XAxis 
//           dataKey="name" 
//           tick={{ fontSize: 12 }}
//           stroke="#6c757d"
//         />
//         <YAxis 
//           domain={[0, 100]}
//           tick={{ fontSize: 12 }}
//           stroke="#6c757d"
//         />
//         <Tooltip
//           contentStyle={{
//             backgroundColor: '#fff',
//             border: '1px solid #dee2e6',
//             borderRadius: '8px',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//           }}
//           formatter={(value: number) => [`${value}%`, 'Score']}
//         />
//         <Legend />
//         <Bar 
//           dataKey="score" 
//           fill={COLORS.primary}
//           radius={[8, 8, 0, 0]}
//           name="Average Score"
//         />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// // ============================================================================
// // GRADE DISTRIBUTION CHART (Pie Chart)
// // ============================================================================

// interface GradeDistributionChartProps {
//   data: CoursePerformance[];
// }

// export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({ data }) => {
//   // Count grades
//   const gradeCount: Record<string, number> = {
//     A: 0,
//     B: 0,
//     C: 0,
//     D: 0,
//     F: 0
//   };

//   data.forEach(course => {
//     const grade = course.overall_grade;
//     if (grade in gradeCount) {
//       gradeCount[grade]++;
//     }
//   });

//   // Transform to chart data (filter out zeros)
//   const chartData = Object.entries(gradeCount)
//     .filter(([_, count]) => count > 0)
//     .map(([grade, count]) => ({
//       name: `Grade ${grade}`,
//       value: count,
//       grade
//     }));

//   if (chartData.length === 0) {
//     return (
//       <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
//         <p className="text-muted">No grade data available</p>
//       </div>
//     );
//   }

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <PieChart>
//         <Pie
//           data={chartData}
//           cx="50%"
//           cy="50%"
//           labelLine={false}
//           label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
//           outerRadius={80}
//           fill="#8884d8"
//           dataKey="value"
//         >
//           {chartData.map((entry, index) => (
//             <Cell 
//               key={`cell-${index}`} 
//               fill={GRADE_COLORS[entry.grade as keyof typeof GRADE_COLORS] || COLORS.secondary} 
//             />
//           ))}
//         </Pie>
//         <Tooltip 
//           contentStyle={{
//             backgroundColor: '#fff',
//             border: '1px solid #dee2e6',
//             borderRadius: '8px',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//           }}
//         />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// // ============================================================================
// // PERFORMANCE TREND OVER TIME (Line Chart)
// // ============================================================================

// interface TrendChartProps {
//   data: PerformanceTrend[];
// }

// export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
//   if (data.length === 0) {
//     return (
//       <div className="d-flex align-items-center justify-content-center" style={{ height: 250 }}>
//         <p className="text-muted">No trend data available</p>
//       </div>
//     );
//   }

//   return (
//     <ResponsiveContainer width="100%" height={250}>
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//         <XAxis 
//           dataKey="month" 
//           tick={{ fontSize: 11 }}
//           stroke="#6c757d"
//           angle={-45}
//           textAnchor="end"
//           height={80}
//         />
//         <YAxis 
//           domain={[0, 100]}
//           tick={{ fontSize: 12 }}
//           stroke="#6c757d"
//         />
//         <Tooltip
//           contentStyle={{
//             backgroundColor: '#fff',
//             border: '1px solid #dee2e6',
//             borderRadius: '8px',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//           }}
//           formatter={(value?: number) => [`${(value ?? 0).toFixed(1)}%`, 'Average']}
//         />
//         <Legend />
//         <Line 
//           type="monotone" 
//           dataKey="average" 
//           stroke={COLORS.primary}
//           strokeWidth={2}
//           dot={{ fill: COLORS.primary, r: 4 }}
//           activeDot={{ r: 6 }}
//           name="Performance"
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// // ============================================================================
// // ASSESSMENT BREAKDOWN CHART (Stacked Bar)
// // ============================================================================

// interface AssessmentBreakdownProps {
//   course: CoursePerformance;
// }

// export const AssessmentBreakdownChart: React.FC<AssessmentBreakdownProps> = ({ course }) => {
//   const chartData = [
//     {
//       name: 'Lessons',
//       count: course.lesson_scores.length,
//       avg: course.lesson_scores.length > 0
//         ? course.lesson_scores.reduce((sum, s) => sum + s.percentage, 0) / course.lesson_scores.length
//         : 0
//     },
//     {
//       name: 'Modules',
//       count: course.module_scores.length,
//       avg: course.module_scores.length > 0
//         ? course.module_scores.reduce((sum, s) => sum + s.percentage, 0) / course.module_scores.length
//         : 0
//     },
//     {
//       name: 'Projects',
//       count: course.course_scores.length,
//       avg: course.course_scores.length > 0
//         ? course.course_scores.reduce((sum, s) => sum + s.percentage, 0) / course.course_scores.length
//         : 0
//     }
//   ].filter(item => item.count > 0);

//   if (chartData.length === 0) {
//     return (
//       <div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
//         <p className="text-muted">No assessment data</p>
//       </div>
//     );
//   }

//   return (
//     <ResponsiveContainer width="100%" height={200}>
//       <BarChart data={chartData} layout="horizontal">
//         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//         <XAxis type="number" domain={[0, 100]} />
//         <YAxis dataKey="name" type="category" width={80} />
//         <Tooltip
//           contentStyle={{
//             backgroundColor: '#fff',
//             border: '1px solid #dee2e6',
//             borderRadius: '8px'
//           }}
//           formatter={(value?: number) => [`${(value ?? 0).toFixed(1)}%`, 'Average']}
//         />
//         <Bar 
//           dataKey="avg" 
//           fill={COLORS.success}
//           radius={[0, 8, 8, 0]}
//           name="Average Score"
//         />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default {
//   PerformanceChart,
//   GradeDistributionChart,
//   TrendChart,
//   AssessmentBreakdownChart
// };


// v3
// Simple, Clear Performance Charts
// src/components/charts/PerformanceCharts.tsx

import React from 'react';
import type { CoursePerformance } from '@/hooks/usePerformance';

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

  const maxScore = 100;
  
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
