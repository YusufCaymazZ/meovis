"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Brain, Send, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function PredictPage() {
  const [inputData, setInputData] = useState<Record<string, string>>({})
  const [predictions, setPredictions] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (key: string, value: string) => {
    setInputData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePredict = async () => {
    setError('')
    setLoading(true)

    try {
      // Convert string values to numbers where possible
      const processedData = Object.entries(inputData).reduce((acc, [key, value]) => {
        const numValue = parseFloat(value)
        acc[key] = isNaN(numValue) ? value : numValue
        return acc
      }, {} as Record<string, any>)

      const response = await fetch('http://localhost:8000/api/v1/models/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: processedData
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || 'Prediction failed')
      }

      setPredictions(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  const sampleFeatures = [
    { name: 'feature_1', label: 'Feature 1', type: 'number', placeholder: 'Enter numeric value' },
    { name: 'feature_2', label: 'Feature 2', type: 'number', placeholder: 'Enter numeric value' },
    { name: 'feature_3', label: 'Feature 3', type: 'number', placeholder: 'Enter numeric value' },
    { name: 'feature_4', label: 'Feature 4', type: 'number', placeholder: 'Enter numeric value' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Make Predictions</h1>
              <p className="text-gray-600">Enter feature values to get model predictions</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Input</h2>
              
              <div className="space-y-4">
                {sampleFeatures.map((feature) => (
                  <div key={feature.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {feature.label}
                    </label>
                    <input
                      type={feature.type}
                      placeholder={feature.placeholder}
                      value={inputData[feature.name] || ''}
                      onChange={(e) => handleInputChange(feature.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handlePredict}
                disabled={loading || Object.keys(inputData).length === 0}
                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? 'Predicting...' : 'Get Prediction'}</span>
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Results</h2>
              
              {predictions ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Prediction Complete!</h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Predictions:</h4>
                    <div className="space-y-1">
                      {predictions.predictions.map((pred: any, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="text-gray-600">Sample {index + 1}:</span>
                          <span className="ml-2 font-medium text-gray-900">{pred}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {predictions.probabilities && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Probabilities:</h4>
                      <div className="space-y-1">
                        {predictions.probabilities.map((prob: number[], index: number) => (
                          <div key={index} className="text-sm">
                            <span className="text-gray-600">Sample {index + 1}:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              [{prob.map(p => p.toFixed(3)).join(', ')}]
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-400 mb-2">Model Info:</h4>
                    <div className="text-sm text-blue-300">
                      <div>Algorithm: {predictions.model_info.algorithm}</div>
                      <div>Model Path: {predictions.model_info.model_path}</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>Enter feature values and click "Get Prediction" to see results</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to Use </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Enter feature values to get model predictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Click "Get Prediction" to run the model</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>View predictions and probabilities (if available)</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
