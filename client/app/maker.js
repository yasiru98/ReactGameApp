

let flappyGame = document.getElementById("flappy-game");
let sviperGame = document.getElementById("sviper-game");
let userGame = "";
if(flappyGame != null){
    userGame = "flappy"
}

if(sviperGame != null){
    userGame = "sviper"
}

const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    //$("#domoScore").val = globalVariable.score;




    console.log( "flappyGame");
    sendAjax('POST', "/maker", $("#domoForm").serialize()+`&score=${globalVariable.score}&game=${userGame}`, function(){
        loadDomosFromServer();
        loadAllDomosFromServer();
        console.log(globalVariable.score);
    });
    


    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
   
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Your Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Your Age" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Submit Score" />
        </form>
    );
};

const DomoList = function(props){
    if(props.domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Scores yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo){
        return(
            <div key={domo._id} className="domo">
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="domoName"> Name: {domo.name}</h3>
            <h3 className="domoAge"> Age: {domo.age}</h3>
            <h3 className="domoScore"> Score: {domo.score}</h3>
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div> 
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', `/getDomos?+&${userGame}`, null, (data) =>{
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });

};

const loadAllDomosFromServer = () => {
    sendAjax('GET', `/getAll?+&${userGame}`, null, (data) =>{
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#Alldomos")
        );
    });

};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#Alldomos")
    );
    loadDomosFromServer();
    loadAllDomosFromServer();

}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});
