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
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                </Typography>
                <Typography sx={{m:1}}>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                </Typography>
                <Typography sx={{m:1}}>
                  At imperdiet dui accumsan sit amet nulla facilisi. Sit amet nulla facilisi morbi. Id velit ut tortor pretium viverra suspendisse potenti nullam ac. 
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
                alt="Stock image"
                src="https://images.unsplash.com/photo-1628863353691-0071c8c1874c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
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
                        href="https://www.google.ca"
                        sx={{ml:2, mb:1}}
                    >
                        UBC lab develops new, portable drug-checking device ahead of limited decriminalization
                        </Link>
                    <Link 
                        href="https://www.google.ca"
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
            sx={{m:2, mt:4}}
        >
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{m:2}}
            >
                <AboutText />
                
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
                    href="https://www.google.ca"
                    sx={{ml:2, mb:1}}
                >
                    UBC lab develops new, portable drug-checking device ahead of limited decriminalization
                    </Link>
                <Link 
                    href="https://www.google.ca"
                    sx={{ml:2, mb:1}}
                >
                    UBC lab testing new portable drug-checking device
                </Link>
            </Box>
        </Box>
    )
}

export default About;


