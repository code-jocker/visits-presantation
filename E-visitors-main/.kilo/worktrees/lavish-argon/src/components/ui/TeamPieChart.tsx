import { useEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

interface TeamPieChartProps {
  total: number
  checkIn: number
  checkOut: number
}

function TeamPieChart({ total, checkIn, checkOut }: TeamPieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const root = am5.Root.new(chartRef.current)
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(am5percent.PieChart.new(root, {
      layout: root.verticalLayout
    }))

    const series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'category'
    }))

    series.data.setAll([
      { value: checkIn, category: 'Check In' },
      { value: checkOut, category: 'Check Out' },
      { value: total, category: 'Total Visitors' }
    ])

    series.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [total, checkIn, checkOut])

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>
}

export default TeamPieChart