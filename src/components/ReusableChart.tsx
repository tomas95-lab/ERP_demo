"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts"
import React from "react"
import { Button } from "@/components/ui/button"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartType = "bar" | "pie"

interface ReusableChartProps {
  type: ChartType
  data: any[]              // Ajusta el tipo a tus datos concretos
  config: ChartConfig      // El config para <ChartContainer />
  title?: string           // Opcional: para mostrar título
  showGrid?: boolean       // Para mostrar o no el grid
  xKey?: string            // Eje X en BarChart
  yKeys?: string[]         // Claves a graficar en BarChart (ej: ["desktop", "mobile"])
  dataKeyPie?: string      // Clave de valor para PieChart
  nameKeyPie?: string      // Clave de nombre para PieChart
  width?: number
  height?: number
  total?: number
  TotalDescriptionPie?: string
  // Agrega más props si quieres controlar colores, leyendas, etc.
}

export function ReusableChart({
  type,
  data,
  config,
  title,
  showGrid = true,
  xKey = "month",
  yKeys = [],
  width = 400,
  height = 250,
  total,
  TotalDescriptionPie,
}: ReusableChartProps) {

  
  return (
    <ChartContainer
      config={config}
      className="h-full w-full border-2 rounded-xl bg-card text-card-foreground flex flex-col gap-6 pb-8 pt-6 shadow-sm "
    >
      {title && <h2 className="mx-auto text-lg text-center ont-semibold px-4 pb-2">{title}</h2>}
      <p className="text-center text-sm text-muted-foreground">Total visitors: 100</p>
      {type === "bar" && (
        <BarChart width={width} height={height} data={data} accessibilityLayer>
          {showGrid && <CartesianGrid vertical={false} />}
          <XAxis
            dataKey={xKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {yKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={4}
            />
          ))}
        </BarChart>
      )}

      {type === "pie" && (
        <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data}  dataKey="value" nameKey="name"  innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {TotalDescriptionPie}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            </PieChart>
      )}
    </ChartContainer>
  )
}
