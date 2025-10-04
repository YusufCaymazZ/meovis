"use client"

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  description?: string
  className?: string
}

export default function MetricCard({
  title,
  value,
  unit = '',
  trend,
  trendValue,
  description,
  className = ''
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            {trendValue && (
              <span className="text-xs font-medium">{trendValue}</span>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toFixed(3) : value}
        </span>
        {unit && (
          <span className="text-sm text-gray-500 ml-1">{unit}</span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </motion.div>
  )
}
