import {useState} from 'react';

import { Box } from "@mui/material"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Admin = () => {
    const [showPW, setShowPW] = useState(false);
    let   username;
    let   password;

    const adminSignin = async () => {
        
    }

    return(
    <Box
        style={{marginTop: "20px"}}
    >
        <Authenticator>
            {({ signOut, user }) => (
                <main>
                <h1>Logged in as: {user.username}</h1>
                <button onClick={() => {}}>Sign out</button>
                </main>
            )}
        </Authenticator>
    </Box>)
}

export default Admin