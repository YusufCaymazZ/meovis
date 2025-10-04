"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Brain, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import FileUpload from '@/components/forms/FileUpload'

export default function UploadModelPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadResponse, setUploadResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file)
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/v1/models/upload-model', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || 'Upload failed')
      }

      setUploadResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Model</h1>
              <p className="text-gray-600">Upload your trained ML model for analysis and predictions</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Model File</h2>
              
              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes={['.pkl', '.joblib', '.pt']}
                maxSize={50 * 1024 * 1024} // 50MB
                disabled={loading}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-blue-700 text-sm">Uploading and validating model...</p>
                </motion.div>
              )}
            </div>

            {/* Upload Success */}
            {uploadResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Model Uploaded Successfully!</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Filename:</span>
                    <span className="font-medium">{uploadResponse.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Algorithm:</span>
                    <span className="font-medium">{uploadResponse.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Type:</span>
                    <span className="font-medium">{uploadResponse.model_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{(uploadResponse.size_bytes / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Your model is now ready for:</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Making predictions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Performance evaluation</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>SHAP analysis</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Supported Model Formats</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">PKL</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Pickle Files</h3>
                    <p className="text-sm text-gray-600">Standard Python pickle format for scikit-learn models</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">JOB</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Joblib Files</h3>
                    <p className="text-sm text-gray-600">Optimized format for scikit-learn models</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">PT</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">PyTorch Files</h3>
                    <p className="text-sm text-gray-600">PyTorch model format (coming soon)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Upload a dataset to analyze your model</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Make predictions with new data</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>View performance metrics and visualizations</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
