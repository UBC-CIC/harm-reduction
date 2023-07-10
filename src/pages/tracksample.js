import React from 'react';
import { useState } from 'react';
import { isMobile } from 'react-device-detect'
import axios from 'axios'

import { 
    Alert, 
    Autocomplete, 
    Button, 
    Box, 
    Checkbox, 
    Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TextField, 
    ToggleButton, ToggleButtonGroup, 
    Typography, 
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';

import '../css/tracksample.css'

const expectedContentOptions = [
    {value: 'Cocaine'},
    {value: 'Marijuana'},
    {value: 'Methamphetamine'},
    {value: 'Adderall'},
  ];
  

const TrackSample = () => {
    const [pageState, setPageState] = useState(0); // pageStates = ["enterid", "showsample", "showcontact", "updatecontact", "verifycontact"]
    const [referenceID, setReferenceID] = useState('');
    const [newContact, setNewContact] = useState('');
    const [contactMethod, setContactMethod] = useState('email')
    
    const [displayError, setDisplayError] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [displaySavedMsg, setDisplaySavedMsg] = useState(false);
    const [displayContactEdit, setDisplayContactEdit] = useState(false);
    const [displayContactVerify, setDisplayContactVerify] = useState(false);
    const [displayGetMetadata, setDisplayGetMetadata] = useState(false);
    
    const [sampleID, setSampleID] = useState('');
    const [sampleStatus, setSampleStatus] = useState('');
    const [sampleDate, setSampleDate] = useState('');

    const [sampleUsed, setSampleUsed] = useState(false);
    
    let   trackingID;
    let   contactField;
    let   enteredOTP;
    let   expectedContentsField;

    const trackSample = async () => {
        console.log(`trackingID: ${trackingID}`);
        try{
            console.log('try api')
            const resp = await axios.get(`https://1pgzkwt5w4.execute-api.us-west-2.amazonaws.com/test/samples?tableName=samples&sample-id=${trackingID}`);
            console.log(resp.data);
            setSampleID(resp.data['sample-id']);
            setSampleStatus(resp.data['status']);
            setSampleDate(resp.data['date-received']);

            if(resp.data['is-used'] == 'N/A' || resp.data['expect-contents'] == 'N/A') setDisplayGetMetadata(true);

            setDisplayContactEdit(false);
            setDisplayContactVerify(false);
            setDisplayError(false);
            setPageState(1);
        }catch(err){
            setDisplayError(true);
        }
    }

    const saveMetadata = async () => {
        console.log('expected-field: ' + expectedContentsField);
        console.log('used?: ' + sampleUsed);
        setDisplayGetMetadata(false);

        try{
            const getresp = await axios.get(`https://1pgzkwt5w4.execute-api.us-west-2.amazonaws.com/test/samples?tableName=samples&sample-id=${sampleID}`);
            const item = getresp.data;
            const resp = await axios.put(`https://1pgzkwt5w4.execute-api.us-west-2.amazonaws.com/test/samples?tableName=samples`,{
                "sample-id": item["sample-id"],
                "vial-id": item["vial-id"],
                "date-received": item["date-received"],
                "expected-content": expectedContentsField,
                "is-used": String(sampleUsed),
                "test-results": item["test-results"],
                "location": item["location"],
                "notes": item["notes"],
                "color": item["color"],
                "testing-method": item["testing-method"],
            })
            console.log(resp);
            expectedContentsField='';
            setSampleUsed(false);
        }catch(err){
            console.log(err);
        }

    }

    const editContact = async () => {
        console.log(`contactfield: ${contactField}`);
        console.log('email? ' + contactMethod);

        const OTPInfo = await axios.post(`https://bwxq8zcfp2.execute-api.us-west-2.amazonaws.com/beta/otp?action=send`,{
            "recipient": contactField,
            "contactbyemail": (contactMethod == 'email'),
        });
        console.log(OTPInfo.data);
        setNewContact(contactField);
        setReferenceID(OTPInfo.data.refID);
        
        setDisplayError(false);
        contactField = '';
        setDisplayContactEdit(false);
        setDisplayContactVerify(true);
    }

    const verifyContact = async () => {
        console.log(`entered OTP: ${enteredOTP}`);
        console.log(`refID: ${referenceID}`);
        
        const verifyResp = await axios.post(`https://bwxq8zcfp2.execute-api.us-west-2.amazonaws.com/beta/otp?action=verify`, {
            "recipient": newContact,
            "userOTP": enteredOTP,
            "userRefID": referenceID
        })
        console.log(verifyResp.data);

        if(!verifyResp.data.valid){
            setDisplayError(true);
            return;
        }

        try{
            const updateContactResp = await axios.put(`https://1pgzkwt5w4.execute-api.us-west-2.amazonaws.com/test/users?tableName=users`, {
                "sample-id": sampleID,
                "contact": newContact,
            });
            console.log(updateContactResp);

            setNewContact('');
            setDisplaySavedMsg(true);
            setDisplayContactVerify(false);
        }catch(err){
            console.log(err);
            // should try again or do some thing to fix issue, probably do not want user to know this part went wrong
        }
    }

    const TrackingIDInput = () => {
        const WIDTH = isMobile ? 400 : 800;
        return(
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{mt:4}}
        >
            <Typography variant='h6' align='center' sx={{m:1, width: WIDTH}}>Enter the sample ID provided on the package in the box below</Typography>
            {displayError && <Alert sx={{m:1}}severity='error'> The sample ID you entered does not exist</Alert>}
            <TextField 
                className="textbox" 
                onChange={(event)=>{trackingID=event.target.value}}
                id="trackinginput" 
                label="Enter Sample ID" 
                variant="outlined" 
                sx={{ m:1, width: WIDTH }}
            />
            <Button 
                className="containedbutton" 
                variant="contained" 
                onClick={() => {trackSample()}}
                sx={{m:1,width: WIDTH}}
            >Search
            </Button>
        </Box>)
    }

    const ShowSample = () => {
        const WIDTH = isMobile ? 400 : 800;
        const INNERWIDTH = isMobile ? 400 : 700;
        const OUTERBOXSHADOW = isMobile ? 0 : 3;

        const rows = [
            {name: 'Stuff1', percentage: '95', mass: '95.0'},
            {name: 'Stuff2', percentage: '5', mass: '5.0'}
        ];

        const SampleBlock = () => {
            return(
                <Box
                    sx={{
                        boxShadow: OUTERBOXSHADOW,
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
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center "
                        alignItems="flex-start"
                        sx={{width: INNERWIDTH, m: 1, mt: 2}}
                    >
                        <Typography sx={{m: 1}} style={{textAlign: "left"}}> Sample: {`${sampleID}`} </Typography>                    
                        <Typography sx={{m: 1}} style={{textAlign: "right"}}> Status: {`${sampleStatus}`}</Typography>
                        <Typography sx={{m: 1}} style={{textAlign: "right"}}> Date Received: {`${sampleDate}`} </Typography>   
                    </Box>
                    {displaySavedMsg && (
                        <Alert severity="success">Your contact information has been saved successfully</Alert>
                    )}
                    {(!displayContactEdit && !displayContactVerify) && 
                    <Button
                        className="outlinedbutton" 
                        variant="outlined" 
                        onClick={() => {setDisplayContactEdit(true)}}
                        sx={{m: 1, width: INNERWIDTH}}
                    >Recieve updates via email/sms
                    </Button>}
                    {displayContactEdit && <ContactDisplay />}
                    {displayContactVerify && <ContactVerify />}
                    {!displayGetMetadata && 
                    <Button
                        className="outlinedbutton" 
                        variant="outlined" 
                        onClick={() => {setDisplayGetMetadata(true)}}
                        sx={{m: 1, mb: 2, width: INNERWIDTH}}
                    >Provide additional information about this sample
                    </Button>}
                    {displayGetMetadata && <GetMetadata />}
                    {(sampleStatus == 'Complete') && <SampleTable />}
                    {(sampleStatus == 'Inconclusive') && <Alert severity='warning' sx={{m:1,mb:2}}>Your sample is currently undergoing further analysis due to inconclusive test results</Alert>}
                    {isMobile && 
                    <Button
                        className="outlinedbutton" 
                        variant="outlined" 
                        onClick={() => {
                            setPageState(0); 
                            setDisplayContactEdit(false); 
                            setDisplayContactVerify(false); 
                            setDisplayGetMetadata(false); 
                            setDisplayError(false); 
                            setDisplaySavedMsg(false)
                        }}
                        sx={{m:1,mb:2, mt: 0,width: INNERWIDTH}}
                    >Search for another sample
                    </Button>}
                </Box>
            )
        }

        const TrackOther = () => {
            return(
                <Box
                    sx={{
                        boxShadow: 3,
                        width: 400,
                        height: 200,
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
                    <Typography style={{ margin: '10px' }}>Search for another sample</Typography>
                    <Box
                        sx={{width: 400}}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="space-between"
                    >
                        <TextField 
                            className="textbox" 
                            onChange={(event)=>{trackingID=event.target.value}}
                            id="trackinginput" 
                            label="Enter Sample ID" 
                            variant="outlined" 
                            style={{ margin: '10px' }}
                        />
                        <Button
                            className="containedbutton" 
                            variant="contained" 
                            onClick={() => {trackSample()}}
                            style={{ margin: '10px' }}
                        >Search
                        </Button>
                    </Box>
                </Box>
            )
        }

        const ResourcesBlock = () => {
            return(
                <Box
                    sx={{
                        boxShadow: 3,
                        width: 400,
                        height: 300,
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
                    <Typography style={{margin: '20px'}}>Resources</Typography>
                </Box>
            )
        } 

        const SampleTable = () => {
            const WIDTH = isMobile ? 400 : 700;
            return(
                <TableContainer component={Paper} sx={{width: WIDTH, m: 2, marginBottom: '40px'}}>
                    <Table sx={{ width: WIDTH - 50, marginBottom: 2 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Chemical component</TableCell>
                            <TableCell align="right">Percentage (%)</TableCell>
                            <TableCell align="right">Mass (mg)</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{`${row.percentage}%`}</TableCell>
                            <TableCell align="right">{`${row.mass} mg`}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }

        return(
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-start"
            >
                <SampleBlock />
                {!isMobile && <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    <TrackOther />
                    {/* <ResourcesBlock /> */}
                </Box>}
            </Box>
        )
    }

    const GetMetadata = () => {
        const WIDTH = isMobile ? 400 : 700;
        return(
            <Box
                sx={{
                    boxShadow: 3,
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
                justifyContent="flex-start"
                alignItems="center"
            >   
                <Typography style={{margin: '10px'}}>Submit additional information about this sample</Typography>
                {/* <TextField 
                    className="textbox" 
                    onChange={(event)=>{expectedContentsField=event.target.value}}
                    id="trackinginput" 
                    label="Expected contents of this sample" 
                    variant="outlined" 
                    sx={{m:1, mb:2, width: WIDTH - 100}}
                /> */}
                <Autocomplete
                    freeSolo
                    disableClearable
                    sx={{m:1,mb:2,width: WIDTH - 100}}
                    options={expectedContentOptions.map((option) => option.value)}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Expected contents of this sample (select or type in your own)"
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                    />
                    )}
                />
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{width: WIDTH - 100}}
                >
                    <Typography style={{margin: '10px'}}>Has this sample been used?</Typography>
                    <Checkbox onClick={(event) => {setSampleUsed(event.target.checked)}}/>
                </Box>
                <Box
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="center"
                    alignItems="center"
                    sx={{width: WIDTH - 100}}
                >
                    <Button
                        className="containedbutton" 
                        variant="contained" 
                        onClick={() => {saveMetadata()}}
                        sx={{m:1,mb:2}}
                    >Save Information
                    </Button>
                    <Button
                        className="outlinedbutton" 
                        variant="outlined" 
                        onClick={() => {setDisplayGetMetadata(false)}}
                        sx={{m:1,mb:2}}
                    >Close without saving
                    </Button>
                </Box>
            </Box>
        )
    }

    const ContactDisplay = () => {
        const WIDTH = isMobile ? 400 : 700;
        return(
            <Box
                sx={{
                    boxShadow: 3,
                    width: WIDTH,
                    height: 'auto',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                    color: (theme) =>
                        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                    p: 1,
                    m: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
            >
                <Typography sx={{m:2}}>Enter your contact info below and receive notifications on the status of this sample</Typography>
                <ToggleButtonGroup
                    value={contactMethod}
                    exclusive
                    onChange={(event, newContactMethod) => {setContactMethod(newContactMethod)}}
                    aria-label="text alignment"
                    sx={{m:2, mt: 0}}
                    >
                    <ToggleButton value="email" aria-label="email">
                        Email <EmailIcon/>
                    </ToggleButton>
                    <ToggleButton value="sms" aria-label="sms">
                        <SmsIcon /> SMS
                    </ToggleButton>
                </ToggleButtonGroup>
                <TextField 
                    className="textbox" 
                    onChange={(event)=>{contactField=event.target.value}}
                    id="trackinginput" 
                    label="Enter new email" 
                    variant="outlined" 
                    style={{ marginBottom: '20px', width: WIDTH - 100}}
                    disabled={contactMethod=='sms'}
                />
                <TextField 
                    className="textbox" 
                    onChange={(event)=>{contactField=event.target.value}}
                    id="trackinginput" 
                    label="Enter new phone number" 
                    variant="outlined" 
                    style={{ marginBottom: '20px', width: WIDTH - 100 }}
                    disabled={contactMethod=='email'}
                />
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{mb:2}}
                >
                    <Button 
                        className="containedbutton"
                        variant="contained" 
                        onClick={() => {editContact()}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Save
                    </Button>
                    <Button 
                        className="outlinedbutton"
                        variant="outlined" 
                        onClick={() => {setDisplayContactEdit(false)}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Close without saving
                    </Button>
                </Box>
            </Box>
        )
    }

    const ContactVerify = () => {
        const WIDTH = isMobile ? 400 : 700;
        return(
            <Box
                sx={{
                    boxShadow: 3,
                    width: WIDTH,
                    height: 'auto',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                    color: (theme) =>
                        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                    p: 1,
                    m: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Typography sx={{m:2, mb:1}}>An OTP (one time password) has been sent to your {(contactMethod == 'email') ? "email" : "phone number"}, enter it in the box below to verify your contact info</Typography>
                <TextField 
                    className="textbox" 
                    onChange={(event)=>{enteredOTP=event.target.value}}
                    id="OTPInput" 
                    label= "Enter verification code"
                    variant="outlined" 
                    sx={{m:2, mb: 1, width: WIDTH - 100}}
                />
                {displayError && (<Alert sx={{m:1}} severity="error">The OTP you entered was incorrect</Alert>)}
                <Box
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button 
                        className="containedbutton" 
                        variant="contained" 
                        onClick={() => {verifyContact()}}
                        sx={{ m: 1, mb: 2 }}
                    >Confirm
                    </Button>
                    <Button 
                        className="outlinedbutton"
                        variant="outlined" 
                        onClick={() => {editContact(); setDisableButton(true); setTimeout(() => {setDisableButton(false)}, 60000)}}
                        sx={{ m: 1, mb: 2 }}
                        disabled={disableButton}
                    >Send Another Code
                    </Button>
                    {displayError && (
                        <Button
                            className="outlinedbutton"
                            variant="outlined" 
                            onClick={() => {setDisplayContactVerify(false); enteredOTP=''; setDisplayError(false)}}
                            sx={{m: 1, mb: 2}}
                            color="error"
                        >Exit without saving  
                        </Button>
                    )}
                </Box>
            </Box>
        )
    }

    return(
        <Box 
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{mt:2}}
        >
            {(pageState == 0) && <TrackingIDInput />}
            {(pageState == 1) && <ShowSample />}
            {/* {(pageState == 2) && <ContactDisplay />}
            {(pageState == 3) && <ContactEdit />}
            {(pageState == 3) && <ContactVerify />} */}
        </Box>
    )
}

export default TrackSample

