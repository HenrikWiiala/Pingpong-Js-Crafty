window.onload = function () { //Tapa käynnistää crafty
    var backgroundColor = "#dbdbdb";
    var paddleWidth = 100;
    var paddleHeight = 10;
    var paddleColor = "#000000";
    var ballColor = "#000000";
    var ballRadius = 16;
    var pointsPlayer = 0;
    var pointsComputer = 0;
    var assetsObj = {
        "audio": {
            "hit": ["sound/hit.mp3","sound/hit.ogg"],
            "hit2": ["sound/hit2.mp3","sound/hit2.ogg"],
            "lose": ["sound/lose_effect.mp3","sound/lose_effect.ogg"],
            "win": ["sound/win_effect.mp3","sound/win_effect.ogg"],
            "bgaudio": "Powerup.mp3"
        },
        "sprites": {
          "images/pong_sprites.png": {
            "tile": 16,
            "tileh": 16,
            "map": {"floor0": [0,0,1,1], "floor1": [0,1,1,1],
                    "floor2": [1,1,1,1], "wall1": [6,0,1,1],
                    "wall2": [7,0,1,1], "ball0": [2,1,1,1],
                    "toppaddle": [0,2,4,1], "bottompaddle": [0,3,4,1]
            }
          }
        }
      };

      Crafty.load(assetsObj, // preload assets
        function() { //when loaded
            console.log("Assetit ladattu");
            Crafty.init(320, 480, "PongGameShit"); //pelin alustus init("pikselikoko, pikselikoko, nimi")
            //Crafty.background(backgroundColor); 
            Crafty.e("backGround, Canvas, 2D, floor0")
            .attr({x: 0, y: 0, w: 320, h: 240});
            Crafty.e("backGround, Canvas, 2D, floor1")
            .attr({x: 0, y: 240, w: 320, h: 240});
            Crafty.e("wall1, Canvas, 2D, wall1")
            .attr({x: 305, y: 0, w: 20, h: 480});
            Crafty.e("wall2, Canvas, 2D, wall2")
            .attr({x: -5, y: 0, w: 20, h: 480});
        
            //tietokoneen maila
            Crafty.e("topPaddle, Canvas, 2D, toppaddle")
            .attr({x: 100, y: 10, w: paddleWidth, h: paddleHeight})
            //.color(paddleColor)
            .bind("EnterFrame", function(){
                var gameBall = Crafty("gameBall");
                if(gameBall.ySpeed < 0){
                    if(gameBall.x < (this.x + paddleWidth / 2)) {
                    this.x--;
                }
                else {
                    this.x++;
                }
                if(this.x <= 0){
                    this.x = 0;
                }
                if(this.x > 320 - paddleWidth) {
                    this.x = 320 - paddleWidth;
                }
            }
            });
            
            //pelaajan maila
            Crafty.e("bottomPaddle, Canvas, 2D, bottompaddle, Multiway")
            .attr({x: 100, y: 460, w: paddleWidth, h: paddleHeight})
            //.color(paddleColor)
            .multiway(50, {LEFT_ARROW: 180, RIGHT_ARROW: 0})
            .bind("EnterFrame", function(){
           
                if(this.x <= 0){
                    this.x = 0;
                }
                if(this.x > 320 - paddleWidth) {
                    this.x = 320 - paddleWidth;
                }
            
            }); //suunta(nopeus {näppäin: suunta})
           
            //Pallo
            Crafty.e("gameBall, 2D, Canvas, ball0, Collision")
            .attr({x: 150, y: 240, w: ballRadius, h: ballRadius, xSpeed: 3, ySpeed: 3})
            //.color(ballColor)
            .bind("EnterFrame", function(){
                this.x += this.xSpeed;
                this.y += this.ySpeed;
                
                if(this.x <= 0 || this.x >= 320 - ballRadius){
                    this.xSpeed *= -1;
                }
                
                if(this.y < 0){
                    pointsPlayer++;
                    this.x = 160;
                    this.y = 240;
                    Crafty.audio.play("bgaudio");
                }
               
                if(this.y > 480){
                    pointsComputer++;
                    this.x = 160;
                    this.y = 240;
                    Crafty.audio.play("bgaudio");
                }
                
                if(pointsPlayer >= 10) {
                    Crafty.audio.play("win");

                    Crafty.e("scoreText, 2D, Canvas, Text")
            .attr({x: 90, y: 225, w: 100, h: 100})
            .textFont({ size: '30px', weight: 'bold' })
            .textColor('blue')
            .bind("EnterFrame", function(){
                this.text("You win!")
            });
                }
               
                if(pointsComputer >= 10) {
                    Crafty.audio.play("lose");

                    Crafty.e("scoreText, 2D, Canvas, Text")
            .attr({x: 90, y: 225, w: 100, h: 100})
            .textFont({ size: '30px', weight: 'bold' })
            .textColor('red')
            .bind("EnterFrame", function(){
                this.text("You lose!")
            });
                }
                
                if(pointsPlayer >= 10 || pointsComputer >= 10) {
                    this.destroy();
                }              
            })
           
            .onHit("topPaddle", function(){
                Crafty.audio.play("hit");
                this.ySpeed *= -1;
                this.y = 10 + ballRadius;
            })
            
            .onHit("bottomPaddle", function(){
            Crafty.audio.play("hit2");
            this.ySpeed *= -1;
            this.y = 460 - ballRadius;
            }); //("Mihin osutaan")
           
            //Pistelaskuri teksti
            Crafty.e("scoreText, 2D, Canvas, Text")
            .attr({x: 5, y: 25, w: 100, h: 100})
            .bind("EnterFrame", function(){
                this.text("You: " + pointsPlayer + " Computer: " + pointsComputer)
            });

        },
    
        function(e) { //progress
            console.log("Assetteja ladataan")
        },
    
        function(e) { //uh oh, error loading
            console.log("Virhe assettien lataamisessa: " + e )
        }
    );


    
    
    
    
    //var player = Crafty.e("2D, Canvas, Color, Fourway") //craftyn yksittäinen entiteetti ("Ominaisuudet, joita hyödynnetään")
    //.attr({x: 100, y: 100, w: 50, H: 50}) //x/y : 100 on sijainti eli piirron aloituspiste ja w/h on piirtotapa (neliö 50x50)
    //.color("blue")
    //.twoway(100);
}