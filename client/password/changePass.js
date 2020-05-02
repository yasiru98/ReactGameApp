
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

const changePassword = (e) => {
	e.preventDefault();
    let newPassword = document.getElementById("newPass").value;  
    let newPassword2 = document.getElementById("newPass2").value; 
    let token = document.getElementById("token").value; 

    sendAjax('POST', "/changePass", `&newPass=${newPassword}&newPass2=${newPassword2}&_csrf=${token}`, redirect);

};



const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500,
  },
});

function Heading() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h1" component="h2" gutterBottom>
        Change Password
      </Typography>
    </div>
  );
}

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
function App(props) {
    return (
      <Container maxWidth="sm">
        <div style={{ marginTop: 200, }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Change Your Password
          </Typography>
        <ChangePassForm csrf={props.csrf}/>
        
        </div>
      </Container>
    );
  }
  

const setup = function(csrf) {
    ReactDOM.render(
        <ThemeProvider theme={theme}>

        <CssBaseline />
        <App csrf={csrf}/>
   
      </ThemeProvider>, document.querySelector('#root'),
    
  
    
    );



}
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});