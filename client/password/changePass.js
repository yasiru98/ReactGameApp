// React Material-UI components
const {
  colors,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  createTheme,
  Box,
  SvgIcon,
  Link,
  TextField,
  Button
} = MaterialUI;

// React Material-UI theme styling
const theme = createTheme({
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

// Send password change data to the server
const changePassword = (e) => {
  e.preventDefault();
  let newPassword = document.getElementById("newPass").value;
  let newPassword2 = document.getElementById("newPass2").value;
  let token = document.getElementById("token").value;

  sendAjax('POST', "/changePass", `&newPass=${newPassword}&newPass2=${newPassword2}&_csrf=${token}`, redirect);
};

// Form for password change
function ChangePassForm(props) {
  return (
      <form 
          id="changePass"
          onSubmit={changePassword}
          name="changePass"
          method="POST"
          className="passForm"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: 'auto' }}
      >
          <input id="token" type="hidden" name="_csrf" value={props.csrf} />
          <TextField type="password" id="newPass" label="Enter New Password" fullWidth />
          <TextField type="password" id="newPass2" label="Confirm New Password" fullWidth />
          <Button id="passButton" type="submit" variant="contained" color="primary" fullWidth>
              Change Password
          </Button>
      </form>
  );
}

// Render React components on the page
const setup = function (csrf) {
  ReactDOM.render(
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="sm">
              <Box sx={{ marginTop: 10, textAlign: 'center' }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                      Change Your Password
                  </Typography>
                  <ChangePassForm csrf={csrf} />
              </Box>
          </Container>
      </ThemeProvider>,
      document.querySelector('#root'),
  );
}

// Get CSRF token and call setup function
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
  });
};

// Get CSRF token when document loads
$(document).ready(function () {
  getToken();
});
