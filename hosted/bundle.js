"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
      main: "#55acee"
    },
    secondary: {
      main: "#19857b"
    },
    error: {
      main: colors.red.A400
    },
    background: {
      "default": "#fff"
    }
  }
});
var useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500
  },
  gameChoose: {
    flexGrow: 1
  },
  table: {
    minWidth: 400
  },
  grid: {
    flexGrow: 1
  },
  card: {
    maxWidth: 200
  },
  media: {
    height: 220
  }
});
var flappyGame = document.getElementById("flappy-game");
var sviperGame = document.getElementById("sviper-game");
var gameChooser = document.getElementById("gameChoose");
var requireAllScores = document.getElementById("allScores");
var userGame = "";

if (flappyGame != null) {
  userGame = "flappy";
}

if (sviperGame != null) {
  userGame = "sviper";
}

console.log(userGame);

var handleScore = function handleScore(e) {
  e.preventDefault();
  $("#monsterMessage").animate({
    width: "hide"
  }, 350);

  if ($("#scoreName").val() == "" || $("#scoreAge").val() == "") {
    handleError("RAWR! All fields are required");
    return false;
  }

  console.log("flappyGame");
  sendAjax("POST", "/maker", $("#scoreForm").serialize() + "&score=".concat(globalVariable.score, "&game=").concat(userGame), function () {
    loadScoresFromServer();
    loadAllGameScoresFromServer();
    console.log(globalVariable.score);
  });
  return false;
};

var ScoreForm = function ScoreForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "scoreForm",
      onSubmit: handleScore,
      name: "scoreForm",
      method: "POST",
      className: "scoreForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "scoreName",
      type: "text",
      name: "name",
      placeholder: "Your Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "scoreAge",
      type: "number",
      name: "age",
      placeholder: "Your Age"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeScoreSubmit",
      type: "submit",
      value: "Submit Score"
    }))
  );
};

function GameCards() {
  var classes = useStyles();
  return (/*#__PURE__*/React.createElement("div", {
      className: classes.grid
    }, /*#__PURE__*/React.createElement(Grid, {
      container: true,
      spacing: 3
    }, /*#__PURE__*/React.createElement(Grid, {
      item: true,
      xs: 6,
      justifycontent: "center"
    }, /*#__PURE__*/React.createElement(Card, _defineProperty({
      className: classes.card
    }, "className", "mx-auto"), /*#__PURE__*/React.createElement(CardActionArea, null, /*#__PURE__*/React.createElement(CardMedia, {
      className: classes.media,
      image: "/assets/img/flappy.jpg",
      title: "Contemplative Reptile"
    }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Typography, {
      variant: "body2",
      color: "textSecondary",
      component: "p",
      align: "center"
    }, "Phaser.js Game"), /*#__PURE__*/React.createElement(Typography, {
      gutterBottom: true,
      variant: "h5",
      component: "h2",
      align: "center"
    }, "Flappy Box"), /*#__PURE__*/React.createElement(Typography, {
      variant: "body2",
      color: "textSecondary",
      component: "p",
      align: "center"
    }, "Flappy bird clone: Flappy Box."))), /*#__PURE__*/React.createElement(CardActions, null, /*#__PURE__*/React.createElement(Button, {
      size: "small",
      href: "/flappy",
      color: "primary",
      align: "center"
    }, "Play")))), /*#__PURE__*/React.createElement(Grid, {
      item: true,
      xs: 6,
      justifycontent: "center"
    }, /*#__PURE__*/React.createElement(Card, _defineProperty({
      className: classes.card
    }, "className", "mx-auto"), /*#__PURE__*/React.createElement(CardActionArea, null, /*#__PURE__*/React.createElement(CardMedia, {
      className: classes.media,
      image: "/assets/img/sviper.jpg",
      title: "Sviper Game"
    }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Typography, {
      variant: "body2",
      color: "textSecondary",
      component: "p",
      align: "center"
    }, "PIXI.js Game"), /*#__PURE__*/React.createElement(Typography, {
      gutterBottom: true,
      variant: "h5",
      component: "h2",
      align: "center"
    }, "Sviper"), /*#__PURE__*/React.createElement(Typography, {
      variant: "body2",
      color: "textSecondary",
      component: "p",
      align: "center"
    }, "Control the SVIPER jet, defeat enemies, collect power ups and rack up a high score."))), /*#__PURE__*/React.createElement(CardActions, null, /*#__PURE__*/React.createElement(Button, {
      size: "small",
      href: "/sviper",
      color: "primary"
    }, "Play"))))))
  );
}

var ScoreList = function ScoreList(props) {
  var classes = useStyles();
  var tableName, message;

  if (props.game === "flappy") {
    tableName = "Flappy Box Leaderboard";
    message = "No Flappy Box Scores Yet";
  } else if (props.game === "sviper") {
    tableName = "Sviper Leaderboard\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0";
    message = "No Sviper Scores Yet";
  }

  if (props.scores.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        id: "heading"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyScore"
      }, message))
    );
  }

  return (/*#__PURE__*/React.createElement(TableContainer, {
      component: Paper
    }, /*#__PURE__*/React.createElement(Table, {
      className: classes.table,
      "aria-label": "simple table"
    }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
      style: {
        color: "#55acee"
      }
    }, tableName), /*#__PURE__*/React.createElement(TableCell, {
      align: "right"
    }, "Score"), /*#__PURE__*/React.createElement(TableCell, {
      align: "right"
    }, "Age"))), /*#__PURE__*/React.createElement(TableBody, null, props.scores.map(function (row) {
      return (/*#__PURE__*/React.createElement(TableRow, {
          key: row.name
        }, /*#__PURE__*/React.createElement(TableCell, {
          component: "th",
          scope: "row"
        }, row.name), /*#__PURE__*/React.createElement(TableCell, {
          align: "right"
        }, row.score), /*#__PURE__*/React.createElement(TableCell, {
          align: "right"
        }, row.age))
      );
    }))))
  );
};

var loadScoresFromServer = function loadScoresFromServer() {
  sendAjax("GET", "/getScores?+&".concat(userGame), null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: userGame
    }), document.querySelector("#yourScores"));
  });
};

var loadAllGameScoresFromServer = function loadAllGameScoresFromServer() {
  sendAjax("GET", "/getAllScores?+&".concat(userGame), null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: userGame
    }), document.querySelector("#allGameScores"));
  });
};

var loadAllScoresFromServer = function loadAllScoresFromServer() {
  sendAjax("GET", "/getAllScores?+&flappy", null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: "flappy"
    }), document.querySelector("#allFlappyScores"));
  });
  sendAjax("GET", "/getAllScores?+&sviper", null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: "sviper"
    }), document.querySelector("#allSviperScores"));
  });
};

var setup = function setup(csrf) {
  if (requireAllScores != null) {
    ReactDOM.render( /*#__PURE__*/React.createElement(GameCards, null), document.querySelector("#gameChoose"));
    loadAllScoresFromServer();
  } else {
    ReactDOM.render( /*#__PURE__*/React.createElement(ScoreForm, {
      csrf: csrf
    }), document.querySelector("#makeScore"));
    ReactDOM.render( /*#__PURE__*/React.createElement(ScoreList, {
      scores: []
    }), document.querySelector("#allGameScores"));
    loadScoresFromServer();
    loadAllGameScoresFromServer();
  }
};

var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
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
