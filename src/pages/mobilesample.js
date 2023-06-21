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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Alert, Typography } from '@mui/material';

const MobileSample = () => {
    const [pageState, setPageState] = useState(0); // pageStates = ["enterid", "showsample", "showcontact", "updatecontact", "verifycontact"]
    const [referenceID, setReferenceID] = useState('');
    const [displayError, setDisplayError] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [displaySavedMsg, setDisplaySavedMsg] = useState(false);
    const [newContact, setNewContact] = useState('');
    const [contactMethod, setContactMethod] = useState('email')
    let   trackingID;
    let   contactField;
    let   enteredOTP;
    let   sampleInfo;

    const trackSample = () => {
        console.log(`trackingID: ${trackingID}`);
        //query database    
        try{
            console.log('try api')
            // const resp = await fetch('https://9gon1waa9a.execute-api.us-west-2.amazonaws.com/getitem');
            // let contactinfo = resp.json(); //grab contact info from item
            setPageState(1);
        }catch(err){
            // no response -> item doesn't exist
            // load error page
        }
    }

    const TrackInput = () => {
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
            </Box>
        )
    }

    const ShowSample = () => {

    }

    const ShowContact = () => {

    }

    const VerifyContact = () => {

    }

    return(
        <Box 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            {(pageState == 0) && <TrackInput />}
            {(pageState == 1) && <ShowSample />}
            {(pageState == 2) && <ShowContact />}
            {(pageState == 3) && <VerifyContact />}
        </Box>
    )
}

export default MobileSample