"use strict";

//React material UI compomemts
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
    Button = _MaterialUI.Button; //React material UI theme styling

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
}); //send password change data to server

var changePassword = function changePassword(e) {
  e.preventDefault();
  var newPassword = document.getElementById("newPass").value;
  var newPassword2 = document.getElementById("newPass2").value;
  var token = document.getElementById("token").value;
  sendAjax('POST', "/changePass", "&newPass=".concat(newPassword, "&newPass2=").concat(newPassword2, "&_csrf=").concat(token), redirect);
}; //React material UI component styling


var useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500
  }
}); //for for password change data

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

; //App containing react components

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
} //Render react components on page


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(App, {
    csrf: csrf
  })), document.querySelector('#root'));
}; //get csrf token and call setup function


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //get csrf token when document loads


$(document).ready(function () {
  getToken();
});
"use strict";

//show error message to user
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#monsterMessage").animate({
    width: 'toggle'
  }, 350);
}; //redirect to page


var redirect = function redirect(response) {
  $("#monsterMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
}; //send requests to the server


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
