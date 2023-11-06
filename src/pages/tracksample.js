import React from 'react';
import { useState } from 'react';
import { isMobile } from 'react-device-detect'
import InputMask from 'react-input-mask';
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

const REGION = process.env.REACT_APP_AWS_REGION;
const DB_APIurl = process.env.REACT_APP_DB_API_URL;
const OTP_APIurl = process.env.REACT_APP_OTP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const TrackSample = () => {
    const [pageState,     setPageState]     = useState(0); 
    const [referenceID,   setReferenceID]   = useState('');
    const [newContact,    setNewContact]    = useState('');
    const [contactMethod, setContactMethod] = useState('email')
    
    const [displayError,         setDisplayError]         = useState(false);
    const [disableButton,        setDisableButton]        = useState(false);
    const [displaySavedMsg,      setDisplaySavedMsg]      = useState(false);
    const [displayContactEdit,   setDisplayContactEdit]   = useState(false);
    const [displayContactVerify, setDisplayContactVerify] = useState(false);
    const [displayGetMetadata,   setDisplayGetMetadata]   = useState(false);
    
    const [sampleID,       setSampleID]       = useState('');
    const [sampleStatus,   setSampleStatus]   = useState('');
    const [sampleDate,     setSampleDate]     = useState('');
    const [sampleNotes,    setSampleNotes]    = useState('');
    const [sampleUsed,     setSampleUsed]     = useState(false);
    const [sampleTable,    setSampleTable]    = useState([]);
    const [contentOptions, setContentOptions] = useState([]);
    const [expectedContentsField, setExpectedContentsField] = useState('');
    
    let   trackingID;
    let   contactField;
    let   enteredOTP;

    const getOptions = async () => {
        try{
            const resp = await axios.get(DB_APIurl + 'samples?tableName=harm-reduction-samples', {
                headers: {
                  'x-api-key': API_KEY,
                }
              });

            const data = resp.data;
            setContentOptions([...new Set(data.map((sample) => sample['expected-content']))])
        }catch(err){
            setContentOptions(['Cocaine', 'MDMA', 'Methamphetamine', 'Adderall'])
        }
    }

    const trackSample = async () => {
        let sampleID = trackingID.trim();
        sampleID = sampleID.toUpperCase();
        if(!(/^[a-zA-Z0-9\s]{1,12}$/.test(sampleID))){
            setDisplayError(true);
            return;
        }
        getOptions();
        try{
            const resp = await axios.get(DB_APIurl + `samples?tableName=harm-reduction-samples&sample-id=${sampleID}`, {
                headers: {
                  'x-api-key': API_KEY,
                }
              });
            setSampleID(resp.data['sample-id']);
            (resp.data['status'] === 'Manual Testing Required') ? setSampleStatus('Pending') : setSampleStatus(resp.data['status']);
            setSampleDate(resp.data['date-received']);
            setSampleNotes(resp.data['notes']);
            if(resp.data['status'] == 'Complete') setSampleTable(getSampleTableData(resp.data['test-results']));

            if(resp.data['is-used'] == 'Pending' || resp.data['expected-content'] == 'Pending' || 
                !resp.data['is-used'] || !resp.data['expected-content']){
                    setDisplayGetMetadata(true);
            }
            else setDisplayGetMetadata(false);

            setDisplayContactEdit(false);
            setDisplayContactVerify(false);
            setDisplayError(false);
            setPageState(1);
        }catch(err){
            setDisplayError(true);
        }
    }

    const saveMetadata = async () => {
        setDisplayGetMetadata(false);

        try{
            const getresp = await axios.get(DB_APIurl + `samples?tableName=harm-reduction-samples&sample-id=${sampleID}`, {
                headers: {
                  'x-api-key': API_KEY,
                }
              });

            const item = getresp.data;
            const resp = await axios.put(DB_APIurl + `samples?tableName=samples`,{
                "status": item['status'],
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
            },
            {
                headers: {
                  'x-api-key': API_KEY,
                }
            });
            setExpectedContentsField('');
            setSampleUsed(false);
        }catch(err){
            console.log(err);
        }

    }

    const editContact = async () => {
        let recipient = contactField.trim();
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phoneRegex = /^\+?[0-9]{1,3}[-.\s]?\(?[0-9]{1,3}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}$/;
        const valid = (contactMethod === 'email') ? emailRegex.test(recipient) : phoneRegex.test(recipient);
        if(!valid){
            setDisplayError(true);
            return;
        }

        const OTPInfo = await axios.post(OTP_APIurl + `otp?action=send`,{
            "recipient": recipient,
            "contactbyemail": (contactMethod == 'email'),
        },
        {
            headers: {
              'x-api-key': API_KEY,
            }
        });

        setNewContact(contactField);
        setReferenceID(OTPInfo.data.refID);
        
        setDisplayError(false);
        contactField = '';
        setDisplayContactEdit(false);
        setDisplayContactVerify(true);
    }

    const verifyContact = async () => {
        let OTP = enteredOTP.trim();
        if(!(/^.{6}$/.test(enteredOTP))){
            setDisplayError(true);
            return;
        }
        
        const verifyResp = await axios.post(OTP_APIurl + `otp?action=verify`, {
            "recipient": newContact,
            "userOTP": OTP,
            "userRefID": referenceID
        }, {
            headers: {
              'x-api-key': API_KEY,
            }
        })

        if(!verifyResp.data.valid){
            setDisplayError(true);
            return;
        }

        try{
            const updateContactResp = await axios.put(DB_APIurl + `users?tableName=harm-reduction-users`, {
                "sample-id": sampleID,
                "contact": newContact,
            }, 
            {
                headers: {
                  'x-api-key': API_KEY,
                }
            });

            setNewContact('');
            setDisplaySavedMsg(true);
            setDisplayContactVerify(false);
        }catch(err){
            console.log(err);
        }
    }

    const getSampleTableData = (inputStr) => {
        const entries = inputStr.split(',');
        const output  = entries.map((entry) => {
            const splitIndex = entry.lastIndexOf(' ');
            const name = entry.substring(0, splitIndex);
            const percentage = entry.substring(splitIndex+1);
            return {name: name, percentage: percentage}
        });
        return output;
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
            {displayError && <Alert sx={{m:1}}severity='error'> The sample ID you entered is invalid</Alert>}
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
                        <Typography sx={{m: 1}} style={{textAlign: "left"}}> Sample ID: {`${sampleID}`} </Typography>                    
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
                        onClick={() => {setDisplayContactEdit(true); setDisplaySavedMsg(false)}}
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
                <TableContainer component={Paper} sx={{width: WIDTH, m: 2, mb:4}} >
                    <Table sx={{ width: WIDTH - 40, m:2 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight:'bold'}}>Chemical Component</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}align="right">Percentage by Mass (%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {sampleTable.map((row) => (
                            <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell align="right">{row.percentage}</TableCell>
                            </TableRow>
                        ))}
                            <TableRow>
                                <TableCell sx={{fontWeight:'bold'}}>Notes:</TableCell>
                                <TableCell align="right">{sampleNotes}</TableCell>
                            </TableRow>
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
                <Autocomplete
                    freeSolo
                    sx={{width: WIDTH - 100, m:1}}
                    disableClearable
                    options={Array.from(contentOptions)}
                    value={expectedContentsField}
                    onChange={(event, value) => setExpectedContentsField(value)}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Expected contents of the sample"
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
                    <Checkbox
                    sampleUsed = {sampleUsed} 
                    onClick = {(event) => {setSampleUsed(event.target.checked)}}/>
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
        const { value, onChange, ...otherProps } = [];
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
                        Email <EmailIcon sx={{ml:1}}/>
                    </ToggleButton>
                    <ToggleButton value="sms" aria-label="sms">
                        <SmsIcon sx={{mr:1}}/> SMS
                    </ToggleButton>
                </ToggleButtonGroup>
                {displayError && <Alert severity="error" sx={{m:1, mt:0}}>The contact info you entered is invalid</Alert>}
                {(contactMethod == 'email') && <TextField 
                    className="textbox" 
                    onChange={(event)=>{contactField=event.target.value}}
                    id="trackinginput" 
                    label="Enter your email here" 
                    variant="outlined" 
                    sx={{ mb:2, width: WIDTH - 100}}
                />}
                {(contactMethod == 'sms') && <InputMask
                    mask="+1 (999) 999-9999"
                    onChange={(event) => contactField=event.target.value}
                    maskChar=''
                    id="trackinginput"
                    >
                    {() => (
                        <TextField
                        sx={{mb:2, width: WIDTH - 100}}
                        variant="outlined"
                        label="Enter your phone number here"
                        />
                    )}
                </InputMask>}
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
                        onClick={() => {setDisplayContactEdit(false); setDisplayError(false)}}
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
                            onClick={() => {setDisplayContactVerify(false); enteredOTP=''; setDisplayError(false)}}
                            sx={{m: 1, mb: 2}}
                            color="error"
                        >Exit without saving  
                    </Button>
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
            {(pageState === 0) && <TrackingIDInput />}
            {(pageState === 1) && <ShowSample />}
        </Box>
    )
}

export default TrackSample

