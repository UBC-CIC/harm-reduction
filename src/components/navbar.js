import { AppBar, Box } from "@mui/material"
import { Link } from 'react-router-dom'
import '../css/navbar.css'

function NavBar(){
    return(
        <Box>
            <AppBar position='static' classname='appbar'>
                <div className="navBar">
                    <Link to="/" className='navbutton'>Home</Link>
                    <Link to="/Table" className='navbutton'>View Samples</Link>
                    <Link to="/Track" className='navbutton'>Search via Sample ID</Link>
                </div>
            </AppBar>
        </Box>
    )
}

export default NavBar