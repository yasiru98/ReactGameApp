//flappy bird clone code from: http://www.lessmilk.com/tutorial/flappy-bird-phaser-1 
// Create our 'main' state that will contain the game
let globalVariable={
    score: "0",

 };
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
        game.load.audio('jump', '/assets/jump.wav'); 
        game.load.image('bird', '/assets/bird.png'); 
        game.load.image('pipe', '/assets/pipe.png');
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", 
        { font: "30px Arial", fill: "#ffffff" });  
        this.instructions = game.add.text(20, 300, "Left Click to start", 
        { font: "30px Arial", fill: "#ffffff" });  
    },

    create: function() { 
    this.jumpSound = game.add.audio('jump')
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 
       // Change the background color of the game to blue
    game.stage.backgroundColor = '#71c5cf';
    this.pipes = game.add.group(); 
    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the bird at the position x=100 and y=245
    this.bird = game.add.sprite(100, 245, 'bird');

    // Add physics to the bird
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.bird);

    // Add gravity to the bird to make it fall
    this.bird.body.gravity.y = 1000;  

    // Call the 'jump' function when the spacekey is hit
    var spaceKey = game.input.activePointer.leftButton;
   spaceKey.onDown.add(this.jump, this); 
  
     // Move the anchor to the left and downward
    this.bird.anchor.setTo(-0.2, 0.5); 
    },

    update: function() {
    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
  
    if (this.bird.y < 0 || this.bird.y > 490)
    this.restartGame();
    game.physics.arcade.overlap(
        this.bird, this.pipes, this.restartGame, null, this);

    if (this.bird.angle < 20)
        this.bird.angle += 1; 
    },

    // Make the bird jump 
    jump: function() {
    if (this.bird.alive == false)
    return;  
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;
    game.add.tween(this.bird).to({angle: -20}, 100).start();    

    this.jumpSound.play(); 
    },
    
    // Restart the game
    restartGame: function() {
    // Start the 'main' state, which restarts the game
    game.state.start('main');

    if (this.bird.angle < 20){
    this.bird.angle += 1; 
    }
    },
    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');
    
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
    
        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);
    
        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
    
        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        this.score += 1;
        if(this.score > globalVariable.score){
            globalVariable={
                score: this.score,
            }; 
        }
        else if(this.score < globalVariable.score){

        }
        else{
            globalVariable={
                score: this.score,
            };   
        }
    
        this.labelScore.text = this.score;  
        this.instructions.text = "";
        console.log(globalVariable.score);    
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;
    
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   
    },
    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;
    
        // Set the alive property of the bird to false
        this.bird.alive = false;
    
        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 
};

// Initialize Phaser, and create a 400px by 490px game
let game = new Phaser.Game(400, 490,Phaser.AUTO,'flappy-game');

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');
console.log(globalVariable.score, globalVariable.userName);