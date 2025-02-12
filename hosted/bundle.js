"use strict";

// React Material-UI components
var _MaterialUI = MaterialUI,
  colors = _MaterialUI.colors,
  CssBaseline = _MaterialUI.CssBaseline,
  ThemeProvider = _MaterialUI.ThemeProvider,
  Typography = _MaterialUI.Typography,
  Container = _MaterialUI.Container,
  createTheme = _MaterialUI.createTheme,
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
  Grid = _MaterialUI.Grid,
  Card = _MaterialUI.Card,
  CardActionArea = _MaterialUI.CardActionArea,
  CardMedia = _MaterialUI.CardMedia,
  CardContent = _MaterialUI.CardContent,
  CardActions = _MaterialUI.CardActions;

// React Material-UI theme styling
var theme = createTheme({
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

// Check which game the user is playing
var flappyGame = document.getElementById("flappy-game");
var sviperGame = document.getElementById("sviper-game");
var gameChooser = document.getElementById("gameChoose");
var requireAllScores = document.getElementById("allScores");
var userGame = "";
if (flappyGame != null) userGame = "flappy";
if (sviperGame != null) userGame = "sviper";
console.log(userGame);

// Post high score to the server
var handleScore = function handleScore(e) {
  e.preventDefault();
  $("#monsterMessage").animate({
    width: "hide"
  }, 350);
  if ($("#scoreName").val() === "" || $("#scoreAge").val() === "") {
    handleError("RAWR! All fields are required");
    return false;
  }
  sendAjax("POST", "/maker", $("#scoreForm").serialize() + "&score=".concat(globalVariable.score, "&game=").concat(userGame), function () {
    loadScoresFromServer();
    loadAllGameScoresFromServer();
    console.log(globalVariable.score);
  });
  return false;
};

// Score form for submitting high scores to the server
var ScoreForm = function ScoreForm(props) {
  return /*#__PURE__*/React.createElement("form", {
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
  }));
};

// Cards that display game information
var GameCards = function GameCards() {
  return /*#__PURE__*/React.createElement(Box, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    spacing: 3
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6,
    justifyContent: "center"
  }, /*#__PURE__*/React.createElement(Card, {
    sx: {
      maxWidth: 200,
      margin: "auto"
    }
  }, /*#__PURE__*/React.createElement(CardActionArea, null, /*#__PURE__*/React.createElement(CardMedia, {
    sx: {
      height: 220
    },
    image: "/assets/img/flappy.jpg",
    title: "Flappy Box"
  }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary",
    align: "center"
  }, "Phaser.js Game"), /*#__PURE__*/React.createElement(Typography, {
    gutterBottom: true,
    variant: "h5",
    align: "center"
  }, "Flappy Box"), /*#__PURE__*/React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary",
    align: "center"
  }, "Flappy bird clone: Flappy Box."))), /*#__PURE__*/React.createElement(CardActions, null, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    href: "/flappy",
    color: "primary",
    align: "center"
  }, "Play")))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6,
    justifyContent: "center"
  }, /*#__PURE__*/React.createElement(Card, {
    sx: {
      maxWidth: 200,
      margin: "auto"
    }
  }, /*#__PURE__*/React.createElement(CardActionArea, null, /*#__PURE__*/React.createElement(CardMedia, {
    sx: {
      height: 220
    },
    image: "/assets/img/sviper.jpg",
    title: "Sviper"
  }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary",
    align: "center"
  }, "PIXI.js Game"), /*#__PURE__*/React.createElement(Typography, {
    gutterBottom: true,
    variant: "h5",
    align: "center"
  }, "Sviper"), /*#__PURE__*/React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary",
    align: "center"
  }, "Control the SVIPER jet, defeat enemies, collect power-ups, and rack up a high score."))), /*#__PURE__*/React.createElement(CardActions, null, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    href: "/sviper",
    color: "primary"
  }, "Play"))))));
};

// List table for displaying high scores
var ScoreList = function ScoreList(props) {
  var tableName, message;
  if (props.game === "flappy") {
    tableName = "Flappy Box Leaderboard";
    message = "No Flappy Box Scores Yet";
  } else if (props.game === "sviper") {
    tableName = "Sviper Leaderboard";
    message = "No Sviper Scores Yet";
  }
  if (props.scores.length === 0) {
    return /*#__PURE__*/React.createElement(Box, {
      id: "heading"
    }, /*#__PURE__*/React.createElement(Typography, {
      variant: "h3",
      className: "emptyScore"
    }, message));
  }
  return /*#__PURE__*/React.createElement(TableContainer, {
    component: Paper
  }, /*#__PURE__*/React.createElement(Table, {
    sx: {
      minWidth: 400
    },
    "aria-label": "simple table"
  }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    sx: {
      color: "#55acee"
    }
  }, tableName), /*#__PURE__*/React.createElement(TableCell, {
    align: "right"
  }, "Score"), /*#__PURE__*/React.createElement(TableCell, {
    align: "right"
  }, "Age"))), /*#__PURE__*/React.createElement(TableBody, null, props.scores.map(function (row) {
    return /*#__PURE__*/React.createElement(TableRow, {
      key: row.name
    }, /*#__PURE__*/React.createElement(TableCell, null, row.name), /*#__PURE__*/React.createElement(TableCell, {
      align: "right"
    }, row.score), /*#__PURE__*/React.createElement(TableCell, {
      align: "right"
    }, row.age));
  }))));
};

// Load and render scores
var loadScoresFromServer = function loadScoresFromServer() {
  sendAjax("GET", "/getScores?+&".concat(userGame), null, function (data) {
    console.log("\uD83D\uDD39 Retrieved ".concat(data.scores.length, " scores for game: ").concat(userGame));
    console.table(data.scores); // Print scores in table format

    ReactDOM.render(/*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: userGame
    }), document.querySelector("#yourScores"));
  });
};

// Load all high scores for the selected game
var loadAllGameScoresFromServer = function loadAllGameScoresFromServer() {
  sendAjax("GET", "/getAllScores?+&".concat(userGame), null, function (data) {
    console.log("\uD83D\uDD39 Retrieved ".concat(data.scores.length, " total scores for game: ").concat(userGame));
    console.table(data.scores);
    ReactDOM.render(/*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: userGame
    }), document.querySelector("#allGameScores"));
  });
};

// Load all high scores for all games
var loadAllScoresFromServer = function loadAllScoresFromServer() {
  sendAjax("GET", "/getAllScores?+&flappy", null, function (data) {
    console.log("\uD83D\uDD39 Retrieved ".concat(data.scores.length, " scores for Flappy Box"));
    console.table(data.scores);
    ReactDOM.render(/*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: "flappy"
    }), document.querySelector("#allFlappyScores"));
  });
  sendAjax("GET", "/getAllScores?+&sviper", null, function (data) {
    console.log("\uD83D\uDD39 Retrieved ".concat(data.scores.length, " scores for Sviper"));
    console.table(data.scores);
    ReactDOM.render(/*#__PURE__*/React.createElement(ScoreList, {
      scores: data.scores,
      game: "sviper"
    }), document.querySelector("#allSviperScores"));
  });
};

// Render page content
var setup = function setup(csrf) {
  if (requireAllScores) {
    ReactDOM.render(/*#__PURE__*/React.createElement(GameCards, null), document.querySelector("#gameChoose"));
    loadAllScoresFromServer();
  } else {
    ReactDOM.render(/*#__PURE__*/React.createElement(ScoreForm, {
      csrf: csrf
    }), document.querySelector("#makeScore"));
    ReactDOM.render(/*#__PURE__*/React.createElement(ScoreList, {
      scores: []
    }), document.querySelector("#allGameScores"));
    loadScoresFromServer();
    loadAllGameScoresFromServer();
  }
};

// Get CSRF token and call setup function
var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

// Initialize on document ready
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
};

//redirect to page
var redirect = function redirect(response) {
  $("#monsterMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

//send requests to the server
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
