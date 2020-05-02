const {
  colors,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  makeStyles,
  createMuiTheme,
  Box,
  SvgIcon,
  Link,
  TextField,
  Button,
  TableContainer,
  Paper,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
  rows,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions
} = MaterialUI;

const theme = createMuiTheme({
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
      default: "#fff"
    }
  }
});

const useStyles = makeStyles({
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

let flappyGame = document.getElementById("flappy-game");
let sviperGame = document.getElementById("sviper-game");
let gameChooser = document.getElementById("gameChoose");
let requireAllScores = document.getElementById("allScores");
let userGame = "";
if (flappyGame != null) {
  userGame = "flappy";
}

if (sviperGame != null) {
  userGame = "sviper";
}
console.log(userGame);
const handleScore = e => {
  e.preventDefault();

  $("#monsterMessage").animate({ width: "hide" }, 350);

  if ($("#scoreName").val() == "" || $("#scoreAge").val() == "") {
    handleError("RAWR! All fields are required");
    return false;
  }

  console.log("flappyGame");
  sendAjax(
    "POST",
    "/maker",
    $("#scoreForm").serialize() +
      `&score=${globalVariable.score}&game=${userGame}`,
    function() {
      loadScoresFromServer();
      loadAllGameScoresFromServer();
      console.log(globalVariable.score);
    }
  );

  return false;
};

const ScoreForm = props => {
  return (
    <form
      id="scoreForm"
      onSubmit={handleScore}
      name="scoreForm"
      method="POST"
      className="scoreForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="scoreName" type="text" name="name" placeholder="Your Name" />
      <label htmlFor="age">Age: </label>
      <input id="scoreAge" type="number" name="age" placeholder="Your Age" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeScoreSubmit" type="submit" value="Submit Score" />
    </form>
  );
};

function GameCards() {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      <Grid container spacing={3}>
        <Grid item xs={6} justifycontent="center">
          <Card className={classes.card} className="mx-auto">
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="/assets/img/flappy.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  align="center"
                >
                  Phaser.js Game
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  align="center"
                >
                  Flappy Box
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  align="center"
                >
                  Flappy bird clone: Flappy Box.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" href="/flappy" color="primary" align="center">
                Play
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} justifycontent="center">
          <Card className={classes.card} className="mx-auto">
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="/assets/img/sviper.jpg"
                title="Sviper Game"
              />
              <CardContent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  align="center"
                >
                  PIXI.js Game
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  align="center"
                >
                  Sviper
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  align="center"
                >
                  Control the SVIPER jet, defeat enemies, collect power ups and
                  rack up a high score.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" href="/sviper" color="primary">
                Play
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

const ScoreList = function(props) {
  const classes = useStyles();
  let tableName,message;

  if (props.game === "flappy") {
    tableName = "Flappy Box Leaderboard";
    message = "No Flappy Box Scores Yet";
  } else if (props.game === "sviper") {
    tableName = `Sviper Leaderboard\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
    message = "No Sviper Scores Yet";
  }

  if (props.scores.length === 0) {
    return (
      <div id="heading">
        <h3 className="emptyScore">{message}</h3>
      </div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "#55acee" }}>{tableName}</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Age</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.scores.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.score}</TableCell>
              <TableCell align="right">{row.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const loadScoresFromServer = () => {

    sendAjax("GET", `/getScores?+&${userGame}`, null, data => {
      ReactDOM.render(
        <ScoreList scores={data.scores}game={userGame} />,
        document.querySelector("#yourScores")
      );
    });
  
};

const loadAllGameScoresFromServer = () => {
  sendAjax("GET", `/getAllScores?+&${userGame}`, null, data => {
    ReactDOM.render(
      <ScoreList scores={data.scores} game={userGame} />,
      document.querySelector("#allGameScores")
    );
  });
};

const loadAllScoresFromServer = () => {
  sendAjax("GET", `/getAllScores?+&flappy`, null, data => {
    ReactDOM.render(
      <ScoreList scores={data.scores} game={"flappy"} />,
      document.querySelector("#allFlappyScores")
    );
  });

  sendAjax("GET", `/getAllScores?+&sviper`, null, data => {
    ReactDOM.render(
      <ScoreList scores={data.scores} game={"sviper"} />,
      document.querySelector("#allSviperScores")
    );
  });
};

const setup = function(csrf) {
  if (requireAllScores != null) {
    ReactDOM.render(<GameCards />, document.querySelector("#gameChoose"));
    loadAllScoresFromServer();
  } else {
    ReactDOM.render(
      <ScoreForm csrf={csrf} />,
      document.querySelector("#makeScore")
    );

    ReactDOM.render(
      <ScoreList scores={[]} />,
      document.querySelector("#allGameScores")
    );

    loadScoresFromServer();
    loadAllGameScoresFromServer();
  }
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
