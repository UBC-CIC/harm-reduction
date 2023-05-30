import React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';

import '../css/tracksample.css'
import {SendOTP, VerifyOTP} from '../lambda_Invoke/otpworkers.js';

const TrackSample = () => {
    const [pageState, setPageState] = useState(0); // pageStates = ["enterid", "showcontact", "updatecontact", "verifycontact"]
    const [contactbyemail, setContactByEmail] = useState(true);
    const [contact, setContactState] = useState("N/A");
    const [referenceID, setReferenceID] = useState('');
    const [displayError, setDisplayError] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [displaySavedMsg, setDisplaySavedMsg] = useState(false);
    let   trackingID;
    let   newContact;
    let   enteredOTP;

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
        console.log(newContact);
        console.log(contactbyemail);
        const OTPInfo = await SendOTP(newContact, contactbyemail);
        setReferenceID(OTPInfo.referenceID) // change this to use response from OTPInfo
        setDisplayError(false);
        setPageState(3);
    }

    const verifyContact = async () => {
        console.log(enteredOTP);
        const verifyResp = await VerifyOTP(newContact, enteredOTP, referenceID, contactbyemail);
        // if success
        // if(!verifyResp) setDisplayError(true); //if OTP is incorrect

        try{
            //const updateItemResp = await fetch();
            //console.log(updateItemResp)
            setPageState(1);
        }catch(err){
            console.log(err);
            // should try again or do some thing to fix issue, probably do not want user to know this part went wrong
        }
    }

    const loadSample = async () => {
        // loads the sample page
        // im not sure how to bring the sample information from this page to the next page
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

    const ContactDisplay = () => {
        return(
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <p>The status of your sample is available on this website.</p>
                <p>Update the contact information below to also receive updates via either SMS or email</p>
                <Box
                    sx={{
                        boxShadow: 3,
                        width: '600px',
                        height: '200px',
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
                    <ToggleButtonGroup
                    value={contactbyemail}
                    exclusive
                    aria-label="contactmethod"
                    >
                        <ToggleButton value="email" aria-label="email" onClick={() => setContactByEmail(true)}>
                            <EmailIcon />
                        </ToggleButton>
                        <ToggleButton value="phone" aria-label="phone" onClick={() => setContactByEmail(false)}>
                            <SmsIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {contactbyemail && <p>email: {contact}</p>}
                    {!contactbyemail && <p>phone: {contact}</p>}
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button 
                        className="outlinedbutton"
                        variant="outlined" 
                        onClick={() => {setPageState(2)}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Edit
                    </Button>
                    <Button 
                        className="containedbutton"
                        variant="contained" 
                        onClick={() => {loadSample()}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Track Sample
                    </Button>
                </Box>
            </Box>
        )
    }

    const ContactEdit = () => {
        return(
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <TextField 
                    className="textbox" 
                    onChange={(event)=>{newContact=event.target.value}}
                    id="contactInput" 
                    label= {contactbyemail ? "New Email" : "New Phone Number"} 
                    variant="outlined" 
                    style={{ marginBottom: '20px' }}
                />
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
                    >Verify
                    </Button>
                    <Button 
                        className="outlinedbutton"
                        variant="outlined" 
                        onClick={() => {setPageState(1); newContact=''}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Exit
                    </Button>
                </Box>
            </Box>
        )
    }

    const ContactVerify = () => {
        return(
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <p>An OTP (one time password) has been sent to your {contactbyemail ? "email" : "phone number"}, enter it in the box below to verify your contact info</p>
                <TextField 
                    className="textbox" 
                    onChange={(event)=>{enteredOTP=event.target.value}}
                    id="OTPInput" 
                    label= "Enter verification code"
                    variant="outlined" 
                    style={{ marginBottom: '20px' }}
                />
                {displayError && (
                    <p color="error">The OTP you entered was incorrect</p>
                )}
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
                        onClick={() => {verifyContact(); setDisableButton(true); setTimeout(() => {setDisableButton(false)}, 60000)}}
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
            {(pageState == 1) && <ContactDisplay />}
            {(pageState == 2) && <ContactEdit />}
            {(pageState == 3) && <ContactVerify />}
        </Box>
    )
}

export default TrackSample

