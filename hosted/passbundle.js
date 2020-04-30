"use strict";

var changePassword = function changePassword(e) {
  e.preventDefault();
  sendAjax('POST', "/changePass", $(".passForm").serialize(), redirect);
};

var ChangePassForm = function ChangePassForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "changePass",
      onSubmit: changePassword,
      name: "changePass",
      method: "POST",
      className: "passForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "newPass"
    }, "New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "password",
      name: "newPass",
      placeholder: "Enter New Password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "newPass2"
    }, "Confirm New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "password",
      name: "newPass2",
      placeholder: "Confirm New Password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Change Password"
    }))
  );
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassForm, {
    csrf: csrf
  }), document.querySelector("#changePass"));
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
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
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
