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

const TrackSample = () => {
    const [pageState, setPageState] = useState(0); // pageStates = ["enterid", "showcontact", "updatecontact", "verifycontact"]
    const [contactbyemail, setContactByEmail] = useState(true);
    const [contact, setContactState] = useState("N/A");
    let   trackingID;
    let   newContact;

    const trackSample = async () => {
        console.log(`trackingID: ${trackingID}`);
        //query database    
        try{
            console.log('try api')
            const resp = await fetch('https://9gon1waa9a.execute-api.us-west-2.amazonaws.com/getitem');
            console.log(resp);
            // let contactinfo = resp.json(); //grab contact info from item
            setContactState('API_RESP');
            setPageState(1);
        }catch(err){
            // no response -> item doesn't exist
            // load error page
        }
    }

    const editContact = async () => {

    }

    const loadSample = async () => {
        // loads the sample page
        // im not sure how to bring the sample information from this page to the next page
    }

    const TrackingIDInput = () => {
        return(
        <TextField 
            className="textbox" 
            onChange={(event)=>{trackingID=event.target.value}}
            id="trackinginput" 
            label="Enter Tracking ID" 
            variant="outlined" 
            style={{ marginBottom: '20px' }}
        />)
    }

    const TrackingButton = () => {
        return(
        <Button 
            className="trackbutton" 
            variant="contained" 
            onClick={() => {trackSample(trackingID)}}
        >Track
        </Button>)
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
                    <p>email: {contactbyemail ? `${contact}` : 'N/A'}</p>
                    <p>phone: {contactbyemail ? 'N/A' : `${contact}`}</p>
                </Box>
                <Box>
                    <Button 
                        variant="outlined" 
                        onClick={() => {setPageState(2)}}
                        style={{ marginLeft: "10px" , marginRight: "10px" }}
                    >Edit
                    </Button>
                    <Button 
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
            <TextField 
                className="textbox" 
                onChange={(event)=>{newContact=event.target.value}}
                id="contactInput" 
                label= {contactbyemail ? "Enter Email" : "Enter Phone Number"} 
                variant="outlined" 
                style={{ marginBottom: '20px' }}
            />
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
            {(pageState == 0) && <TrackingButton />}
            {(pageState == 1) && <ContactDisplay />}
            {(pageState == 2) && <ContactEdit />}
        </Box>
    )
}

export default TrackSample

