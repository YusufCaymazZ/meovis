import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <ScienceIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Meovis
          </RouterLink>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/analyze"
          >
            Analyze Model
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/compare"
          >
            Compare Models
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header 