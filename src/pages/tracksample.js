import React from 'react';
import { useState } from 'react';

import axios from 'axios'

// import { isMobile } from 'react-device-detect'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Alert, Typography } from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';

import '../css/tracksample.css'
import { SendOTP, VerifyOTP } from '../lambda_Invoke/otpworkers.js';

const rows = [
    {name: 'Stuff1', percentage: '95', mass: '95.0'},
    {name: 'Stuff2', percentage: '5', mass: '5.0'}
];

const isMobile = false;

const TrackSample = () => {
    const [pageState, setPageState] = useState(0); // pageStates = ["enterid", "showsample", "showcontact", "updatecontact", "verifycontact"]
    const [referenceID, setReferenceID] = useState('');
    const [displayError, setDisplayError] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [displaySavedMsg, setDisplaySavedMsg] = useState(false);
    const [newContact, setNewContact] = useState('');
    const [contactMethod, setContactMethod] = useState('email')
    const [sampleID, setSampleID] = useState('');
    const [sampleStatus, setSampleStatus] = useState('');
    const [sampleDate, setSampleDate] = useState('');

    let   trackingID;
    let   contactField;
    let   enteredOTP;

    const trackSample = async () => {
        console.log(`trackingID: ${trackingID}`);
        //query database    
        try{
            console.log('try api')
            const resp = await axios.get(`https://1pgzkwt5w4.execute-api.us-west-2.amazonaws.com/test/samples?tableName=samples&sample-id=${trackingID}`);
            console.log(resp.data);
            setSampleID(resp.data['sample-id']);
            setSampleStatus(resp.data['test-results']);
            setSampleDate(resp.data['date-received']);
            setPageState(1);
        }catch(err){
            // no response -> item doesn't exist
            // load error page
        }
    }

    const editContact = async () => {
        console.log(`contactfield: ${contactField}`);
        console.log('email? ' + contactMethod);
        const OTPInfo = await SendOTP(contactField, (contactMethod == 'email'));
        setNewContact(contactField);
        setReferenceID(OTPInfo.referenceID) // change this to use response from OTPInfo
        setDisplayError(false);
        contactField = '';
        setPageState(3);
    }

    const verifyContact = async () => {
        console.log(`entered OTP: ${enteredOTP}`);
        const verifyResp = await VerifyOTP(newContact, enteredOTP, referenceID);

        if(!verifyResp.valid){
            setDisplayError(true);
            return;
        }

        try{
            //const updateItemResp = await fetch();
            //console.log(updateItemResp)
            setNewContact('');
            setDisplaySavedMsg(true);
            setPageState(1);
        }catch(err){
            console.log(err);
            // should try again or do some thing to fix issue, probably do not want user to know this part went wrong
        }
    }

    const TrackingIDInput = () => {
        return(
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <TextField 
                className="textbox" 
                onChange={(event)=>{trackingID=event.target.value}}
                id="trackinginput" 
                label="Enter Tracking ID" 
                variant="outlined" 
                style={{ marginBottom: '20px', width: 'auto' }}
            />
            <Button 
                className="containedbutton" 
                variant="contained" 
                onClick={() => {trackSample(trackingID)}}
            >Track
            </Button>
        </Box>)
    }

    const ShowSample = () => {

        const SampleBlock = () => {
            return(
                <Box
                    sx={{
                        boxShadow: 3,
                        width: 800,
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
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{width: 700}}
                        marginTop= "20px"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            align-items="flex-start"
                        >
                            <Typography sx={{m: 1}} style={{textAlign: "left"}}> </Typography>
                            <Typography sx={{m: 1}} style={{textAlign: "left"}}> {`${sampleID}`} </Typography>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            align-items="flex-end"
                        >
                            <Typography sx={{m: 1}} style={{textAlign: "right"}}> {`${sampleStatus}`}</Typography>
                            <Typography sx={{m: 1}} style={{textAlign: "right"}}> {`${sampleDate}`} </Typography>
                        </Box>
                    </Box>
                    {displaySavedMsg && (
                        <Alert severity="success">Your contact information has been saved successfully</Alert>
                    )}
                    <Button
                        className="outlinedbutton" 
                        variant="outlined" 
                        onClick={() => {setPageState(2)}}
                        sx={{marginTop: '10px'}}
                    >Opt in to recieve updates via email/sms
                    </Button>
                    <Box
                        sx={{
                            boxShadow: 3,
                            width: 700,
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
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >   
                        <Typography style={{margin: '10px'}}>Submit information about your sample</Typography>
                        <TextField 
                            className="textbox" 
                            onChange={(event)=>{trackingID=event.target.value}}
                            id="trackinginput" 
                            label="Contents of the sample" 
                            variant="outlined" 
                            style={{ margin: '10px', width: "660px" }}
                        />
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{width: 680}}
                        >
                            <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <Typography style={{margin: '10px'}}>Has this sample been used?</Typography>
                                <Switch
                                    defaultChecked
                                    onChange={() => {}}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Box>
                            <Button
                                className="outlinedbutton" 
                                variant="outlined" 
                                onClick={() => {}}
                                style={{margin: '10px'}}
                            >Save Information
                            </Button>
                        </Box>
                    </Box>
                    <SampleTable />
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
                    <Typography style={{ margin: '10px' }}>Track another sample</Typography>
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
                            label="Enter Tracking ID" 
                            variant="outlined" 
                            style={{ margin: '10px' }}
                        />
                        <Button
                            className="containedbutton" 
                            variant="contained" 
                            onClick={() => {trackSample()}}
                            style={{ margin: '10px' }}
                        >Track
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
            return(
                <TableContainer component={Paper} sx={{width: 700, m: 2, marginBottom: '40px'}}>
                    <Table sx={{ width: 650, marginBottom: 2 }} aria-label="simple table">
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
                justifyContent="center"
                alignItems="flex-start"
            >
                <SampleBlock />
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="top"
                    alignItems="flex-start"
                >
                    <TrackOther />
                    <ResourcesBlock />
                </Box>
            </Box>
        )
    }

    const MobileShowSample = () => {
        const SampleBlock = () => {
            return(
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{width: 300, mb: 1, mt: 2}}
                    >
                        <Typography sx={{m: 1}} style={{textAlign: "left"}}> </Typography>
                        <Typography sx={{m: 1}} style={{textAlign: "left"}}> 1234 </Typography>
                        <Typography sx={{m: 1}} style={{textAlign: "left"}}> IN PROGRESS</Typography>
                        <Typography sx={{m: 1}} style={{textAlign: "left"}}> 2023/05/30 </Typography>
                    </Box>
                    {displaySavedMsg && (
                        <Alert severity="success">Your contact information has been saved successfully</Alert>
                    )}
                    <Button
                        className="outlinedbutton" 
                        variant="outlined" 
                        onClick={() => {setPageState(2)}}
                        sx={{marginTop: '10px'}}
                    >Recieve updates via email/sms
                    </Button>
                    <Box
                        sx={{
                            boxShadow: 3,
                            width: 300,
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
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >   
                        <Typography sx={{m: 1}}>Submit information about your sample</Typography>
                        <TextField 
                            className="textbox" 
                            onChange={(event)=>{trackingID=event.target.value}}
                            id="trackinginput" 
                            label="Contents of the sample" 
                            variant="outlined" 
                            sx={{ m: 1 }}
                        />
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            <Typography style={{margin: '10px'}}>Has this sample been used?</Typography>
                            <Switch
                                defaultChecked
                                onChange={() => {}}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Box>
                        <Button
                            className="outlinedbutton" 
                            variant="outlined" 
                            onClick={() => {}}
                            style={{margin: '10px'}}
                        >Save Information
                        </Button>
                    </Box>
                    <SampleTable />
                </Box>
            )
        }

        const TrackOther = () => {
            return(
                <Box
                    sx={{
                        boxShadow: 3,
                        width: 300,
                        height: 200,
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
                    alignItems="flex-start"
                >
                    <Typography style={{ margin: '10px' }}>Track another sample</Typography>
                    <Box
                        sx={{width: 300}}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="space-between"
                    >
                        <TextField 
                            className="textbox" 
                            onChange={(event)=>{trackingID=event.target.value}}
                            id="trackinginput" 
                            label="Enter Tracking ID" 
                            variant="outlined" 
                            sx={{ m: 1 }}
                        />
                        <Button
                            className="containedbutton" 
                            variant="contained" 
                            onClick={() => {trackSample()}}
                            sx={{ m: 1 }}
                        >Track
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
                        width: 300,
                        height: 300,
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
                    alignItems="flex-start"
                >
                    <Typography style={{margin: '20px'}}>Resources</Typography>
                </Box>
            )
        } 

        const SampleTable = () => {
            return(
                <TableContainer component={Paper} sx={{width: 300, m: 2, marginBottom: '40px'}}>
                    <Table sx={{ width: 300, marginBottom: 2 }} aria-label="simple table">
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
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <SampleBlock />
                <Button
                    className="outlinedbutton" 
                    variant="outlined" 
                    onClick={() => {}}
                    sx={{mb:1}}
                >Search for another sample
                </Button>
                {/* <TrackOther />
                <ResourcesBlock /> */}
            </Box>
        )
    }

    const ContactDisplay = () => {
        return(
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Typography>Enter your contact info below and receive notifications on the status of your sample</Typography>
                <Box
                    sx={{
                        boxShadow: 3,
                        width: '600px',
                        height: '250px',
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
                    <ToggleButtonGroup
                        value={contactMethod}
                        exclusive
                        onChange={(event, newContactMethod) => {setContactMethod(newContactMethod)}}
                        aria-label="text alignment"
                        style={{margin: '20px'}}
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
                        style={{ marginBottom: '20px', width: "400px"}}
                        disabled={contactMethod=='sms'}
                    />
                    <TextField 
                        className="textbox" 
                        onChange={(event)=>{contactField=event.target.value}}
                        id="trackinginput" 
                        label="Enter new phone number" 
                        variant="outlined" 
                        style={{ marginBottom: '20px', width: "400px" }}
                        disabled={contactMethod=='email'}
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
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
                        onClick={() => {setPageState(1)}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Exit without saving
                    </Button>
                </Box>
            </Box>
        )
    }

    // const ContactEdit = () => {
    //     return(
    //         <Box
    //             display="flex"
    //             flexDirection="column"
    //             justifyContent="center"
    //             alignItems="center"
    //         >
    //             {displaySavedMsg && (<Alert severity="success">New contact info has been saved</Alert>)}
    //             <TextField 
    //                 className="textbox" 
    //                 onChange={(event)=>{contactField=event.target.value}}
    //                 id="contactInput" 
    //                 label= {(contactMethod == 'email') ? "New Email" : "New Phone Number"} 
    //                 variant="outlined" 
    //                 style={{ marginTop: "20px", marginBottom: '20px' }}
    //             />
    //             <Box
    //                 display="flex"
    //                 flexDirection="row"
    //                 justifyContent="center"
    //                 alignItems="center"
    //             >
    //                 <Button 
    //                     className="containedbutton" 
    //                     variant="contained" 
    //                     onClick={() => {editContact()}}
    //                     style={{ marginLeft: "10px" , marginRight: "10px" }}
    //                 >Verify
    //                 </Button>
    //                 <Button 
    //                     className="outlinedbutton"
    //                     variant="outlined" 
    //                     onClick={() => {setPageState(1); contactField=''; setDisplaySavedMsg(false)}}
    //                     style={{ marginLeft: "10px" , marginRight: "10px" }}
    //                 >Exit
    //                 </Button>
    //             </Box>
    //         </Box>
    //     )
    // }

    const ContactVerify = () => {
        return(
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <p>An OTP (one time password) has been sent to your {(contactMethod == 'email') ? "email" : "phone number"}, enter it in the box below to verify your contact info</p>
                <TextField 
                    className="textbox" 
                    onChange={(event)=>{enteredOTP=event.target.value}}
                    id="OTPInput" 
                    label= "Enter verification code"
                    variant="outlined" 
                    style={{ marginBottom: '20px'}}
                />
                {displayError && (<Alert style={{marginBottom: '20px'}} severity="error">The OTP you entered was incorrect</Alert>)}
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button 
                        className="containedbutton" 
                        variant="contained" 
                        onClick={() => {verifyContact()}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Confirm
                    </Button>
                    <Button 
                        className="outlinedbutton"
                        variant="outlined" 
                        onClick={() => {editContact(); setDisableButton(true); setTimeout(() => {setDisableButton(false)}, 60000)}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                        disabled={disableButton}
                    >Send Another Code
                    </Button>
                    {displayError && (
                        <Button
                            className="outlinedbutton"
                            variant="outlined" 
                            onClick={() => {setPageState(1); enteredOTP=''; setDisplayError(false)}}
                            style={{ marginLeft: "10px" , marginRight: "10px"}}
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
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            {(pageState == 0) && <TrackingIDInput />}
            {((pageState == 1) && !isMobile) && <ShowSample />}
            {((pageState == 1) && isMobile) && <MobileShowSample />}
            {(pageState == 2) && <ContactDisplay />}
            {/* {(pageState == 3) && <ContactEdit />} */}
            {(pageState == 3) && <ContactVerify />}
        </Box>
    )
}

export default TrackSample

