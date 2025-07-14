import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'


const Header = () => {
  return ( //I LOVE MY SFY
    <AppBar position="static" sx={{ width: '100vw', backgroundColor:'#C0B0EB'}}>
      <Toolbar>
        <ScienceIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color:'#261542' }}>
            Meovis
          </RouterLink>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            style={{color:'#261542'}}
            component={RouterLink} 
            to="/"
          >
            Home
          </Button>
          <Button 
            style={{color:'#261542'}}
            component={RouterLink}  
            to="/analyze"
          >
            Analyze Model
          </Button>
          <Button 
            style={{color:'#261542'}}
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