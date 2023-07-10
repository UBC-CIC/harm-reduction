import {useState} from 'react';

import { Box, Alert } from "@mui/material"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { authUser } from '../lambda_Invoke/loginworker.js'
import AdminTable from '../components/admintable.js'

// import { Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

const Admin = () => {
    const [showError, setShowError] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [pageState, setPageState] = useState(0);
    let   username;
    let   password;

    const adminSignin = async () => {
        console.log(`username: ${username}`);
        const authResp = await authUser(username, password);

        if(!authResp.AccessToken){
            setShowError(true);
            return;
        } 
        console.log('successfully authenticated');
        setLoginStatus(true);
    }

    const LoginPage = () => {
        return(
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <TextField
                    className="textbox" 
                    onChange={(event)=>{username=event.target.value}}
                    id="usernameinput" 
                    label="username" 
                    variant="outlined" 
                    sx={{m:1}}
                >
                </TextField>
                <TextField
                    className="textbox" 
                    onChange={(event)=>{password=event.target.value}}
                    id="pwinput" 
                    label="password" 
                    type="password"
                    variant="outlined" 
                    sx={{m:1}}
                >
                </TextField>
                {showError && (
                    <Alert severity="error">Your username or password are incorrect, please contact the system admin to reset your password</Alert>
                )}
                <Button 
                    className="containedbutton"
                    variant="contained" 
                    onClick={() => {adminSignin()}}
                    sx={{m:1}}
                >Login
                </Button>
            </Box>
        )
    }

    return(
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            style={{marginTop: '20px'}}
        >
            {!loginStatus && <LoginPage/>}
            {(loginStatus && (pageState == 0)) && <AdminTable />}
        </Box>
    )
}

export default Admin