import React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import '../css/tracksample.css'

const TrackSample = () => {
    const [pageState, setPageState] = useState(0);
    const pageStates = ["enterid", "showcontact", "updatecontact", "verifycontact"]
    let   trackingID;

    const trackSample = async () => {
        console.log(`trackingID: ${trackingID}`);
        //query database    
        try{
            const resp = await fetch('https://9gon1waa9a.execute-api.us-west-2.amazonaws.com/getitem');
            // let contactinfo = resp.json(); //grab contact info from item
            // load contact info
            setPageState(1);
        }catch(err){
            // no response -> item doesn't exist
            // load error page
        }
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
            {/* <TextField className="textbox" onChange={event=>{setTrackingID(event.target.value)}}id="trackinginput" label="Enter Tracking ID" variant="outlined" style={{ marginBottom: '20px' }}/>    
            <Button className="trackbutton" variant="contained" onClick={() => {trackSample(trackingID)}}>Track</Button> */}
        </Box>
    )
}

export default TrackSample

