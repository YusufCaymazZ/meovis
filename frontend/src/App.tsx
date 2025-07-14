import { Routes, Route } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ModelAnalysisPage from './pages/ModelAnalysisPage'
import ComparisonPage from './pages/ComparisonPage'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor:'#DED9FF' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<ModelAnalysisPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App 