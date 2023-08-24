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
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{'aria-labelledby': 'basic-button'}}
                    >
                        <MenuItem component={Link} to='/Table' onClick={handleClose}>View All Samples</MenuItem>
                        <MenuItem component={Link} to='/Track' onClick={handleClose}>Search via SampleID</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
