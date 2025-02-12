// React Material-UI components
const {
  colors,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  createTheme,
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
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions
} = MaterialUI;

// React Material-UI theme styling
const theme = createTheme({
  palette: {
    primary: { main: "#55acee" },
    secondary: { main: "#19857b" },
    error: { main: colors.red.A400 },
    background: { default: "#fff" }
  }
});

// Check which game the user is playing
let flappyGame = document.getElementById("flappy-game");
let sviperGame = document.getElementById("sviper-game");
let gameChooser = document.getElementById("gameChoose");
let requireAllScores = document.getElementById("allScores");
let userGame = "";

if (flappyGame != null) userGame = "flappy";
if (sviperGame != null) userGame = "sviper";

console.log(userGame);

// Post high score to the server
const handleScore = (e) => {
  e.preventDefault();
  $("#monsterMessage").animate({ width: "hide" }, 350);

  if ($("#scoreName").val() === "" || $("#scoreAge").val() === "") {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax(
    "POST",
    "/maker",
    $("#scoreForm").serialize() + `&score=${globalVariable.score}&game=${userGame}`,
    function () {
      loadScoresFromServer();
      loadAllGameScoresFromServer();
      console.log(globalVariable.score);
    }
  );

  return false;
};

// Score form for submitting high scores to the server
const ScoreForm = (props) => {
  return (
    <form id="scoreForm" onSubmit={handleScore} name="scoreForm" method="POST" className="scoreForm">
      <label htmlFor="name">Name: </label>
      <input id="scoreName" type="text" name="name" placeholder="Your Name" />
      <label htmlFor="age">Age: </label>
      <input id="scoreAge" type="number" name="age" placeholder="Your Age" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeScoreSubmit" type="submit" value="Submit Score" />
    </form>
  );
};

// Cards that display game information
const GameCards = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={6} justifyContent="center">
          <Card sx={{ maxWidth: 200, margin: "auto" }}>
            <CardActionArea>
              <CardMedia sx={{ height: 220 }} image="/assets/img/flappy.jpg" title="Flappy Box" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" align="center">
                  Phaser.js Game
                </Typography>
                <Typography gutterBottom variant="h5" align="center">
                  Flappy Box
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
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
        <Grid item xs={6} justifyContent="center">
          <Card sx={{ maxWidth: 200, margin: "auto" }}>
            <CardActionArea>
              <CardMedia sx={{ height: 220 }} image="/assets/img/sviper.jpg" title="Sviper" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" align="center">
                  PIXI.js Game
                </Typography>
                <Typography gutterBottom variant="h5" align="center">
                  Sviper
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  Control the SVIPER jet, defeat enemies, collect power-ups, and rack up a high score.
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
    </Box>
  );
};

// List table for displaying high scores
const ScoreList = (props) => {
  let tableName, message;

  if (props.game === "flappy") {
    tableName = "Flappy Box Leaderboard";
    message = "No Flappy Box Scores Yet";
  } else if (props.game === "sviper") {
    tableName = "Sviper Leaderboard";
    message = "No Sviper Scores Yet";
  }

  if (props.scores.length === 0) {
    return (
      <Box id="heading">
        <Typography variant="h3" className="emptyScore">{message}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#55acee" }}>{tableName}</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Age</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.scores.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
              <TableCell align="right">{row.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Load and render scores
const loadScoresFromServer = () => {
  sendAjax("GET", `/getScores?+&${userGame}`, null, (data) => {
    console.log(`🔹 Retrieved ${data.scores.length} scores for game: ${userGame}`);
    console.table(data.scores); // Print scores in table format

    ReactDOM.render(
      <ScoreList scores={data.scores} game={userGame} />,
      document.querySelector("#yourScores")
    );
  });
};

// Load all high scores for the selected game
const loadAllGameScoresFromServer = () => {
  sendAjax("GET", `/getAllScores?+&${userGame}`, null, (data) => {
    console.log(`🔹 Retrieved ${data.scores.length} total scores for game: ${userGame}`);
    console.table(data.scores);

    ReactDOM.render(
      <ScoreList scores={data.scores} game={userGame} />,
      document.querySelector("#allGameScores")
    );
  });
};

// Load all high scores for all games
const loadAllScoresFromServer = () => {
  sendAjax("GET", `/getAllScores?+&flappy`, null, (data) => {
    console.log(`🔹 Retrieved ${data.scores.length} scores for Flappy Box`);
    console.table(data.scores);

    ReactDOM.render(
      <ScoreList scores={data.scores} game="flappy" />,
      document.querySelector("#allFlappyScores")
    );
  });

  sendAjax("GET", `/getAllScores?+&sviper`, null, (data) => {
    console.log(`🔹 Retrieved ${data.scores.length} scores for Sviper`);
    console.table(data.scores);

    ReactDOM.render(
      <ScoreList scores={data.scores} game="sviper" />,
      document.querySelector("#allSviperScores")
    );
  });
};


// Render page content
const setup = (csrf) => {
  if (requireAllScores) {
    ReactDOM.render(<GameCards />, document.querySelector("#gameChoose"));
    loadAllScoresFromServer();
  } else {
    ReactDOM.render(<ScoreForm csrf={csrf} />, document.querySelector("#makeScore"));
    ReactDOM.render(<ScoreList scores={[]} />, document.querySelector("#allGameScores"));
    loadScoresFromServer();
    loadAllGameScoresFromServer();
  }
};

// Get CSRF token and call setup function
const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
    setup(result.csrfToken);
  });
};

// Initialize on document ready
$(document).ready(() => {
  getToken();
});
