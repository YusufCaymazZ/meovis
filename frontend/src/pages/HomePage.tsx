import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Container 
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AnalyticsIcon from '@mui/icons-material/Analytics'

const HomePage = () => {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Analyze Model',
      description: 'Upload your ML model and dataset to get detailed performance metrics and visualizations.',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/analyze'),
      color: '#4E377A'
    },
    {
      title: 'Compare Models',
      description: 'Compare multiple models side-by-side with interactive charts and metrics.',
      icon: <CompareArrowsIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/compare'),
      color: '#4E377A'
    },
    {
      title: 'Model Explainability',
      description: 'Understand your model predictions with SHAP, LIME, and feature importance analysis.',
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/analyze'),
      color: '#4E377A'
    }
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{color:'#261542'}}>
          Welcome to Meovis
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Understand your ML models visually with interactive analysis and explainability tools
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload your .pkl/.joblib models and .csv datasets to get started
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4, 
                  backgroundColor:'#C0B0EB'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: feature.color, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={feature.action}
                  sx={{ backgroundColor: feature.color }}
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default HomePage 