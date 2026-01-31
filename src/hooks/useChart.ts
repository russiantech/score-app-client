// src/hooks/useChart.ts
import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js';

export const useChart = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: ChartConfiguration | null
) => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config) return;

    // 🔥 IMPORTANT: destroy any chart already bound to this canvas
    Chart.getChart(canvas)?.destroy();

    chartRef.current = new Chart(canvas, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [canvasRef, config]);
};

