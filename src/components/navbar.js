import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom'
import '../css/navbar.css'

export const NavBar = () => {
    return(
        <Box>
            <AppBar position='static' classname='appbar'>
                <div className="navBar">
                    <Link to="/" className='navbutton'>Home</Link>
                    <Link to="/About" className='navbutton'>About</Link>
                    <Link to="/Table" className='navbutton'>View Samples</Link>
                    <Link to="/Track" className='navbutton'>Search via Sample ID</Link>
                </div>
            </AppBar>
        </Box>
    )
}

export const MobileNavBar = () => {
    return(
        <Box>
            <AppBar position="static">
                <Toolbar sx={{display: 'flex', justifyContent:'space-between'}}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ m: 0.5 }}
                        href="/"
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography>UBC Harm Reduction</Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        sx={{ m: 0.5 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
