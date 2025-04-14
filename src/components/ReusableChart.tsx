"use client"

import {
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

type ChartType = "bar" | "pie" | "mini"

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
  mini?: boolean,
  color?: string,
  dataKey?: string
  card?: boolean,
  description?: string,
  dataKeyLine?: string,
}

export function ReusableChart({
  type,
  data,
  config,
  title,
  xKey = "month",
  yKeys = [],
  total,
  TotalDescriptionPie,
  color,
  dataKey,
  card = true,
  description,
  dataKeyLine
}: ReusableChartProps) {

return (
  <>
    {card ? (
      <Card className="justify-between">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{""}</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={config}>
        {type == "bar" ? 
        (
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          {yKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                radius={4}
              />
            ))}
        </BarChart>
        ) : type == "pie" ? (
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
        ):<div></div>}
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="flex gap-2 font-medium leading-none">
        {description}
      </div>
    </CardFooter>
  </Card>
    ) : (
      <ChartContainer config={config}>
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
      </ChartContainer>
    )}
  </>
  )
}
