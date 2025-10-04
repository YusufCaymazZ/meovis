"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import FileUpload from '@/components/forms/FileUpload'
import PreviewTable from '@/components/tables/PreviewTable'

export default function UploadDatasetPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadResponse, setUploadResponse] = useState<any>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file)
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/v1/datasets/upload-dataset', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || 'Upload failed')
      }

      setUploadResponse(result)

      // Get preview data
      const previewResponse = await fetch(
        `http://localhost:8000/api/v1/datasets/preview-dataset?file_path=${encodeURIComponent(result.file_path)}`
      )
      const previewResult = await previewResponse.json()

      if (previewResponse.ok) {
        setPreviewData(previewResult)
      }
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Dataset</h1>
              <p className="text-gray-600">Upload your CSV or JSON dataset for analysis</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
              
              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes={['.csv', '.json']}
                maxSize={50 * 1024 * 1024} // 50MB
                disabled={loading}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg"
                >
                  <p className="text-blue-400 text-sm">Uploading and processing dataset...</p>
                </motion.div>
              )}
            </div>

            {/* Upload Success */}
            {uploadResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Upload Successful!</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Filename:</span>
                    <span className="font-medium text-gray-900">{uploadResponse.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shape:</span>
                    <span className="font-medium text-gray-900">{uploadResponse.shape[0]} rows × {uploadResponse.shape[1]} columns</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Columns:</span>
                    <span className="font-medium text-gray-900">{uploadResponse.columns.length}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dataset Preview</h2>
              
              {previewData ? (
                <PreviewTable
                  data={previewData.data}
                  columns={previewData.columns}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>Upload a dataset to see preview</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
