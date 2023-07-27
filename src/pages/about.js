import { Box, Typography, Link } from "@mui/material"
import { isMobile } from 'react-device-detect'

const About = () => {
    const WIDTH = isMobile ? 400 : 1600;

    const AboutText = () => {
        return(
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
                sx={{m:2}}
            >
                <Typography variant='h4' sx={{m:1}}>About us</Typography>
                <Typography sx={{m:1}}>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </Typography>
                <Typography sx={{m:1}}>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </Typography>
                <Typography sx={{m:1}}>
                  At imperdiet dui accumsan sit amet nulla facilisi. Sit amet nulla facilisi morbi. Id velit ut tortor pretium viverra suspendisse potenti nullam ac. Tellus cras adipiscing enim eu. Proin sed libero enim sed. Cursus in hac habitasse platea dictumst quisque sagittis purus. Ante metus dictum at tempor. Nunc aliquet bibendum enim facilisis gravida. Aliquam faucibus purus in massa tempor nec feugiat. Blandit volutpat maecenas volutpat blandit aliquam. Aliquam ut porttitor leo a diam sollicitudin. Pellentesque elit eget gravida cum sociis natoque. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
                </Typography>
            </Box>
        )
    }

    if(isMobile) return(
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{m:2, mt:4}}
        >
            <AboutText />
            <Box
                component="img"
                sx={{
                width: WIDTH,
                }}
                alt="Stock UBC image"
                src="https://images.unsplash.com/photo-1603857365671-93cd96dc1df8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            />
            <Box
                    sx={{
                        boxShadow: 1,
                        width: WIDTH,
                        height: 'auto',
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                        color: (theme) =>
                            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                        p: 1,
                        m: 4,
                        borderRadius: 2,
                        textAlign: 'center',
                    }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <Typography variant="h5" sx={{m:2}}>More Information</Typography>
                    <Link 
                        href="https://www.cbc.ca/news/canada/british-columbia/ubc-lab-bc-portable-drug-checking-tech-hplcs-1.6718800"
                        sx={{ml:2, mb:1}}
                    >
                        UBC lab develops new, portable drug-checking device ahead of limited decriminalization
                        </Link>
                    <Link 
                        href="https://www.bccsu.ca/blog/news/ubc-lab-testing-new-portable-drug-checking-device/"
                        sx={{ml:2, mb:1}}
                    >
                        UBC lab testing new portable drug-checking device
                    </Link>
                </Box>
        </Box>
    )
    return(
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{height: '100vh', m:2, mt:4}}
        >
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{m:2}}
            >
                <AboutText />
                <Box
                    component="img"
                    sx={{
                    width: WIDTH / 2,
                    }}
                    alt="Stock UBC image"
                    src="https://images.unsplash.com/photo-1603857365671-93cd96dc1df8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
                />
            </Box>
            <Box
                sx={{
                    boxShadow: 1,
                    height: 'auto',
                    width: '80vw',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                    color: (theme) =>
                        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                    p: 1,
                    m: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
            >
                <Typography variant="h5" sx={{m:2}}>More Information</Typography>
                <Link 
                    href="https://www.cbc.ca/news/canada/british-columbia/ubc-lab-bc-portable-drug-checking-tech-hplcs-1.6718800"
                    sx={{ml:2, mb:1}}
                >
                    UBC lab develops new, portable drug-checking device ahead of limited decriminalization
                    </Link>
                <Link 
                    href="https://www.bccsu.ca/blog/news/ubc-lab-testing-new-portable-drug-checking-device/"
                    sx={{ml:2, mb:1}}
                >
                    UBC lab testing new portable drug-checking device
                </Link>
            </Box>
        </Box>
    )
}

export default About;


