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
    Button,
    TableContainer,
    Paper,
    TableCell,
    Table,
    TableHead,
    TableRow,
    TableBody,
    rows,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
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

//check user data and send login request to server
const handleLogin = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#userName").val() == '' || $("#userPass").val() == ''){
        handleError("RAWR! Username or password is empty");
        return false;
    }

    let pass = document.getElementById("userPass").value;
    let user = document.getElementById("userName").value;
    let token = document.getElementById("token").value;

    sendAjax('POST', $("#loginForm").attr("action"),  `&pass=${pass}&username=${user}&_csrf=${token}`, redirect);
 
    return false;
};

//check user data and send new account data to server
const handleSignup = (e) => {
    e.preventDefault();
    
    $("#scoreMessage").animate({width:'hide'}, 350);

    if($("#newUserName").val() == '' || $("#newUserPass").val() == '' ||  $("#newUserConfirmPass").val()== '' ){
        handleError("RAWR! All fields are required");
        return false;
    }

    if($("#newUserPass").val() !== $("#newUserConfirmPass").val()){
        handleError("RAWR! Passwords do not match");
        return false;
    }
    if($("#newUserName").val().length <  4 || $("#newUserPass").val().length <  4 ||  $("#newUserConfirmPass").val().length <  4 ){
        handleError("RAWR! Username and Password must be more than three characters");
        return false;
    }

    let pass = document.getElementById("newUserPass").value;
    let pass2 = document.getElementById("newUserConfirmPass").value;
    let user = document.getElementById("newUserName").value;
    let token = document.getElementById("token").value;

    sendAjax('POST', $("#signupForm").attr("action"), `&username=${user}&pass=${pass}&pass2=${pass2}&_csrf=${token}`, redirect);

    return false;
};

//React component for logging in
const LoginWindow = (props) => {
    return(
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
    <Typography variant="h1" component="h1" gutterBottom>
            Cyber Games
          </Typography>
        <input id="token" type="hidden" name="_csrf" value={props.csrf} />
        <TextField   type="text" id="userName" label="Enter Username" />
        <TextField   type="password" id="userPass" label="Enter Password" />
        <Button id="passButton" type="submit" variant="contained" color="primary">Login</Button>
        </form>

    );
};

//React component for signing up
const SignupWindow = (props) => {
    return(
        <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
         <Typography variant="h1" component="h1" gutterBottom>
            Cyber Games
          </Typography>
        <input id="token" type="hidden" name="_csrf" value={props.csrf} />
        <TextField  type="text" id="newUserName" label="Enter Username" />
        <TextField  type="password" id="newUserPass" label="Enter Password" />
        <TextField  type="password" id="newUserConfirmPass" label="Confirm Password" />
        <Button id="passButton" type="submit" variant="contained" color="primary">Sign up</Button>
  
        </form>
    );
};

//Render react components on page
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    //Render sign up window if user clicks sign up button
    signupButton.addEventListener("click", (e)=> {
        e.preventDefault();
        ReactDOM.render(
            <div style={{ marginTop: 200, }}>
            <Container maxWidth="sm">
            <ThemeProvider theme={theme}>
        
            <CssBaseline />
            <SignupWindow csrf={csrf}/>
       
            </ThemeProvider>
            </Container></div>, document.querySelector('#root')

        );
        return false;
    });

    //Render login window if user clicks login button
    loginButton.addEventListener("click", (e)=> {
        e.preventDefault();
        ReactDOM.render(
        <div style={{ marginTop: 200, }}>
        <Container maxWidth="sm">
        <ThemeProvider theme={theme}>
    
        <CssBaseline />
        <LoginWindow csrf={csrf}/>
   
        </ThemeProvider>
        </Container></div>, document.querySelector('#root')

    );
        return false;
    });

   
    ReactDOM.render(
        <div style={{ marginTop: 200, }}>
        <Container maxWidth="sm">
        <ThemeProvider theme={theme}>

        <CssBaseline />
        <LoginWindow csrf={csrf}/>
   
      </ThemeProvider>
      </Container></div>, document.querySelector('#root')
  
    
    );
};

//get csrf token and call setup function
const getToken = () => {
    sendAjax('GET', '/getToken', null,(result) =>{
        setup(result.csrfToken);
    });
};

//get csrf token when document loads
$(document).ready(function(){
    getToken();
});