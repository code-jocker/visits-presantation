import React, { useEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface MapChartProps {
  className?: string;
}

const MapChart: React.FC<MapChartProps> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const data = [
      { id: "US", name: "United States", value: 100 },
      { id: "GB", name: "United Kingdom", value: 100 },
      { id: "CN", name: "China", value: 100 },
      { id: "IN", name: "India", value: 100 },
      { id: "AU", name: "Australia", value: 100 },
      { id: "CA", name: "Canada", value: 100 },
      { id: "BR", name: "Brasil", value: 100 },
      { id: "ZA", name: "South Africa", value: 100 }
    ];

    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(am5map.MapChart.new(root, {}));

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am4geodata_worldLow as any,
        exclude: ["AQ"]
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      fill: am5.color(0xaaaaaa),
      stroke: am5.color(0xffffff),
      strokeWidth: 0.5
    });

    const bubbleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        valueField: "value",
        calculateAggregates: true,
        polygonIdField: "id"
      })
    );

    const circleTemplate = am5.Template.new<am5.Circle>({});

    bubbleSeries.bullets.push(function(root) {
      const container = am5.Container.new(root, {});

      const circle = container.children.push(
        am5.Circle.new(root, {
          radius: 15,
          fillOpacity: 0.7,
          fill: am5.color(0x0066cc),
          cursorOverStyle: "pointer",
          tooltipText: `{name}: [bold]{value}[/]`
        }, circleTemplate)
      );

      const countryLabel = container.children.push(
        am5.Label.new(root, {
          text: "{name}",
          paddingLeft: 5,
          populateText: true,
          fontWeight: "bold",
          fontSize: 13,
          centerY: am5.p50
        })
      );

      circle.on("radius", function(radius) {
        countryLabel.set("x", radius);
      });

      return am5.Bullet.new(root, {
        sprite: container,
        dynamic: true
      });
    });

    bubbleSeries.bullets.push(function(root) {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: "{value.formatNumber('#.')}",
          fill: am5.color(0xffffff),
          populateText: true,
          centerX: am5.p50,
          centerY: am5.p50,
          textAlign: "center"
        }),
        dynamic: true
      });
    });

    bubbleSeries.set("heatRules", [
      {
        target: circleTemplate,
        dataField: "value",
        min: 8,
        max: 35,
        minValue: 0,
        maxValue: 100,
        key: "radius"
      }
    ]);

    bubbleSeries.data.setAll(data);

    const updateData = () => {
      for (let i = 0; i < bubbleSeries.dataItems.length; i++) {
        bubbleSeries.data.setIndex(i, { 
          value: Math.round(Math.random() * 100), 
          id: data[i].id, 
          name: data[i].name 
        });
      }
    };

    updateData();
    const interval = setInterval(updateData, 2000);

    return () => {
      clearInterval(interval);
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={chartRef} 
      className={`w-full h-120 ${className}`}
    />
  );
};

export default MapChart;