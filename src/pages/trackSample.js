import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import '../css/tracksample.css'

const TrackSample = () => {
    let trackingID;

    return(
        <Box 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <TextField className="textbox" onChange={event=>{trackingID=event.target.value}}id="trackinginput" label="Enter Tracking ID" variant="outlined" style={{ marginBottom: '20px' }}/>    
            <Button className="trackbutton" variant="contained" onClick={() => {trackSample(trackingID)}}>Track</Button>
        </Box>
    )
}

async function trackSample(trackingID){
    console.log(trackingID);
    //query database

    let contactInfo = {
        email: '',
        phone: ''
    }
    
    try{
        //call api for querying database
    }catch(err){
        
    }

    //if id exists -> grab contact info and display
    //if id doesnt exist -> display error screen
}

export default TrackSample

