"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes: string[]
  maxSize?: number
  className?: string
  disabled?: boolean
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className = "",
  disabled = false
}: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      setErrorMessage(error.message)
      setUploadStatus('error')
      return
    }

    if (acceptedFiles.length > 0) {
      setUploadStatus('uploading')
      setErrorMessage('')
      
      // Simulate upload delay
      setTimeout(() => {
        onFileSelect(acceptedFiles[0])
        setUploadStatus('success')
      }, 1000)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize,
    maxFiles: 1,
    disabled
  })

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />
      case 'uploading':
        return <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <Upload className="w-8 h-8 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'success':
        return 'File uploaded successfully!'
      case 'error':
        return errorMessage
      case 'uploading':
        return 'Uploading...'
      default:
        return isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div className="space-y-2">
            <p className={`text-lg font-medium ${
              uploadStatus === 'success' ? 'text-green-700' : 
              uploadStatus === 'error' ? 'text-red-700' : 
              'text-gray-700'
            }`}>
              {getStatusText()}
            </p>
            
            {uploadStatus === 'idle' && (
              <p className="text-sm text-gray-500">
                Accepted formats: {acceptedTypes.join(', ')}
                <br />
                Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            )}
          </div>
        </div>
      </div>
      
      {uploadStatus === 'error' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setUploadStatus('idle')
            setErrorMessage('')
          }}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}
