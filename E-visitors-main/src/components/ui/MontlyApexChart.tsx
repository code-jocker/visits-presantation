import Chart from "react-apexcharts";

interface MonthlyApexChartProps {
  title?: string;
  data: number[];
  categories?: string[];
  color?: string;
  height?: number;
}

function MonthlyApexChart({ 
  title = 'Monthly Revenue Trend', 
  data, 
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  color = '#67DADC',
  height = 250
}: MonthlyApexChartProps) {
  
  const chartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: [color],
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end' as const,
        horizontal: false,
        columnWidth: '45%',
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#9ca3af', fontSize: '12px', fontWeight: 500 }
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: '#9ca3af', fontSize: '12px', fontWeight: 500 }
      }
    },
    grid: {
      show: true,
      borderColor: '#f3f4f6',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 }
    },
    tooltip: { enabled: true, theme: 'light' as const },
    fill: { opacity: 1 }
  };

  const series = [{
    name: title,
    data
  }];

  return (
    <div className="bg-white w-full h-auto rounded-lg border border-gray-200 shadow-sm p-2">
      <h2 className="text-xl font-semibold text-gray-600 mb-4">{title}</h2>
      <Chart
        options={chartOptions}
        series={series}
        type="bar"
        height={height}
      />
    </div>
  );
}

export default MonthlyApexChart;