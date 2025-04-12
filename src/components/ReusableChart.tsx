"use client"

import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  Label,
  Line, 
  LineChart
} from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartType = "bar" | "pie" | "mini"

interface ReusableChartProps {
  type: ChartType
  data: any[]              // Ajustá el tipo según tus datos concretos
  config: ChartConfig      // Configuración para <ChartContainer />
  title?: string           // Opcional: para mostrar título
  showGrid?: boolean       // Para mostrar o no el grid en BarChart
  xKey?: string            // Clave del eje X para BarChart o PieChart
  yKeys?: string[]         // Claves a graficar en BarChart (ej: ["desktop", "mobile"])
  dataKeyPie?: string      // Clave de valor para PieChart
  nameKeyPie?: string      // Clave de nombre para PieChart
  total?: number
  TotalDescriptionPie?: string
  mini?: boolean,
  color?: string,
  dataKey?: string         // Para mini chart, clave para el eje X
  card?: boolean,
  description?: string,
  dataKeyLine?: string     // Para mini chart, clave para la línea
}

export function ReusableChart({
  type,
  data,
  config,
  title,
  showGrid = true,
  xKey = "month",
  yKeys = [],
  total,
  TotalDescriptionPie,
  mini,
  color,
  dataKey,
  card = true,
  description,
  dataKeyLine
}: ReusableChartProps) {

  return (
    <ChartContainer
      config={config}
      className={`h-full w-full rounded-xl ${card ? "bg-card shadow-sm border-2 " : ""} text-card-foreground flex flex-col gap-6 pb-8 pt-6`}
    >
      <>
        {title && (
          <h2 className="mx-auto text-lg text-center font-semibold px-4 pb-2">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-center text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {type === "bar" && (
          <ResponsiveContainer width="100%" height="100%" aspect={2}>
            <BarChart data={data}>
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
          </ResponsiveContainer>
        )}
        
        {type === "pie" && (
          <ResponsiveContainer width="100%" aspect={1}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey={dataKey || "defaultKey"}
                nameKey={xKey}
                innerRadius={60}
                strokeWidth={5}
              >
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
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {mini === true && type === "mini" && (
          <ResponsiveContainer width="100%" aspect={3}>
            <LineChart
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={dataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey={dataKeyLine}
                type="natural"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </>
    </ChartContainer>
  )
}
