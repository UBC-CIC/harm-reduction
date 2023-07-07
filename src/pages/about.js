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
                    The Hein lab at the University of British Columbia (UBC) 
                    aims to solve problems in modern organic chemistry. Goals of the Hein lab 
                    are to accelerate the rate of research, integrate instruments with 
                    autonomous robots to develop self-driving laboratories, and deploy 
                    technologies to process chemistry.
                </Typography>
                <Typography sx={{m:1}}>
                    Recently, the Hein lab innovated a drug-checking technology, which 
                    improves effectiveness and sensitivity, minimizing human error. The drug-checking 
                    innovation by the Hein lab maximizes the benefits of 
                    decriminalization and reduces the harm in drug use, supporting the solution 
                    to the toxic crisis.
                </Typography>
                <Typography sx={{m:1}}>
                    Extended, the Hein lab aims to ensure the safety and certainty of drug 
                    distribution among the public. Currently, students do not have an efficient, 
                    privacy-ensuring method to test recreational drugs that they plan to use. 
                    This webpage involves the student sending the drug sample over, 
                    understanding that their identity remains private. The Hein lab robot records 
                    drug samples, tracks the sample as it undergoes testing, and posts results of 
                    the sample to the public.
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
                sx={{width: WIDTH, m:2}}
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
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{width: WIDTH, m:2}}
            >
                <Box
                    component="img"
                    sx={{
                    width: WIDTH / 2,
                    }}
                    alt="Stock UBC image"
                    src="https://i.cbc.ca/1.6718816.1674094992!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/hein-lab.jpg"
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
        </Box>
    )
}

export default About;


