WebFont.load({
    google: {
      families: ['Faster One','Luckiest Guy','Bree Serif']
    },
  });
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
function lerp(start, end, amt){
    return start * (1-amt) + amt * end;
}

// we didn't use this one
function cosineInterpolate(y1, y2, amt){
    let amt2 = (1 - Math.cos(amt * Math.PI)) / 2;
    return (y1 * (1 - amt2)) + (y2 * amt2);
}

// we use this to keep the ship on the screen
function clamp(val, min, max){
  return val < min ? min : (val > max ? max : val);
}

// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a,b){
  var ab = a.getBounds();
  var bb = b.getBounds();
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

// these 2 helpers are used by classes.js
function getRandomUnitVector(){
  let x = getRandom(-1,1);
  let y = getRandom(-1,1);
  let length = Math.sqrt(x*x + y*y);
  if(length == 0){ // very unlikely
      x=1; // point right
      y=0;
      length = 1;
  } else{
      x /= length;
      y /= length;
  }

  return {x:x, y:y};
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

const app = new PIXI.Application(800,600);
app.renderer.backgroundColor = 0x0080FF;
let div = document.getElementById('canvas-container');
div.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;
const prefix = "yik4325-"; // change 'abc1234' to your banjo id
const scoreKey = prefix + "score";
let storedScore = localStorage.getItem(scoreKey);

let globalVariable={
    score: storedScore,
 };
// aliases
let stage;

// game variables
let startScene;
let gameScene,ship,scoreLabel,lifeLabel,shootSound,hitSound,fireballSound,cloud,enemy,highScoreLabel, starthighScoreLabel,enemyShootSound,health,rage,powerUpSound;
let gameOverScene;
let gameOverScoreLabel;

//arrays and numbers
let powerUps = [];
let bullets = [];
let enemyBullets = [];
let enemies = [];
let clouds = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;



class Ship extends PIXI.Sprite{
    constructor(x=0,y=0){
        let shipTexture = PIXI.Texture.fromImage('assets/sviper/images/spaceship.png');
        super();
        super.texture = shipTexture;
        this.anchor.set(.5,.5);
        this.scale.set(0.9);
        this.rotation = -Math.PI/2;
        this.x = x;
        this.y = y;

    }
}

//power ups class
class PowerUp extends PIXI.Graphics{
constructor(radius, color=0xFF0000,x=0,y=0){
    super();
    this.beginFill(color);
    this.drawCircle(0,0,radius);
    this.endFill();

    this.x = x;
    this.y=y;
    this.radius = radius;

    this.fwd = getRandomUnitVector();
    this.speed = 50;
    this.isAlive= true;
}

move(dt=1/60){
    this.x += this.fwd.x * this.speed * dt;
    this.y += this.fwd.y * this.speed *dt;
}

reflectX(){
    this.fwd.x *= -1;
}

reflectY(){
    this.fwd.y *= -1;
}
}

class Bullet extends PIXI.Graphics{
    constructor(color=0xFFFFFF, x=0,y=0){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,4,6);
        this.endFill();
        this.x = x;
        this.y =y;
        //variables
        this.fwd = {x:0,y:-1};
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }
}

class EnemyBullet extends PIXI.Graphics{
    constructor(color=0xFF0000, x=0,y=0){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,4,6);
        this.endFill();
        this.x = x;
        this.y =y;
        //variables
        this.fwd = {x:0,y:1};
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }
}


class Cloud extends PIXI.Sprite{
    constructor(x,y=-100){
        const sprite = (Math.random() > 0.5 ? "cloud1" : "cloud2");
        let cloudTexture = PIXI.Texture.fromImage(`assets/sviper/images/${sprite}.png`);
        super();
        super.texture = cloudTexture;
  
        this.anchor.set(.5,.5);
        let minScale = 0.2;
        let maxScale = 0.5;
        let scale = Math.random() * (maxScale - minScale) + minScale;
        this.scale.set(scale);
        this.fwd = {x:0,y:1};
        this.speed = 100;
        this.x = x;
        this.y = y;
        this.isAlive = true;
   
    }
    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
     
    }
}


class Enemy extends PIXI.Sprite{
    constructor(x,y=-100){
        let shipTexture = PIXI.Texture.fromImage('assets/sviper/images/enemy.png');
        super();
        super.texture = shipTexture;
    
        this.anchor.set(.5,.5);
        this.scale.set(0.3);
        this.rotation = -Math.PI/2;
        this.fwd = {x:0,y:1};
        this.speed = 200;
        this.x = x;
        this.y = y;
        this.isAlive = true;
 
    }
    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
     
    }
}

setup();

function setup() {
	stage = app.stage;
	// #1 - Create the `start` scene
    startScene = new PIXI.Container();

    stage.addChild(startScene);
	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
	// #3 - Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
	// #4 - Create labels for all 3 scenes
    createLabelsAndButtons();
    

    // #5 - Create ships
    ship = new Ship();
 
    gameScene.addChild(ship);
  
	// #6 - Load Sounds
  	shootSound = new Howl({
        src: ['assets/sviper/sounds/weapon_player.wav']
    });
    
    hitSound = new Howl({
        src: ['assets/sviper/sounds/hit.flac']
    });
    
    fireballSound = new Howl({
        src: ['assets/sviper/sounds/explosion_asteroid.wav']
    });

    enemyShootSound = new Howl({
        src: ['assets/sviper/sounds/weapon_enemy.wav']
    });

    powerUpSound = new Howl({
        src: ['assets/sviper/sounds/powerup.ogg']
    });
	// #7 - Load sprite sheet
    explosionTextures = loadSpriteSheet();
	// #8 - Start update loop
	app.ticker.add(gameLoop);
	// #9 - Start listening for click events on the canvas
	app.view.onclick = fireBullet;
	// Now our `startScene` is visible
    // Clicking the button calls startGame()


}

function startGame(){

    paused = false;
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;

    levelNum = 1;
    score = 0;
    life = 100;
    increasesScoreBy(0);
    decreaseLifeBy(0);
    ship.x = 300;
    ship.y = 550;
    loadLevel();

    
    clouds = [];
    enemies = [];
    enemyBullets = [];

    if(gameScene.visible){

   //spawn enemies and clouds on a timer
   let spawnEnemies =  window.setInterval(function()
    {
        if(paused==true){//stop spawning enemy bullets if game is paused
            clearInterval(spawnEnemies);
            }
        for(let enemy of enemies){

            if(enemy.isAlive ){
           
                let b = new EnemyBullet(0xFF0000, enemy.x,enemy.y);
                enemyBullets.push(b);
                gameScene.addChild(b);
                enemyShootSound.play();
          
        }
        }
    }
    , 2000);
    

  let spawnClouds =  window.setInterval(function()
    {
        if(paused==true){//stop spawning clouds if game is paused
            clearInterval(spawnClouds);
            }
         let minX = 0;
        let maxX = sceneWidth;
        let x = Math.random() * (maxX - minX) + minX;
        cloud = new Cloud(x);
        gameScene.addChild(cloud);
        clouds.push(cloud);
    }
    , 1000);


    window.setInterval(function()
    {
         let minX = 0;
        let maxX = sceneWidth;
        let x = Math.random() * (maxX - minX) + minX;
        enemy = new Enemy(x);
        gameScene.addChild(enemy);
        enemies.push(enemy);
    }
    , 1000);  
    }
    
    //spawn power ups
    
    let spawnPowerUps =  window.setInterval(function()
    {
        if(paused==true){//stop spawning powerups if game is paused 
            clearInterval(spawnPowerUps);
            }
        createPowerUps();
    }
    , 20000);
}

 //make text labels for menues   
function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Luckiest Guy"
    });

    let startLabel1 = new PIXI.Text("SVIPER");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0x00FFFF,
        fontSize: 120,
        fontFamily: "Faster One", 
        stroke: 0x00000,
        strokeThickness: 6
    });

    startLabel1.x = 100;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

      
    let startButton = new PIXI.Text("PLAY");
    startButton.style = buttonStyle;
    startButton.x = 300;
    startButton.y = sceneHeight - 300;
    startButton.interactive = true;
    startButton.buttonMode = true;

    startButton.on("pointerup",startGame);
    startButton.on("pointerover",e=>e.target.alpha = 0.7);
    startButton.on("pointerout",e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    startButton.on("pointerup",startGame);
    startButton.on("pointerover",e=>e.target.alpha = 0.7);
    startButton.on("pointerout",e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 20,
        fontFamily: "Bree Serif",
        stroke: 0x000000,
        strokeThickness: 4
    });

    let instructionLabel = new PIXI.Text("Press Right Click to Shoot.\nMove with the Mouse.\nCollect power ups for rewards.");
    instructionLabel.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 30,
        fontFamily: "Bree Serif", 
        stroke: 0x00FFFF,
        strokeThickness: 4
    });

    instructionLabel.x = 40;
    instructionLabel.y = 470;
    startScene.addChild(instructionLabel);


    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = sceneWidth/2-40;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increasesScoreBy(0);

    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 5;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    //set up `gameOverScene`
    //make game over text
    let gameOverText = new PIXI.Text("Game Over!");
    textStyle = new PIXI.TextStyle({
	    fill: 0x00FFFF,
	    fontSize: 60,
	    fontFamily: "Faster One",
	    stroke: 0x00000,
	    strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 150;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 250;
    playAgainButton.y = sceneHeight - 150;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup",startGame); // startGame is a function reference
    playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(playAgainButton);

    gameOverScoreLabel = new PIXI.Text();
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = 30;
    gameOverScoreLabel.y = sceneHeight/2 - 80;
    gameOverScene.addChild(gameOverScoreLabel);

    highScoreLabel = new PIXI.Text();
    highScoreLabel.style = textStyle;
    highScoreLabel.x = 30;
    highScoreLabel.y = sceneHeight/2 - 10;
    gameOverScene.addChild(highScoreLabel);

    starthighScoreLabel = new PIXI.Text();
    starthighScoreLabel.style = textStyle;
    starthighScoreLabel.x = 30;
    starthighScoreLabel.y = sceneHeight/2 + 100;
    if(storedScore == null){
        starthighScoreLabel.text = `No high score yet`
    }
    else{
        starthighScoreLabel.text = `Your high score:  ${storedScore}`
      
    }
    startScene.addChild(starthighScoreLabel);
 
}


function increasesScoreBy(value){
    score += value;
    scoreLabel.text=`Score: ${score}`;
}

function decreaseLifeBy(value){
    life -= value;
    life = parseInt(life);
    lifeLabel.text=`Life: ${life}`;
}

//for power ups
function increaseLifeBy(value){
    life += value;
    life = parseInt(life);
    lifeLabel.text=`Life: ${life}`;
}


function gameLoop(){
    if (paused) return; 
    
	//Calculate "delta time"
	let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

	// Move Ship
    let mousePosition = app.renderer.plugins.interaction.mouse.global;
    
    //ship.position = mousePosition;
    let amt = 6 * dt;
    
    let newX = lerp(ship.x, mousePosition.x, amt);
    let newY = lerp(ship.y, mousePosition.y, amt);

    let w2 = ship.width/2;
    let h2 = ship.height/2;
    ship.x = clamp(newX,0+w2,sceneWidth - w2);
    ship.y = clamp(newY,0+h2,sceneHeight-h2);

    //move clouds and enemies     
    for (let cloud of clouds){
        cloud.move(dt);
        if (cloud.y > 650) {
            cloud.isAlive = false;
            gameScene.removeChild(cloud);
            cloud.destroy();
        }
    }

    for (let enemy of enemies){
        enemy.move(dt);
        if (enemy.y > 650) {
            enemy.isAlive = false;
            gameScene.removeChild(enemy);
            enemy.destroy();
            
        }
    }

    //Move power ups
    if(powerUps!= undefined){
        for(let p of powerUps){
            p.move(dt);
            if(p.x<=p.radius || p.x >=sceneWidth-p.radius){
            p.reflectX();
            p.move(dt);
            }
            if(p.y <= p.radius || p.y >= sceneHeight - p.radius){
            p.reflectY();
            p.move(dt);
        }
    }   
    }

	//Move Bullets
	for (let b of bullets){
		b.move(dt);
    }
    
    for(let b of enemyBullets){
		b.move(dt);
    }
  
	//Check for Collisions
    for(let p of powerUps){
        if(p.isAlive && rectsIntersect(p,ship)){
            powerUpSound.play();
          if(p == health){
            gameScene.removeChild(p);
            p.isAlive = false;
            increaseLifeBy(40);
           
          }
          else if(p==rage){
           
              for(let e of enemies){
                gameScene.removeChild(p);          
                p.isAlive = false;
                createExplosion(e.x,e.y,96,96);
                fireballSound.play();
                gameScene.removeChild(e);
                e.isAlive = false;              
                increasesScoreBy(1);
              }
          }       
        }
      
    }

    for(let b of bullets){
        for(let p of powerUps){
            if(rectsIntersect(p,b)){
                gameScene.removeChild(p);
                p.isAlive = false;
                increaseLifeBy(50);
                createExplosion(p.x,p.y,96,96)
            }
        }
    }

    for(let e of enemyBullets){
        if(e.isAlive && rectsIntersect(e,ship)){
            hitSound.play();
            gameScene.removeChild(e);
            e.isAlive = false;
            decreaseLifeBy(15);
        
        }
    }

    for (let e of enemies){
        for(let b of bullets){
            if(e.isAlive && rectsIntersect(e,b)){
                fireballSound.play();
                createExplosion(e.x,e.y,96,96);
                gameScene.removeChild(e);
                e.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
                increasesScoreBy(5);
            }
        }
        if(e.isAlive && rectsIntersect(e,ship)){
            fireballSound.play();
            gameScene.removeChild(e);
            e.isAlive = false;
            decreaseLifeBy(10);
            createExplosion(e.x,e.y,96,96);
        }
 
    }


	//clean up
	clouds = clouds.filter(cl=>cl.isAlive);
    bullets = bullets.filter(b=>b.isAlive);
    powerUps = powerUps.filter(p=>p.isAlive);
    enemies = enemies.filter(e=>e.isAlive);
    explosions = explosions.filter(e=>e.playing);

	//Is game over?
	if (life <= 0){
        end();
        return; // return here so we skip #8 below
    }
	
    //Load next level
    if (powerUps.length == 0){
        levelNum ++;
        loadLevel();
    }
}

//create power ups
function createPowerUps(){
if(powerUps.length < 1 ){
        health = new PowerUp(12,0x7CFC00);
        health.x = Math.random() * (sceneWidth - 50)+25;
        health.y = Math.random() * (sceneHeight - 400)+25;
        gameScene.addChild(health);
        powerUps.push(health);

        rage = new PowerUp(12,0xFF0000);
        rage.x = Math.random() * (sceneWidth - 50)+25;
        rage.y = Math.random() * (sceneHeight - 400)+25;
        gameScene.addChild(rage);
        powerUps.push(rage);
}
}

//unpause to load level
function loadLevel(){

    paused = false;

}

//end game
function end(){
  
    paused = true;

    //clear arrays
    clouds.forEach(cloud=>gameScene.removeChild(cloud));
    clouds=[];

    powerUps.forEach(p=>gameScene.removeChild(p));
    powerUps=[];

    bullets.forEach(b=>gameScene.removeChild(b));
    bullets=[];

    explosions.forEach(e=>gameScene.removeChild(e));
    explosions=[];

    enemies.forEach(e=>gameScene.removeChild(e));
    enemies=[];

    enemyBullets.forEach(e=>gameScene.removeChild(e));
    enemyBullets=[];

    //end game labels
    gameOverScoreLabel.text = `Your final score:  ${score}`;
    if(storedScore > score){
        highScoreLabel.text = `Your high score:  ${storedScore}`;
    }
    else if(score > storedScore){
        highScoreLabel.text = `Your high score:  ${score}`;
        localStorage.setItem(scoreKey, score);
        storedScore = score;
        globalVariable.score = score;
    }
    else if(score = storedScore){
        highScoreLabel.text = `Your high score:  ${score}`
        localStorage.setItem(scoreKey, score);
    }
    else{
        highScoreLabel.text = `No high score yet`;
    }


    gameOverScene.visible = true;
    gameScene.visible = false;

    
}

//bullets
function fireBullet(e){
    if(levelNum == 2){
        let a = new Bullet(0xFFFFFF, ship.x+10,ship.y);
        let b = new Bullet(0xFFFFFF, ship.x,ship.y);
        let c = new Bullet(0xFFFFFF, ship.x-10,ship.y);
        bullets.push(a);
        bullets.push(b);
        bullets.push(c);
        gameScene.addChild(a);
        gameScene.addChild(b);
        gameScene.addChild(c);
        shootSound.play();
    }

    if(paused) return;
    else{
    let b = new Bullet(0xFFFFFF, ship.x,ship.y);
    bullets.push(b);
    gameScene.addChild(b);
    shootSound.play();
}
}

//explosion
function loadSpriteSheet(){
    let spriteSheet = PIXI.BaseTexture.fromImage("assets/sviper/images/explosions.png");
    let width = 96;
    let height = 96;
    let numFrames = 12;
    let textures = [];

    for(let i=0; i < numFrames; i++){
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width,0,width,height));
        textures.push(frame);
    }
    return textures;
}

function createExplosion(x,y,frameWidth,frameHeight){
    let w2 = frameWidth/2;
    let h2 = frameHeight/2;
    let expl = new PIXI.extras.AnimatedSprite(explosionTextures);
    expl.x = x-w2;
    expl.y = y-h2;
    expl.animationSpeed = 1/7;
    expl.loop= false;
    expl.onComplete= e=> gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}
