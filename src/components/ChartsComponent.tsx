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
} from "recharts"

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
  // Agrega más props si quieres controlar colores, leyendas, etc.
}



export function ReusableChart({
    type,
    data,
    config,
    title,
    showGrid = true,
    xKey = "month",
    yKeys = ["desktop", "mobile"],
    dataKeyPie = "value",
    nameKeyPie = "name",
    width = 400,
    height = 250,
  }: ReusableChartProps) {
    return (
      <ChartContainer
        config={config}
        className="h-full w-full border-2 rounded-xl bg-card text-card-foreground flex flex-col gap-6 py-6 shadow-sm"
      >
        {/* Título opcional */}
        {title && <h2 className="mx-auto text-lg font-bold">{title}</h2>}
  
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
            <YAxis />
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
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              dataKey={dataKeyPie}
              nameKey={nameKeyPie}
              outerRadius={80}
              fill="#60a5fa"
            />
            <Tooltip />
          </PieChart>
        )}
      </ChartContainer>
    )
  }
  