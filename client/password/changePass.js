//React material UI compomemts
const {
    colors,
    CssBaseline,
    ThemeProvider,
    Typography,
    Container,
    makeStyles,
    createMuiTheme,
    Box,
    SvgIcon,
    Link,
    TextField,
    Button
  } = MaterialUI;

  //React material UI theme styling
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#55acee',
      },
      secondary: {
        main: '#19857b',
      },
      error: {
        main: colors.red.A400,
      },
      background: {
        default: '#fff',
      },
    },
  });

  //send password change data to server
const changePassword = (e) => {
	e.preventDefault();
    let newPassword = document.getElementById("newPass").value;  
    let newPassword2 = document.getElementById("newPass2").value; 
    let token = document.getElementById("token").value; 

    sendAjax('POST', "/changePass", `&newPass=${newPassword}&newPass2=${newPassword2}&_csrf=${token}`, redirect);

};


//React material UI component styling
const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500,
  },
});



//for for password change data
function ChangePassForm(props) {
    return(

           <form id="changePass"
           onSubmit={changePassword}
           name="changePass"
  
           method="POST"
           className="passForm">
            <input id="token" type="hidden" name="_csrf" value={props.csrf} />
            <TextField   type="password" id="newPass" label="Enter New Password" />
            <TextField   type="password" id="newPass2" label="Confirm New Password" />
            <Button id="passButton" type="submit" variant="contained" color="primary">Change Password</Button>
        </form>
    );
};

  
//Render react components on page
const setup = function(csrf) {
    ReactDOM.render(
        <ThemeProvider theme={theme}>

        <CssBaseline />
        <Container maxWidth="sm">
        <div style={{ marginTop: 200, }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Change Your Password
          </Typography>
        <ChangePassForm csrf={csrf}/>
        
        </div>
      </Container>
   
      </ThemeProvider>, document.querySelector('#root'),

    
    );

}

//get csrf token and call setup function
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//get csrf token when document loads
$(document).ready(function(){
    getToken();
});