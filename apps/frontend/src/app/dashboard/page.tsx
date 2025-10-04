"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import MetricCard from '@/components/ui/MetricCard'
import MetricsChart from '@/components/charts/MetricsChart'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sample metrics data for demonstration
  const sampleMetrics = {
    classification: {
      accuracy: 0.875,
      precision: 0.892,
      recall: 0.875,
      f1_score: 0.883
    },
    regression: {
      mse: 0.045,
      rmse: 0.212,
      mae: 0.156,
      r2_score: 0.923
    }
  }

  const handleEvaluate = async () => {
    setError('')
    setLoading(true)

    try {
      // Sample evaluation data
      const evaluationData = {
        y_true: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
        y_pred: [1, 0, 1, 0, 0, 1, 1, 1, 1, 0],
        task_type: "classification"
      }

      const response = await fetch('http://localhost:8000/api/v1/metrics/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || 'Evaluation failed')
      }

      setMetrics(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed')
      // Use sample data if API fails
      setMetrics({
        success: true,
        task_type: "classification",
        metrics: sampleMetrics.classification,
        message: "Sample metrics (API not available)"
      })
    } finally {
      setLoading(false)
    }
  }

  const chartData = metrics ? Object.entries(metrics.metrics)
    .filter(([key]) => !key.includes('matrix') && !key.includes('report'))
    .map(([name, value]) => ({
      name: name.replace('_', ' ').toUpperCase(),
      value: typeof value === 'number' ? value : 0
    })) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Model Dashboard</h1>
              <p className="text-gray-600">View model performance metrics and analytics</p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span>{loading ? 'Evaluating...' : 'Evaluate Model'}</span>
          </button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Metrics Grid */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(metrics.metrics)
                .filter(([key]) => !key.includes('matrix') && !key.includes('report'))
                .map(([key, value]) => (
                  <MetricCard
                    key={key}
                    title={key.replace('_', ' ').toUpperCase()}
                    value={typeof value === 'number' ? value : 0}
                    unit=""
                    description={`${metrics.task_type} metric`}
                  />
                ))}
            </div>

            {/* Chart */}
            <MetricsChart
              data={chartData}
              title="Performance Metrics"
              className="mt-8"
            />

            {/* Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Type</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    metrics.task_type === 'classification' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-gray-700 capitalize">{metrics.task_type}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Evaluation Complete</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!metrics && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Metrics Available</h3>
            <p className="text-gray-600 mb-6">Click "Evaluate Model" to generate performance metrics</p>
            <button
              onClick={handleEvaluate}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Generate Metrics
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
