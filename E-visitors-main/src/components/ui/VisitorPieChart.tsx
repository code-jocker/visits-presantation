import { useEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

interface VisitorPieChartProps {
  total: number
  checkIn: number
  checkOut: number
}

function VisitorPieChart({ total, checkIn, checkOut }: VisitorPieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const root = am5.Root.new(chartRef.current)
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(60),
        layout: root.verticalLayout
      })
    )

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        alignLabels: false
      })
    )

    series.labels.template.setAll({
      textType: 'circular',
      centerX: 0,
      centerY: 0
    })

    series.data.setAll([
      { category: 'Checked In', value: checkIn, color: am5.color(0x10b981) },
      { category: 'Checked Out', value: checkOut, color: am5.color(0xef4444) }
    ])

    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff)
    })

    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: `[fontSize:40px]${total}[/]\n[fontSize:14px]Total Visitors[/]`,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        textAlign: 'center',
        populateText: true
      })
    )

    series.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [total, checkIn, checkOut])

  return <div ref={chartRef} style={{ width: '80%', height: '430px' }}></div>
}

export default VisitorPieChart
