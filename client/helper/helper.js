//show error message to user
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#monsterMessage").animate({width: 'toggle'}, 350);

};

//redirect to page
const redirect = (response) => {
    $("#monsterMessage").animate({width: 'hide'}, 350);
    window.location = response.redirect;

};

//send requests to the server
const sendAjax = (type,action,data,success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr,status,error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
