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
    Button = _MaterialUI.Button;
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

var changePassword = function changePassword(e) {
  e.preventDefault();
  var newPassword = document.getElementById("newPass").value;
  var newPassword2 = document.getElementById("newPass2").value;
  var token = document.getElementById("token").value;
  sendAjax('POST', "/changePass", "&newPass=".concat(newPassword, "&newPass2=").concat(newPassword2, "&_csrf=").concat(token), redirect);
};

var useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500
  }
});

function Heading() {
  var classes = useStyles();
  return (/*#__PURE__*/React.createElement("div", {
      className: classes.root
    }, /*#__PURE__*/React.createElement(Typography, {
      variant: "h1",
      component: "h2",
      gutterBottom: true
    }, "Change Password"))
  );
}

function ChangePassForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "changePass",
      onSubmit: changePassword,
      name: "changePass",
      method: "POST",
      className: "passForm"
    }, /*#__PURE__*/React.createElement("input", {
      id: "token",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement(TextField, {
      type: "password",
      id: "newPass",
      label: "Enter New Password"
    }), /*#__PURE__*/React.createElement(TextField, {
      type: "password",
      id: "newPass2",
      label: "Confirm New Password"
    }), /*#__PURE__*/React.createElement(Button, {
      id: "passButton",
      type: "submit",
      variant: "contained",
      color: "primary"
    }, "Change Password"))
  );
}

;

function App(props) {
  return (/*#__PURE__*/React.createElement(Container, {
      maxWidth: "sm"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 200
      }
    }, /*#__PURE__*/React.createElement(Typography, {
      variant: "h4",
      component: "h1",
      gutterBottom: true
    }, "Change Your Password"), /*#__PURE__*/React.createElement(ChangePassForm, {
      csrf: props.csrf
    })))
  );
}

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(App, {
    csrf: csrf
  })), document.querySelector('#root'));
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
