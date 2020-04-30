const changePassword = (e) => {

	e.preventDefault();

    sendAjax('POST', "/changePass", $(".passForm").serialize(), redirect);

};


const ChangePassForm = (props) => {
    return(
        <form id="changePass"
            onSubmit={changePassword}
            name="changePass"
   
            method="POST"
            className="passForm"
        >
           <label htmlFor="newPass">New Password: </label>
            <input id="domoName" type="password" name="newPass" placeholder="Enter New Password"/>
            <label htmlFor="newPass2">Confirm New Password: </label>
            <input id="domoAge" type="password" name="newPass2" placeholder="Confirm New Password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const setup = function(csrf) {
    ReactDOM.render(
        <ChangePassForm csrf={csrf} />, document.querySelector("#changePass")
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