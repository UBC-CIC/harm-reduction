import { Box, Typography, Link } from "@mui/material"

const Resources = () => {
    return(
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{height: '70vh', m:2, mt:4}}
        >
            <Typography variant='h5'>Resources regarding potential substances found in a sample</Typography>
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
                justifyContent="flex-start"
                alignItems="flex-start"
            >
                <Typography variant='p1' sx={{m:2}}>Cocaine</Typography>
                <Link 
                    href="https://www.cbc.ca/news/canada/british-columbia/ubc-lab-bc-portable-drug-checking-tech-hplcs-1.6718800"
                    sx={{m:1, ml:2}}
                >
                    Link 1
                    </Link>
                <Link 
                    href="https://www.bccsu.ca/blog/news/ubc-lab-testing-new-portable-drug-checking-device/"
                    sx={{m:1, ml:2}}
                >
                    Link 2
                </Link>
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
                justifyContent="flex-start"
                alignItems="flex-start"
            >
                <Typography variant='p1' sx={{m:2}}>Marijuana</Typography>
                <Link 
                    href="https://www.cbc.ca/news/canada/british-columbia/ubc-lab-bc-portable-drug-checking-tech-hplcs-1.6718800"
                    sx={{m:1, ml:2}}
                >
                    Link 1
                    </Link>
                <Link 
                    href="https://www.bccsu.ca/blog/news/ubc-lab-testing-new-portable-drug-checking-device/"
                    sx={{m:1, ml:2}}
                >
                    Link 2
                </Link>
            </Box>
        </Box>
    )
}

export default Resources;