import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Alert 
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

const ComparisonPage = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CompareArrowsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Model Comparison
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Compare multiple machine learning models side-by-side with interactive visualizations.
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          🚧 Coming Soon
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          The model comparison feature is currently under development. 
          You'll be able to upload multiple models and datasets to compare their performance.
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          For now, you can analyze individual models using the "Analyze Model" feature.
        </Alert>
        
        <Button variant="contained" href="/analyze">
          Go to Model Analysis
        </Button>
      </Paper>
    </Box>
  )
}

export default ComparisonPage 