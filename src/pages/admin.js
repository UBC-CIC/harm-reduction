import { useState, useEffect } from 'react';

import { Box, Alert } from "@mui/material"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdminTable from '../components/admintable.js'

import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

const Admin = () => {
    const [showError, setShowError] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [pageState, setPageState] = useState(0);
    const [jwtToken, setJwtToken] = useState('');
    let   username;
    let   password;

    const poolData = {
        UserPoolId: process.env.REACT_APP_USER_POOL_ID,
        ClientId: process.env.REACT_APP_COGCLIENT,
    };

    const userPool = new CognitoUserPool(poolData);

    const checkExistingSession = () => {
        // Check for existing session when the component mounts
        const cognitoUser = userPool.getCurrentUser();
    
        if (cognitoUser) {
          cognitoUser.getSession((err, session) => {
            if (err) {
              setLoginStatus(false);
            } else {
              const jwtToken = session.getIdToken().getJwtToken();
              setJwtToken(jwtToken); 
              setLoginStatus(true);
            }
          });
        }
      };

    useEffect(() => {
        checkExistingSession();
      }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    const adminSignin = async () => {
        const authenticationData = {
            Username: username,
            Password: password,
          };
        
          const authenticationDetails = new AuthenticationDetails(authenticationData);
        
          const userData = {
            Username: username,
            Pool: userPool,
          };
        
          const cognitoUser = new CognitoUser(userData);
        
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
              const jwtToken = session.getIdToken().getJwtToken();
              setJwtToken(jwtToken); // Add this state to store the JWT token
              setLoginStatus(true);
            },
            onFailure: (err) => {
              setShowError(true);
            },
          });
    }

    const adminSignout = () => {
        const cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.signOut();
            setLoginStatus(false);
        }
    };

    const LogoutButton = () => {
        return (
            <Button 
                className="containedbutton"
                variant="contained" 
                onClick={() => {adminSignout()}}
                sx={{m:1}}
            >
                Sign Out
            </Button>
        );
    };

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
            style={{ marginTop: '20px' }}
        >
            {!loginStatus && <LoginPage />}
            {(loginStatus && (pageState === 0)) && (
                <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                        <LogoutButton />
                    </div>
                    <AdminTable jwtToken={jwtToken}/>
                </div>
            )}
        </Box>
    )
}

export default Admin