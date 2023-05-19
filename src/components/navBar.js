import { AppBar, Box, Toolbar } from "@mui/material"

function navBar(){
    return(
        <Box>
            <AppBar position='static'>
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

export default navBar


{/* <div className="logoBackground">
    <img src={logo} alt="Logo" style={{ height: '160px' }} />
</div>
<div className="navBar">
    <Link to="/" className='navbutton'>Home</Link>
    <Link to="/Public" className='navbutton'>View Samples</Link>
    <Link to="/Track" className='navbutton'>Track Specific Sample</Link>
</div> */}
