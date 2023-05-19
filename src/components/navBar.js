import { AppBar, Box, Toolbar } from "@mui/material"
import { Link } from 'react-router-dom'
import logo from '../ubclogo.png'

function NavBar(){
    return(
        <Box>
            <AppBar position='static' classname='appbar'>
                <div className="logoBackground">
                    <img src={logo} alt="Logo" style={{ height: '160px' }} />
                </div>
                <div className="navBar">
                    <Link to="/" className='navbutton'>Home</Link>
                    <Link to="/Public" className='navbutton'>View Samples</Link>
                    <Link to="/Track" className='navbutton'>Track Specific Sample</Link>
                </div>
            </AppBar>
        </Box>
    )
}

export default NavBar
