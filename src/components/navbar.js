import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom'
import '../css/navbar.css'

export const NavBar = () => {
    return(
        <Box>
            <AppBar position='static'>
                <div className="navBar">
                    <Link to="/" className='navbutton'>Home</Link>
                    {/* <Link to="/Resources" className='navbutton'>Resources</Link> */} 
                    <Link to="/Table" className='navbutton'>View All Samples</Link>
                    <Link to="/Track" className='navbutton'>Search via Sample ID</Link>
                </div>
            </AppBar>
        </Box>
    )
}

export const MobileNavBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

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
                        component={Link}
                        to='/'
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
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{'aria-labelledby': 'basic-button'}}
                    >
                        {/* <MenuItem component={Link} to="/Resources" onClick={handleClose}>Resources</MenuItem> */}
                        <MenuItem component={Link} to='/Table' onClick={handleClose}>View All Samples</MenuItem>
                        <MenuItem component={Link} to='/Track' onClick={handleClose}>Search via SampleID</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
