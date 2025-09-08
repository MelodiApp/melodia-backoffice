import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '@mui/material/styles'
import { Paper, Typography, Box } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface BaseChartProps {
  title: string
  data: any[]
  height?: number
  loading?: boolean
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme()
  
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 2,
          backgroundColor: theme.palette.grey[900],
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="white" gutterBottom>
          {format(parseISO(label), 'dd MMM yyyy', { locale: es })}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography
            key={index}
            variant="body2"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value.toLocaleString()}
          </Typography>
        ))}
      </Paper>
    )
  }
  return null
}

// Line chart component
interface LineChartCardProps extends BaseChartProps {
  dataKey: string
  strokeColor?: string
  gradientId?: string
}

export const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  data,
  dataKey,
  height = 300,
  strokeColor = '#1db954',
  gradientId = 'colorGreen',
}) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.palette.grey[900],
        borderRadius: 2,
        border: `1px solid ${theme.palette.grey[800]}`,
      }}
    >
      <Typography variant="h6" color="white" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.grey[700]} 
          />
          <XAxis 
            dataKey="date"
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
            tickFormatter={(value) => format(parseISO(value), 'dd/MM')}
          />
          <YAxis 
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={3}
            dot={{ fill: strokeColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: strokeColor, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}

// Area chart component
export const AreaChartCard: React.FC<LineChartCardProps> = ({
  title,
  data,
  dataKey,
  height = 300,
  strokeColor = '#1db954',
  gradientId = 'colorGreen',
}) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.palette.grey[900],
        borderRadius: 2,
        border: `1px solid ${theme.palette.grey[800]}`,
      }}
    >
      <Typography variant="h6" color="white" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.grey[700]} 
          />
          <XAxis 
            dataKey="date"
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
            tickFormatter={(value) => format(parseISO(value), 'dd/MM')}
          />
          <YAxis 
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  )
}

// Multi-line chart
interface MultiLineChartProps extends BaseChartProps {
  lines: Array<{
    dataKey: string
    stroke: string
    name: string
  }>
}

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  title,
  data,
  lines,
  height = 300,
}) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.palette.grey[900],
        borderRadius: 2,
        border: `1px solid ${theme.palette.grey[800]}`,
      }}
    >
      <Typography variant="h6" color="white" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.grey[700]} 
          />
          <XAxis 
            dataKey="date"
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
            tickFormatter={(value) => format(parseISO(value), 'dd/MM')}
          />
          <YAxis 
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: theme.palette.grey[400] }}
          />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={2}
              name={line.name}
              dot={{ strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}

// Bar chart component
interface BarChartCardProps extends BaseChartProps {
  dataKey: string
  nameKey: string
  fillColor?: string
}

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  data,
  dataKey,
  nameKey,
  height = 300,
  fillColor = '#1db954',
}) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.palette.grey[900],
        borderRadius: 2,
        border: `1px solid ${theme.palette.grey[800]}`,
      }}
    >
      <Typography variant="h6" color="white" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.grey[700]} 
          />
          <XAxis 
            dataKey={nameKey}
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: theme.palette.grey[400], fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.palette.grey[900],
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 4,
              color: 'white',
            }}
          />
          <Bar dataKey={dataKey} fill={fillColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  )
}

// Pie chart component
interface PieChartCardProps extends BaseChartProps {
  dataKey: string
  nameKey: string
  colors?: string[]
}

export const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  dataKey,
  nameKey,
  height = 300,
  colors = ['#1db954', '#1ed760', '#a0d911', '#52c41a', '#73d13d'],
}) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.palette.grey[900],
        borderRadius: 2,
        border: `1px solid ${theme.palette.grey[800]}`,
      }}
    >
      <Typography variant="h6" color="white" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.palette.grey[900],
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 4,
              color: 'white',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  )
}
