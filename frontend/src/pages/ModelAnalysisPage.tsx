import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Alert,
  CircularProgress 
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const ModelAnalysisPage = () => {
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [dataFile, setDataFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onModelDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && (file.name.endsWith('.pkl') || file.name.endsWith('.joblib'))) {
      setModelFile(file)
      setError(null)
    } else {
      setError('Please upload a valid model file (.pkl or .joblib)')
    }
  }

  const onDataDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.name.endsWith('.csv')) {
      setDataFile(file)
      setError(null)
    } else {
      setError('Please upload a valid CSV file')
    }
  }

  const { getRootProps: getModelRootProps, getInputProps: getModelInputProps, isDragActive: isModelDragActive } = useDropzone({
    onDrop: onModelDrop,
    accept: {
      'application/octet-stream': ['.pkl', '.joblib']
    },
    multiple: false
  })

  const { getRootProps: getDataRootProps, getInputProps: getDataInputProps, isDragActive: isDataDragActive } = useDropzone({
    onDrop: onDataDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  })

  const handleAnalyze = async () => {
  if (!dataFile) {
    setError("Lütfen bir CSV dosyası yükleyin");
    return;
  }

  setIsAnalyzing(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append("file", dataFile);

    const response = await fetch("http://localhost:8000/api/v1/endpoints/upload-csv/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Unknown error");
    }
  } catch (error) {
    setError("Sunucuya bağlanırken hata oluştu");
  } finally {
    setIsAnalyzing(false);
  }
};
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Model Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload your machine learning model and dataset to analyze performance and get visualizations.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Paper
          {...getModelRootProps()}
          sx={{
            flex: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: isModelDragActive ? 'primary.main' : 'grey.300',
            backgroundColor: isModelDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s'
          }}
        >
          <input {...getModelInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Upload Model
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {modelFile ? `Selected: ${modelFile.name}` : 'Drop .pkl or .joblib file here'}
          </Typography>
        </Paper>

        <Paper
          {...getDataRootProps()}
          sx={{
            flex: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: isDataDragActive ? 'primary.main' : 'grey.300',
            backgroundColor: isDataDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s'
          }}
        >
          <input {...getDataInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Upload Dataset
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dataFile ? `Selected: ${dataFile.name}` : 'Drop .csv file here'}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={!modelFile || !dataFile || isAnalyzing}
          startIcon={isAnalyzing ? <CircularProgress size={20} /> : null}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Model'}
        </Button>
      </Box>
    </Box>
  )
}

export default ModelAnalysisPage 