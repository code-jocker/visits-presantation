import { useEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

interface AnalyticsLineChartProps {
  data: { date: number; value: number }[]
  title?: string
}

function AnalyticsLineChart({ data, title = 'Business Growth' }: AnalyticsLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Create root element
    const root = am5.Root.new(chartRef.current)

    // Set themes
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
        paddingLeft: 0
      })
    )

    // Add cursor
    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
      behavior: 'none'
    }))
    cursor.lineY.set('visible', false)

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
          timeUnit: 'day',
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 80,
          minorGridEnabled: true,
          pan: 'zoom'
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
          pan: 'zoom'
        })
      })
    )

    // Add series
    const series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: title,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}'
        })
      })
    )

    series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    })

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: am5.Circle.new(root, {
          radius: 4,
          stroke: root.interfaceColors.get('background'),
          strokeWidth: 2,
          fill: series.get('fill')
        })
      })
    })

    // Add scrollbar
    chart.set('scrollbarX', am5.Scrollbar.new(root, {
      orientation: 'horizontal'
    }))

    // Set data
    series.data.setAll(data)

    // Make stuff animate on load
    series.appear(1000)
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data, title])

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>
}

export default AnalyticsLineChart
