import React from 'react';
import { useState } from 'react';
import { flexbox } from '@mui/system'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';

import '../css/tracksample.css'
import { SendOTP, VerifyOTP } from '../lambda_Invoke/otpworkers.js';
import { Switch, Alert, Card, CardContent, Divider, LinearProgress, Typography } from '@mui/material';

const TrackSample = () => {
    const [pageState, setPageState] = useState(0); // pageStates = ["enterid", "showsample", "showcontact", "updatecontact", "verifycontact"]
    const [contact, setContactState] = useState("N/A");
    const [referenceID, setReferenceID] = useState('');
    const [displayError, setDisplayError] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [displaySavedMsg, setDisplaySavedMsg] = useState(false);
    const [newContact, setNewContact] = useState('');
    let   trackingID;
    let   contactField;
    let   enteredOTP;
    let   sampleInfo;

    const [contactMethod, setContactMethod] = useState('email')
    const handleContactMethod = (event, newContactMethod) => {
        console.log(newContactMethod);
        setContactMethod(newContactMethod);
    };


    const trackSample = async () => {
        console.log(`trackingID: ${trackingID}`);
        //query database    
        try{
            console.log('try api')
            // const resp = await fetch('https://9gon1waa9a.execute-api.us-west-2.amazonaws.com/getitem');
            // let contactinfo = resp.json(); //grab contact info from item
            setContactState('PLACEHOLDER_RESPONSEFROMDATABASE');
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
                style={{ marginBottom: '20px' }}
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
                        height: 800,
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
                            <Typography sx={{m: 1}} style={{textAlign: "left"}}> Sample Name</Typography>
                            <Typography sx={{m: 1}} style={{textAlign: "left"}}> 12345678 </Typography>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            align-items="flex-end"
                        >
                            <Typography sx={{m: 1}} style={{textAlign: "right"}}> status</Typography>
                            <Typography sx={{m: 1}} style={{textAlign: "right"}}> 2023/05/30 </Typography>
                        </Box>
                    </Box>
                    {displaySavedMsg && (
                        <Alert severity="success">Your contact information has been saved successfully</Alert>
                    )}
                    {/* <hr style={{border: 0, clear: "both", display: "block", width: "700px", backgroundColor: "back", height: "1px"}}></hr> 
                    <Box
                        sx={{
                            width:"600px",
                            height: "10px"
                        }}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                    >
                        <LinearProgress variant="determinate" value={100}/>
                        <Typography>Status</Typography>
                    </Box>
                    <Box
                        sx={{
                            boxShadow: 3,
                            width: 600,
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
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                    </Box> */}
                    <Box
                        sx={{
                            boxShadow: 3,
                            width: 700,
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
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >   
                        <Typography style={{marginTop: '10px', marginLeft: '20px'}}>Information about your sample</Typography>
                        <TextField 
                            className="textbox" 
                            onChange={(event)=>{trackingID=event.target.value}}
                            id="trackinginput" 
                            label="Contents of the sample" 
                            variant="outlined" 
                            style={{ margin: '20px', width: "600px" }}
                        />
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            <Typography style={{marginLeft: '20px'}}>Did you use this substance</Typography>
                            <Switch
                                defaultChecked
                                onChange={() => {}}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <Button
                                className="outlinedbutton" 
                                variant="outlined" 
                                onClick={() => {}}
                                style={{marginLeft: '10px'}}
                            >Save Information
                            </Button>
                        </Box>
                    </Box>
                    <Button
                        className="outlinedbutton" 
                        variant="outlined" 
                        onClick={() => {setPageState(2)}}
                    >Opt in to recieve updates via email/sms
                    </Button>
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
                    <Typography style={{ marginLeft: '20px', marginBottom: '10px' }}>Track another sample</Typography>
                    <TextField 
                        className="textbox" 
                        onChange={(event)=>{trackingID=event.target.value}}
                        id="trackinginput" 
                        label="Enter Tracking ID" 
                        variant="outlined" 
                        style={{ marginLeft: '20px', marginBottom: '10px' }}
                    />
                    <Button
                        className="containedbutton" 
                        variant="contained" 
                        onClick={() => {setPageState(2)}}
                        style={{ marginLeft: '20px', marginBottom: '10px' }}
                    >Track
                    </Button>
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
                    justifyContent="center"
                    alignItems="center"
                >
                </Box>
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
                    style={{ marginBottom: '20px' }}
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
            {(pageState == 1) && <ShowSample />}
            {(pageState == 2) && <ContactDisplay />}
            {/* {(pageState == 3) && <ContactEdit />} */}
            {(pageState == 3) && <ContactVerify />}
        </Box>
    )
}

export default TrackSample

