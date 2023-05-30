import {useState} from 'react';

import { Box } from "@mui/material"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Admin = () => {
    const [showError, setShowError] = useState(false);
    let   username;
    let   password;

    const adminSignin = async () => {
        
    }

    return(
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
    >
        <TextField
            className="textbox" 
            onChange={(event)=>{username=event.target.value}}
            id="usernameinput" 
            label="username" 
            variant="outlined" 
            style={{ marginBottom: '20px' }}
        >
        </TextField>
        <TextField
            className="textbox" 
            onChange={(event)=>{password=event.target.value}}
            id="pwinput" 
            label="password" 
            type="password"
            variant="outlined" 
            style={{ marginBottom: '20px' }}
        >
        </TextField>
        {showError && (
            <p color="error">Your username or password are incorrect, please contact the system admin to reset your password</p>
        )}
        <Button 
            className="containedbutton"
            variant="contained" 
            onClick={() => {adminSignin()}}
            style={{ marginLeft: "10px" , marginRight: "10px" }}
        >Login
        </Button>
    </Box>)
}

export default Admin