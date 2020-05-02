"use strict";

var _MaterialUI = MaterialUI,
    colors = _MaterialUI.colors,
    CssBaseline = _MaterialUI.CssBaseline,
    ThemeProvider = _MaterialUI.ThemeProvider,
    Typography = _MaterialUI.Typography,
    Container = _MaterialUI.Container,
    makeStyles = _MaterialUI.makeStyles,
    createMuiTheme = _MaterialUI.createMuiTheme,
    Box = _MaterialUI.Box,
    SvgIcon = _MaterialUI.SvgIcon,
    Link = _MaterialUI.Link,
    TextField = _MaterialUI.TextField,
    Button = _MaterialUI.Button,
    TableContainer = _MaterialUI.TableContainer,
    Paper = _MaterialUI.Paper,
    TableCell = _MaterialUI.TableCell,
    Table = _MaterialUI.Table,
    TableHead = _MaterialUI.TableHead,
    TableRow = _MaterialUI.TableRow,
    TableBody = _MaterialUI.TableBody,
    rows = _MaterialUI.rows,
    Grid = _MaterialUI.Grid,
    Card = _MaterialUI.Card,
    CardActionArea = _MaterialUI.CardActionArea,
    CardMedia = _MaterialUI.CardMedia,
    CardContent = _MaterialUI.CardContent,
    CardActions = _MaterialUI.CardActions;
var theme = createMuiTheme({
  palette: {
    primary: {
      main: '#55acee'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: colors.red.A400
    },
    background: {
      "default": '#fff'
    }
  }
});

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#userName").val() == '' || $("#userPass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  var pass = document.getElementById("userPass").value;
  var user = document.getElementById("userName").value;
  var token = document.getElementById("token").value;
  sendAjax('POST', $("#loginForm").attr("action"), "&pass=".concat(pass, "&username=").concat(user, "&_csrf=").concat(token), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#scoreMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#newUserName").val() == '' || $("#newUserPass").val() == '' || $("#newUserConfirmPass").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#newUserPass").val() !== $("#newUserConfirmPass").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  if ($("#newUserName").val().length < 4 || $("#newUserPass").val().length < 4 || $("#newUserConfirmPass").val().length < 4) {
    handleError("RAWR! Username and Password must be more than three characters");
    return false;
  }

  var pass = document.getElementById("newUserPass").value;
  var pass2 = document.getElementById("newUserConfirmPass").value;
  var user = document.getElementById("newUserName").value;
  var token = document.getElementById("token").value;
  sendAjax('POST', $("#signupForm").attr("action"), "&username=".concat(user, "&pass=").concat(pass, "&pass2=").concat(pass2, "&_csrf=").concat(token), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement(Typography, {
      variant: "h1",
      component: "h1",
      gutterBottom: true
    }, "Cyber Games"), /*#__PURE__*/React.createElement("input", {
      id: "token",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement(TextField, {
      type: "text",
      id: "userName",
      label: "Enter Username"
    }), /*#__PURE__*/React.createElement(TextField, {
      type: "password",
      id: "userPass",
      label: "Enter Password"
    }), /*#__PURE__*/React.createElement(Button, {
      id: "passButton",
      type: "submit",
      variant: "contained",
      color: "primary"
    }, "Login"))
  );
};

var SignupWindow = function SignupWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement(Typography, {
      variant: "h1",
      component: "h1",
      gutterBottom: true
    }, "Cyber Games"), /*#__PURE__*/React.createElement("input", {
      id: "token",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement(TextField, {
      type: "text",
      id: "newUserName",
      label: "Enter Username"
    }), /*#__PURE__*/React.createElement(TextField, {
      type: "password",
      id: "newUserPass",
      label: "Enter Password"
    }), /*#__PURE__*/React.createElement(TextField, {
      type: "password",
      id: "newUserConfirmPass",
      label: "Confirm Password"
    }), /*#__PURE__*/React.createElement(Button, {
      id: "passButton",
      type: "submit",
      variant: "contained",
      color: "primary"
    }, "Sign up"))
  );
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    ReactDOM.render( /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 200
      }
    }, /*#__PURE__*/React.createElement(Container, {
      maxWidth: "sm"
    }, /*#__PURE__*/React.createElement(ThemeProvider, {
      theme: theme
    }, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(SignupWindow, {
      csrf: csrf
    })))), document.querySelector('#root'));
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    ReactDOM.render( /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 200
      }
    }, /*#__PURE__*/React.createElement(Container, {
      maxWidth: "sm"
    }, /*#__PURE__*/React.createElement(ThemeProvider, {
      theme: theme
    }, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(LoginWindow, {
      csrf: csrf
    })))), document.querySelector('#root'));
    return false;
  });
  ReactDOM.render( /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 200
    }
  }, /*#__PURE__*/React.createElement(Container, {
    maxWidth: "sm"
  }, /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  })))), document.querySelector('#root'));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#monsterMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#monsterMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
