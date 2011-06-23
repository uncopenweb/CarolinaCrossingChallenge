
audioFiles = {
    1: {
        name: 'test1',
        info: {
            safe: 6000,
            unsafe: 1500,
        },
    },
}

dojo.declare('seeker', [ ], {


    width: 500,         // dimensions of the canvas
    height: 500,
    x_map: [0,1,0,-1],
    y_map: [-1,0,1,0],
    

    
        // the constructor gets called when we create the object
    constructor: function(primHolder, auxHolder) {
       
       // initilize the Raphael canvases
        this.auxHolder = auxHolder;
        this.raph = primHolder;

        //initalize the player
        this.player = {
            x_pos: this.width * 0.66,
            y_pos: this.height - 10,
            direction: 0, // 0 = north, 1 = east, 2 = south, 3 = west
            speed: 10,
            onCorner: false,
        }
        
        // initalize the current tile
        this.currentMap = MAPS.chapel_hill;
        this.tilePos = [1,1];
        this.currentTile = this.currentMap[this.tilePos[0]][this.tilePos[1]];
        
        // this is used solely as an object for the GPS map
        this.GPSMapPlayer = null;

        // initializes the game to not being paused
        this.isPaused = false;
        
        this.link = dojo.connect(window, 'keydown', this, 'keyDown');

        // initialize audio
        uow.getAudio({ defaultCaching: true }).then(dojo.hitch(this, function(a) {
            this.audio = a;  // save the audio object for later use
            this.newGame();
        }));
    },
    
    newGame: function() {
        this.createBG();
        this.createPlayer();
        this.createGPSMap();
        /**
        this.audio.play({url: "sounds/corner", channel: "bgnoise"});
        this.audio.setProperty({
            name : 'volume', 
            value :  0.2,
            immediate: true,
            channel: "bgnoise",
        });
        **/
    },
    
    createPlayer: function() {
        
        if (this.player.direction == 0){
            this.player.face = this.raph.rect(this.player.x_pos - 2, this.player.y_pos - 15, 4, 10).attr({
                stroke: "#0AF", 
                fill: "#0AF"
            });
        } else if (this.player.direction == 1){
            this.player.face = this.raph.rect(this.player.x_pos + 5, this.player.y_pos - 2, 10, 4).attr({
                stroke: "#0AF", 
                fill: "#0AF"
            });
        } else if (this.player.direction == 2){
            this.player.face = this.raph.rect(this.player.x_pos - 2, this.player.y_pos + 5, 4, 10).attr({
                stroke: "#0AF", 
                fill: "#0AF"
            });
        } else if (this.player.direction == 3){
            this.player.face = this.raph.rect(this.player.x_pos - 15, this.player.y_pos - 2, 10, 2).attr({
                stroke: "#0AF", 
                fill: "#0AF"
            });
        }
        
        this.player.body = this.raph.circle(this.player.x_pos, this.player.y_pos, 10).attr({
            fill: "#00F",
            stroke: "#00F",
        });
    },
    
    createBG: function() {
        var sz = this.height/10;
        var num;
    
        this.raph.rect(0, 0, this.width, this.height).attr({
            fill: "#953",
            stroke: "#000",
        });
        
        // draw the street, sidewalk, and sidewalk corner
        for (i = 0 ; i < 10 ; i++){
            for (j = 0 ; j < 10 ; j++){
                num = this.currentTile.BG_grid[j][i];
                if (num == 0) {
                    this.raph.rect(i*sz, j*sz, sz, sz).attr({fill: "#ccc", stroke: "#ccc",});
                }
                else if (num == 1) {
                    this.raph.rect(i*sz, j*sz, sz, sz).attr({fill: "#fff", stroke: "#fff",});
                }
                else if (num == 2) {
                    this.raph.rect(i*sz, j*sz, sz, sz).attr({fill: "#aaa", stroke: "#aaa",});
                }
            }
        }
        
        this.raph.text(75, 75, this.currentTile.buildName.nw).attr({stroke: "#FFF"});
        this.raph.text(425, 75, this.currentTile.buildName.ne).attr({stroke: "#FFF"});
        this.raph.text(425, 425, this.currentTile.buildName.se).attr({stroke: "#FFF"});
        this.raph.text(75, 425, this.currentTile.buildName.sw).attr({stroke: "#FFF"});
        

        
        
        if (this.currentTile.BG_grid[0][4] == 1){
                this.raph.text(250, 100, this.currentTile.roadName.vert).rotate(-90);
        } else if(this.currentTile.BG_grid[9][4] == 1){
                this.raph.text(250, 400, this.currentTile.roadName.vert).rotate(-90);
        }

        if (this.currentTile.BG_grid[4][9] == 1){
            this.raph.text(400, 250, this.currentTile.roadName.horiz);
        } else if (this.currentTile.BG_grid[4][0] == 1){
            this.raph.text(100, 250, this.currentTile.roadName.horiz);
        }


    },
    
    createGPSMap: function(){
        var hold = this.auxHolder;
        // height and width of each of the little boxes
        var sz = Math.min(300/(this.currentMap.height*10),300/(this.currentMap.width*10));
        
        var cell_type; // this 
        hold.text(200, 30, "GPS Map");
        
        // draw all the tiles
        for (var x = 0 ; x < this.currentMap.height; x++){
            for (var y = 0 ; y < this.currentMap.width ; y++){
                if(this.currentMap[y][x]){
                    // draw the individual tiles
                    for (i = 0 ; i < 10 ; i++){
                        for (j = 0 ; j < 10 ; j++){
                            cell_type = this.currentMap[y][x].BG_grid[j][i];
                            if (cell_type == 0) {
                                hold.rect(i*sz+100*x+50,j*sz+100*y+50,sz,sz).attr({fill: "#ccc", stroke: "#ccc",});
                            }
                            else if (cell_type == 1) {
                                hold.rect(i*sz+100*x+50,j*sz+100*y+50,sz,sz).attr({fill: "#fff", stroke: "#fff",});
                            }
                            else if (cell_type == 2) {
                                hold.rect(i*sz+100*x+50,j*sz+100*y+50,sz,sz).attr({fill: "#aaa", stroke: "#aaa",});
                            }
                            else if (cell_type > 2) {
                                hold.rect(i*sz+100*x+50,j*sz+100*y+50,sz,sz).attr({fill: "#953", stroke: "#953",});
                            }
                        }       
                    }
                } else {
                    hold.rect(x*100 + 50, y*100 + 50, 100, 100).attr({fill: "#777", stroke: "#777",});
                }
            }
        }
        this.updateGPSMapPlayer();
        hold.text(200, 400, "Controls\n\nUP: Move your player forward\n\nLEFT/RIGHT: Turn your player left/right" + 
            "\n\nDOWN: Use GPS to get player direction and position on the map");
    },
    
        // draw the player on the GPS map
    updateGPSMapPlayer: function(){
        // remove the player from the screen
        if (this.GPSMapPlayer){
            this.GPSMapPlayer.remove();
        }
        var localx = parseInt(this.player.x_pos/50); // the positions of the player in the current tile
        var localy = parseInt(this.player.y_pos/50);
        this.GPSMapPlayer = this.auxHolder.rect(localx*10 + this.tilePos[1]*100 + 50, 
            localy*10 + this.tilePos[0]*100 + 50, 10, 10);
        this.GPSMapPlayer.attr({fill: "#00f", stroke: "#fff",});
    },
    
    pause: function(){
        this.raph.clear();
        this.raph.text(this.height/2, this.width/2, "Game Paused");
        this.isPaused = true;
    },
    
    unpause: function(){
        this.createBG();
        this.createPlayer();
        this.isPaused = false;
    },
    
    // the event handlers for button presses
    keyDown: function(e) {     
        // pause the game (do not let any of the buttons work and clear the screen)
        if (e.keyCode == dojo.keys.SPACE) {
            if (!this.isPaused){
                this.pause();
            } else {
                this.unpause();
            }
        }
        
        // if the game is paused, so no allow buttons to work
        if (this.isPaused){
            return;
        }
    
        // checks if the player is going to run into any obstacles and performs any actions necessary 
        // If the move if legal, this moves the player forward.
        if (e.keyCode == dojo.keys.UP_ARROW) {
            
            // calculate the next position of the player
            var next_x = this.player.x_pos + this.x_map[this.player.direction]*this.player.speed;
            var next_y = this.player.y_pos + this.y_map[this.player.direction]*this.player.speed;
            
            // check if the player walks off the map
            // If there is another tile available, the new tile is loaded.
            // Otherwise the player is alerted that they cannot continue
            if (next_x > this.height-10 || next_x < 10 || next_y > this.width-10 || next_y < 10){
                this.audio.stop();
                // load the tile to the north
                if (next_y < this.height*0.1 &&    
                    this.currentMap[this.tilePos[0] - 1][this.tilePos[1]]){ // check if the adj tile exists
                    this.tilePos[0]--;
                    this.currentTile = this.currentMap[this.tilePos[0]][this.tilePos[1]];
                    this.player.y_pos = this.player.y_pos + this.height - 20;
                    this.audio.say({text: "You walked one block north."});
                }  
                // load the tile to the east
                else if (next_x > this.width*0.9 &&    
                    this.currentMap[this.tilePos[0]][this.tilePos[1] + 1]){ // check if the adj tile exists
                    this.tilePos[1]++;
                    this.currentTile = this.currentMap[this.tilePos[0]][this.tilePos[1]];
                    this.player.x_pos = this.player.x_pos - this.height + 20;
                    this.audio.say({text: "You walked one block east."});
                }
                // load the tile to the south
                else if (next_y > this.height*0.9 &&    
                    this.currentMap[this.tilePos[0] + 1][this.tilePos[1]]){ // check if the adj tile exists
                    this.tilePos[0]++;
                    this.currentTile = this.currentMap[this.tilePos[0]][this.tilePos[1]];
                    this.player.y_pos = this.player.y_pos - this.height + 20;
                    this.audio.say({text: "You walked one block south."});
                }
                // load the tile to the est
                else if (next_x < this.width*0.1 &&     
                    this.currentMap[this.tilePos[0]][this.tilePos[1] - 1]){ // check if the adj tile exists
                    this.tilePos[1]--;
                    this.currentTile = this.currentMap[this.tilePos[0]][this.tilePos[1]];
                    this.player.x_pos = this.player.x_pos + this.height - 20;
                    this.audio.say({text: "You walked one block west."});
                }
                // The adjecent tile does not exist
                else {
                    this.audio.say({text: "That is out of bounds."});
                }
                this.raph.clear();
                this.createBG();
                this.createPlayer();
                return;
            }

            // check if the player walks into a building
            if (this.currentTile.BG_grid[parseInt(next_y/50)][parseInt(next_x/50)] > 2 ||
              this.currentTile.BG_grid[parseInt((next_y-10)/50)][parseInt((next_x-10)/50)] > 2){
                this.audio.stop();
                this.audio.say({text: "you are running into a building"});
                return;
            }
            
            // check if the player walks onto the street corner
            if (this.currentTile.BG_grid[parseInt(next_y/50)][parseInt(next_x/50)] == 2){
                if (!this.player.onCorner){
                    this.audio.stop();
                   // this.audio.stop({channel: "bgnoise"});
                    this.audio.say({text: "You have walked onto a street corner. " + 
                        "Walk to the curb to cross the street."});
                    this.player.onCorner = true;
                } else {

                    
                }
            }
            
            // check if the player walks off the street corner
            if (this.currentTile.BG_grid[parseInt(next_y/50)][parseInt(next_x/50)] == 0 && this.player.onCorner){
                this.audio.stop();
                this.audio.say({text: "You have walked off the street corner."})
                //this.audio.play({url: "sounds/corner", channel: "bgnoise"});
                this.player.onCorner = false;
            }
            
                        
            // check if the player walks into the street
            if (this.currentTile.BG_grid[parseInt(next_y/50)][parseInt(next_x/50)] == 1){
                this.audio.stop();
                
                // Play the Mini Game
                if (this.player.onCorner) {
                    this.playGame();
                    return;
                } else {                    
                    this.audio.say({text: "You ran into the street"});
                    return;
                }
            }
        
            // if all the criteria pass, update the position of the player
            this.player.body.translate(next_x - this.player.x_pos, next_y - this.player.y_pos);
            this.player.face.translate(next_x - this.player.x_pos, next_y - this.player.y_pos);
            this.player.x_pos = next_x;
            this.player.y_pos = next_y;
            this.updateGPSMapPlayer();
        }
        
        // turn the player left
        if (e.keyCode == dojo.keys.LEFT_ARROW) {
            if (this.player.direction == 0){
                this.player.face.translate(-10, 10);
            } else if (this.player.direction == 1){
                this.player.face.translate(-10, -10);
            } else if (this.player.direction == 2){
                this.player.face.translate(10, -10);
            } else if (this.player.direction == 3){
                this.player.face.translate(10, 10);
            }
            this.player.face.rotate(-90);
            this.player.direction = (this.player.direction+3)%4;
        }
        
        // turn the player right
        if (e.keyCode == dojo.keys.RIGHT_ARROW) {
            if (this.player.direction == 0){
                this.player.face.translate(10, 10);
            } else if (this.player.direction == 1){
                this.player.face.translate(-10, 10);
            } else if (this.player.direction == 2){
                this.player.face.translate(-10, -10);
            } else if (this.player.direction == 3){
                this.player.face.translate(10, -10);
            }
            this.player.face.rotate(90);
            this.player.direction = (this.player.direction+1)%4;
        }
        
        // the GPS button; states the direction of the player, the nearby roads and the building near the player
        if (e.keyCode == dojo.keys.DOWN_ARROW) {
            this.audio.stop();
            var dir; //direction the player is facing
            var doh, dov;  // direction of vertical and direction of horizontal
            var building;
            
            // say which direction the player faces
            if (this.player.direction == 0){
                dir = 'north';
            } else if (this.player.direction == 1){
                dir = 'east';
            } else if (this.player.direction == 2){
                dir = 'south';
            } else if (this.player.direction == 3){
                dir = 'west';
            }
            this.audio.say({text: "You are facing " + dir});
            
            // say where the streets are at
            var road;
            if (road = this.facingRoad()){
               this.audio.say({ text: road + " is in front of you."});
            }
            this.player.direction = (this.player.direction+1)%4;
            if (road = this.facingRoad()){
                this.audio.say({ text: road + " is to your right."});
            }
            this.player.direction = (this.player.direction+1)%4;
            if (road = this.facingRoad()){
                this.audio.say({ text: road + " is behind you."});
            }
            this.player.direction = (this.player.direction+1)%4;
            if (road = this.facingRoad()){
                this.audio.say({ text: road + " is to your left."});
            }
            this.player.direction = (this.player.direction+1)%4;
            
                    
            // state the nearest building
            var building;
            if (building = this.findNearestBuilding()) {
                this.audio.say({ text: "You are standing next to" + building});
            }
        }

        
        dojo.byId('form2').value = this.findNearestBuilding();
        dojo.byId('form1').value = this.facingRoad();
    },
    
    // returns true if the player is facing towards a road, and false otherwise
    // this is used primarily for the GPS in KeyDown()
    facingRoad: function(){        
        var coord = this.findPlayerGridCoord();
        while (this.currentTile.BG_grid[coord[1]] && 
          typeof this.currentTile.BG_grid[coord[1]][coord[0]] == "number"){
            if (this.currentTile.BG_grid[coord[1]][coord[0]] == 1){
                if (this.player.direction%2 == 0){
                    return this.currentTile.roadName.horiz;
                } else {
                    return this.currentTile.roadName.vert;
                }
            }
            coord[0] += this.x_map[this.player.direction];
            coord[1] += this.y_map[this.player.direction];
        }
        return null;
    },
    
    // finds the building closest to the player.  if the closest building is not labled, it returns null
    // THIS IS WRONG! IT NEEDS TO BE FIX!
    findNearestBuilding: function(){
        var coord = this.findPlayerGridCoord();
        var num = null;
        if ((num = this.currentTile.BG_grid[coord[0]][coord[1]+1]) > 2){}         // north spot
        else if ((num = this.currentTile.BG_grid[coord[0]][coord[1]-1]) > 2){}    // south spot
        else if ((num = this.currentTile.BG_grid[coord[0]+1][coord[1]]) > 2){}    // east spot
        else if ((num = this.currentTile.BG_grid[coord[0]-1][coord[1]]) > 2){}    // west spot
        else if ((num = this.currentTile.BG_grid[coord[0]+1][coord[1]+1]) > 2){}  // 
        else if ((num = this.currentTile.BG_grid[coord[0]+1][coord[1]-1]) > 2){} 
        else if ((num = this.currentTile.BG_grid[coord[0]-1][coord[1]+1]) > 2){} 
        else if ((num = this.currentTile.BG_grid[coord[0]-1][coord[1]-1]) > 2){} 
        else {return null;}
        
        // decide which building it is
        if (num == 3) {return this.currentTile.buildName.nw};
        if (num == 4) {return this.currentTile.buildName.sw};
        if (num == 5) {return this.currentTile.buildName.se};
        if (num == 6) {return this.currentTile.buildName.ne};
    },
    
    // returns the coordinates if the player in the current tile's grid
    findPlayerGridCoord: function(){
        var x = parseInt(this.player.x_pos/50);
        var y = parseInt(this.player.y_pos/50);
        return [x,y];
    },
              
    playGame: function(){
    
        // remove the control from the main game, in order to give the mini game control
        this.audio.stop();
        dojo.disconnect(this.link);
        
        // clear the auxillary holder for the use by the miniGame
        this.GPSMapPlayer.remove();
        this.auxHolder.clear();
        
        // play the mini game and "wait" until it is over
        var m = new miniGame(this.auxHolder);
        this.waitUntilFinished(m);
    },
    
    waitUntilFinished: function(game){
        this.counter++;
        if (game.isOver == true){
        
            // return control to the main game
            this.audio.stop();
            this.link = dojo.connect(window, 'keydown', this, 'keyDown');
            this.createGPSMap();
            // if the player won the mini game, put him across the street
            if (game.isSuccess == true){
                this.player.body.translate(this.x_map[this.player.direction]*0.24*this.height,
                    this.y_map[this.player.direction]*0.24*this.width);
                this.player.face.translate(this.x_map[this.player.direction]*0.24*this.height,
                    this.y_map[this.player.direction]*0.24*this.width);
                this.player.x_pos += this.x_map[this.player.direction]*0.24*this.width;
                this.player.y_pos += this.y_map[this.player.direction]*0.24*this.width;
            }
        }
        else {
            var self = this;
            setTimeout( function() {  
                self.waitUntilFinished(game);
            }, 330);
        }
        
    },

});



// kick off the game by creating the object
function main() {
    var h1 = Raphael("holder", 500, 500);
    var h2 = Raphael("holder", 500, 500);
    var s = new seeker(h2, h1);
}

// don't start until everything is loaded
dojo.ready(main);

