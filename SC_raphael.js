
dojo.require("dojo.hash");

// these are the different possible types of tiles
// 0 = four-way; 1 = T-shape pointing North; 2,3,4 = East, South, West; 5 = vertical street; 6 = horiz street
tile_types = ['fourway', 'northt', 'eastt', 'southt', 'westt', 'vert', 'horiz'];

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
    dir_map: ['north', 'east', 'south', 'west'],
    

    
        // the constructor gets called when we create the object
        // primHolder is the left canvas and auxHolder is the right canvas
        // map is the object of the map that is used in this game
        // obj is the name of the objective building, objy is the row, and objx is the column
        // startx is the row of the starting tile, and starty is the column
    constructor: function(primHolder, auxHolder, map, obj, objx, objy, startx, starty) {
       
       // initilize the Raphael canvases
        this.auxHolder = auxHolder;
        this.raph = primHolder;
        
        // toggle the visibility of the game, allowing for palyers with sight to play
        this.visibility = true;
        
        // testing the Dojo hash function
        dojo.byId("form3").value = dojo.hash().split("&");

        //initalize the player
        this.player = {
            x_pos: this.width * 0.34,
            y_pos: this.height * 0.34,
            direction: 2, // 0 = north, 1 = east, 2 = south, 3 = west
            speed: 10,
            onCorner: true,
        }
        
        // initalize the current tile
        if (!map){
            map = MAPS.chapel_hill;
            obj = "The Carolina Inn";
            objx = 1; // the column
            objy = 2; // the row
        }      
        this.currentMap = map;
        
        if (startx && starty){
            this.tilePos = [startx, starty]; 
        } else {
            this.tilePos = [0, 0]; // the first number is the row, the second is the column
        }
        this.currentTile = this.currentMap[this.tilePos[0]][this.tilePos[1]];
        
            
        // initialize objective building to reach
        this.objective = {};
        this.objective.name = obj;
        this.objective.x = objy;
        this.objective.y = objx;
        
        // this is used solely as an object for the GPS map
        this.GPSMapPlayer = null;

        // initialize audio
        uow.getAudio({ defaultCaching: true }).then(dojo.hitch(this, function(a) {
            this.audio = a;  // save the audio object for later use
            this.newGame();
        }));
    },
    
    newGame: function() {
        var self = this;
    
        
        this.createBG();
        this.createPlayer();
        this.createGPSMap();
        
                // Tell player where he is and what he needs to do
        this.player.direction = (this.player.direction + 3)%4;
        var lr = this.facingRoad();
        this.player.direction = (this.player.direction + 1)%4;
        
        this.audio.say({text: "You are now standing on a street corner. " + 
            " You are next to " + this.findNearestBuilding() + ". " +
            lr + " is on your left and " + this.facingRoad() + " is in front of you. " +
            "In this game, your goal is to get to " + this.objective.name + ". " +
            "To walk forward, press up.  To turn left and right, press the left and right arrows. " + 
            "For GPS information, press down on the arrow pad.  Good Luck!"}).callAfter( function() {
                self.link = dojo.connect(window, 'keydown', self, 'keyDown');
            });
        
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
        // height and width of each of the tiles in the minimap
        var sz = Math.min(300/(this.currentMap.height),300/(this.currentMap.width));
        
        var cell_type; // this 
        this.auxHolder.image("images/gps.gif", 0, 0, 500, 500);
        
        // draw all the tiles
        for (var x = 0 ; x < this.currentMap.width; x++){
            for (var y = 0 ; y < this.currentMap.height ; y++){
                if (this.currentMap[y] && this.currentMap[y][x]){
                    // display the tile picture
                   hold.image("images/background/"+this.currentMap[y][x].type+".gif", x*sz+100, y*sz+100, sz, sz);
                   
                    // draw the objective building in yellow
                    if (y == this.objective.x && x == this.objective.y){
                        var cbuild = this.currentMap[y][x].buildName;
                        if (cbuild.nw == this.objective.name){
                            hold.rect(x*sz+100, y*sz+100, sz*0.3, sz*0.3).attr({
                                fill: "#ff0", 
                                stroke: "#ff0",
                            });
                        } else if (cbuild.ne == this.objective.name){
                            hold.rect(x*sz+100+sz*0.7, y*sz+100, sz*0.3, sz*0.3).attr({
                                fill: "#ff0", 
                                stroke: "#ff0",
                            });
                        } else if (cbuild.sw == this.objective.name){
                            hold.rect(x*sz+100, y*sz+100+sz*0.7, sz*0.3, sz*0.3).attr({
                                fill: "#ff0", 
                                stroke: "#ff0",
                            });
                        } else if (cbuild.se == this.objective.name){
                            hold.rect(x*sz+100+sz*0.7, y*sz+100+sz*0.7, sz*0.3, sz*0.3).attr({
                                fill: "#ff0", 
                                stroke: "#ff0",
                            });
                        }
                    }
                } else {
                    hold.rect(x*sz + 100, y*sz + 100, sz, sz).attr({fill: "#000", stroke: "#000",});
                }
                

            }
        }
        this.updateGPSMapPlayer();
        hold.text(250, 430, "Controls\n\nUP: Move your player forward\n\nLEFT/RIGHT: Turn your player left/right" + 
            "\n\nDOWN: Use GPS to get player direction and position on the map");
    },
    
        // draw the player on the GPS map
    updateGPSMapPlayer: function(){
        // remove the player from the screen
        if (this.GPSMapPlayer){
            this.GPSMapPlayer.remove();
        }
        
        var sz = Math.min(300/(this.currentMap.height),300/(this.currentMap.width));
        
        var localx = parseInt(this.player.x_pos/50); // the positions of the player in the current tile
        var localy = parseInt(this.player.y_pos/50);
        this.GPSMapPlayer = this.auxHolder.rect(localx*sz/10 + this.tilePos[1]*sz + 100, 
            localy*sz/10 + this.tilePos[0]*sz + 100, sz/10, sz/10);
        this.GPSMapPlayer.attr({fill: "#00f", stroke: "#fff",});
    },

    
    // the event handlers for button presses
    keyDown: function(e) {     
        var self = this;
    
        // checks if the player is going to run into any obstacles and performs any actions necessary 
        // If the move if legal, this moves the player forward.
        if (e.keyCode == dojo.keys.UP_ARROW) {
        
            this.audio.stop({channel: "playernoise"});
            this.audio.play({url: "sounds/playerstep", channel: "playernoise"});
            
            // calculate the next position of the player
            var next_x = this.player.x_pos + this.x_map[this.player.direction]*this.player.speed*1.5;
            var next_y = this.player.y_pos + this.y_map[this.player.direction]*this.player.speed*1.5;
            
            // check if the player walks off the map
            // If there is another tile available, the new tile is loaded.
            // Otherwise the player is alerted that they cannot continue
            if (next_x > this.height || next_x < 0 || next_y > this.width || next_y < 0){
                this.audio.stop();
                
                var x_scalar = this.x_map[this.player.direction];
                var y_scalar = this.y_map[this.player.direction];
                var next_tile_x = this.tilePos[0] + y_scalar; 
                var next_tile_y = this.tilePos[1] + x_scalar;
                
                // check if the adj tile exists
                if (this.currentMap[next_tile_x] && this.currentMap[next_tile_x][next_tile_y]){ 
                
                    // load the next tile and move the player
                    this.tilePos[0] = next_tile_x;
                    this.tilePos[1] = next_tile_y;
                    this.currentTile = this.currentMap[next_tile_x][next_tile_y];
                    this.player.x_pos += (20 - this.width) * x_scalar;
                    this.player.y_pos += (20 - this.height) * y_scalar;
                    this.audio.say({text: "You walked one block " + this.dir_map[this.player.direction]});
                    
                    // "build" the next tile onto the screen
                    this.raph.clear();
                    this.createBG();
                    this.createPlayer();
                }  
                // The adjecent tile does not exist
                else {
                    this.audio.say({text: "That is out of bounds."});
                }
                return;
            }

            // calculate the type of grid cell the next step is on (avoids repeated calls)
            var cell_type = this.currentTile.BG_grid[parseInt(next_y/50)][parseInt(next_x/50)];
            
            // check if the player walks into a building
            if (cell_type > 2){
                this.audio.stop();
                this.audio.say({text: "You cannot walk into this building."});
                return;
            }
            
            // check if the player walks onto the street corner
            if (cell_type == 2){
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
            if (this.player.onCorner && cell_type == 0){
                this.audio.stop();
                //this.audio.play({url: "sounds/corner", channel: "bgnoise"});
                this.player.onCorner = false;
            }
            
                        
            // check if the player walks into the street
            if (cell_type == 1){
                this.audio.stop();
                
                // Play the Mini Game
                if (this.player.onCorner) {
                    this.miniGamePrompt();
                    return;
                } else {                    
                    this.audio.say({text: "You cannot cross the street here. First walk to a street corner, then try to cross the street."});
                    return;
                }
            }
        
        
            // if all the criteria pass, update the position of the player
            
            // calculate the displacement of the x and y coord
            var x_move = this.x_map[this.player.direction]*this.player.speed;
            var y_move = this.y_map[this.player.direction]*this.player.speed;
            
            // move the player on the screen
            this.player.body.translate(x_move, y_move);
            this.player.face.translate(x_move, y_move);
            
            // update the position of the player object
            this.player.x_pos += x_move;
            this.player.y_pos += y_move;
            
            
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
            
            this.audio.stop();
            this.audio.stop({channel: "playernoise"});
            dojo.disconnect(this.link);
            this.audio.say({
                text: "Turn left. You now facing " + this.dir_map[this.player.direction],
                channel: "playernoise"
            }).callAfter(function(){
                self.link = dojo.connect(window, 'keydown', self, 'keyDown');
            });
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
            
            this.audio.stop();
            this.audio.stop({channel: "playernoise"});
            dojo.disconnect(this.link);
            this.audio.say({
                text: "Turn right. You now facing " + this.dir_map[this.player.direction],
                channel: "playernoise"
            }).callAfter(function(){
                self.link = dojo.connect(window, 'keydown', self, 'keyDown');
            });
        }
        
        // the GPS button; states the direction of the player, the nearby roads and the building near the player
        if (e.keyCode == dojo.keys.DOWN_ARROW) {
            this.audio.stop();
            
            var dir; //direction the player is facing
            var doh, dov;  // direction of vertical and direction of horizontal
            var building;
            
            // say which direction the player faces
            if (this.player.onCorner == true) {
                this.audio.say({text: "You are on a street corner facing " 
                   + this.dir_map[this.player.direction]});
            } else {
                this.audio.say({text: "You are facing " + this.dir_map[this.player.direction]});
            }
            
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
            
                    
            // says the nearest building
            var building;
            if (building = this.findNearestBuilding()) {
                this.audio.say({ text: "You are standing next to" + building});
            }
        }

        
        dojo.byId('form2').value = this.findNearestBuilding();
        dojo.byId('form1').value = this.facingRoad();
    
            // Say where the destination building is
    if (e.keyCode == dojo.keys.SPACE) {
        if (this.tilePos[0] == this.objective.x && this.tilePos[1] == this.objective.y){
            // the player found the building, so the game ends! 
            // We play celebration music and go back to the home screen
            if (this.objective.name == this.findNearestBuilding()){
                return this.winGame();
            } else {
                if (this.currentTile.buildName.ne == this.objective.name){
                    this.audio.say({text: this.objective.name + 
                        " is on the north east corner of this intersection"});
                } else if (this.currentTile.buildName.nw == this.objective.name){
                    this.audio.say({text: this.objective.name + 
                        " is on the north west corner of this intersection"});
                } else if (this.currentTile.buildName.se == this.objective.name){
                    this.audio.say({text: this.objective.name + 
                        " is on the south east corner of this intersection"});
                } else if (this.currentTile.buildName.sw == this.objective.name){
                    this.audio.say({text: this.objective.name + 
                        " is on the south west corner of this intersection"});
                }
                
            }
        } else {
            var dist, dir, unit;
            dist = this.objective.x - this.tilePos[1];
            if (dist != 0){;
                dir = 'east';
                if (dist < 0){
                    dist = -dist;
                    dir = 'west';
                }
                unit = (dist == 1) ? ' block ': ' blocks ';
                this.audio.say({text: this.objective.name + " is" + dist + unit + dir + " and "});
            }
            dist = this.objective.y - this.tilePos[0]
            if (dist != 0){;
                dir = 'south';
                if (dist < 0){
                    dist = -dist;
                    dir = 'north';
                }
                unit = (dist == 1) ? ' block ': ' blocks ';
                this.audio.say({text: dist + unit + dir});
            }
        }
    }
    
    },
    
    // returns true if the player is facing towards a road, and false otherwise
    // this is used primarily for the GPS in KeyDown()
    facingRoad: function(){        
        var coord = this.findPlayerGridCoord();
        var x_scalar = this.x_map[this.player.direction];
        var y_scalar = this.y_map[this.player.direction];
        
        while (coord[0] < 10 && coord[0] >= 0 && coord[1] < 10 && coord[1] >= 0){
            if (this.currentTile.BG_grid[coord[1]][coord[0]] == 1){
                if (this.player.direction%2 == 0){
                    return this.currentTile.roadName.horiz;
                } else {
                    return this.currentTile.roadName.vert;
                }
            }
            coord[0] += x_scalar;
            coord[1] += y_scalar;
        }
        return null;
    },
    
    // finds the building closest to the player.  if the closest building is not labled, it returns null
    findNearestBuilding: function(){
        var coord = this.findPlayerGridCoord();
        var num = null;
        if ((num = this.currentTile.BG_grid[coord[0]][coord[1]+1]) > 2 && num < 7){}         // north spot
        else if ((num = this.currentTile.BG_grid[coord[0]][coord[1]-1]) > 2 && num < 7){}    // south spot
        else if ((num = this.currentTile.BG_grid[coord[0]+1][coord[1]]) > 2 && num < 7){}    // east spot
        else if ((num = this.currentTile.BG_grid[coord[0]-1][coord[1]]) > 2 && num < 7){}    // west spot
        else if ((num = this.currentTile.BG_grid[coord[0]+1][coord[1]+1]) > 2 && num < 7){}  // 
        else if ((num = this.currentTile.BG_grid[coord[0]+1][coord[1]-1]) > 2 && num < 7){} 
        else if ((num = this.currentTile.BG_grid[coord[0]-1][coord[1]+1]) > 2 && num < 7){} 
        else if ((num = this.currentTile.BG_grid[coord[0]-1][coord[1]-1]) > 2 && num < 7){} 
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
    
    // This ends a winning game and starts another instance of the main menu
    winGame: function(){
        var self = this;
    
        dojo.disconnect(this.link);
        this.audio.stop();
        this.audio.play({url: "sounds/winner"});
        this.audio.say({text: "Congratulations.  You reached " + this.findNearestBuilding()}).callAfter( function(){
           self.raph.clear();
           self.auxHolder.clear();
           var c = new CCC(self.raph, self.auxHolder);
        });
    },
              
    playGame: function(){
    
        // remove the control from the main game, in order to give the mini game control
        this.audio.stop();
        dojo.disconnect(this.link);
        
        // clear the auxillary holder for the use by the miniGame
        this.GPSMapPlayer.remove();
        this.auxHolder.clear();
        
        
        // the road is initially on neither side of the player
        var roadSide = 'N'
        
        // check if the road is to the right of the player
        this.player.direction = (this.player.direction+1)%4;
        if (this.facingRoad()){
            roadSide = 'R';
        }
        this.player.direction = (this.player.direction+3)%4;

        // check if the road is to the left of the player
        this.player.direction = (this.player.direction+3)%4;
        if (this.facingRoad()){
            roadSide = 'L';
        }
        this.player.direction = (this.player.direction+1)%4;

        // play the mini game and "wait" until it is over
        var m = new miniGame(this.auxHolder, roadSide);
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
                this.updateGPSMapPlayer();
                
                // check if the player is on the same tile as the destination building
                if (this.tilePos[0] == this.objective.x && this.tilePos[1] == this.objective.y){
                    // the player found the building, so the game ends! 
                    // We play celebration music and go back to the home screen
                    if (this.objective.name == this.findNearestBuilding()){
                        return this.winGame();
                    }
                } else {
                    this.player.direction = (this.player.direction + 2)%4;
                    this.audio.say({text: "Congratulations! You just crossed " + this.facingRoad()});
                    this.player.direction = (this.player.direction + 2)%4;
                    this.audio.say({text: "You are now standing next to " + this.findNearestBuilding()});
                }
            }
        }
        else {
            var self = this;
            setTimeout( function() {  
                self.waitUntilFinished(game);
            }, 330);
        }
        
    },
    
    miniGamePrompt: function(){
        var self = this;
    
        dojo.disconnect(this.link);
        
        
        
        this.audio.say({text: "Do you want to cross " + this.facingRoad() + "?"}).callAfter( function(){
            self.link = dojo.connect(window, 'keydown', self, 'keyDownPrompt');
        });
        this.audio.say({text: "Press up for yes and down for no."});
        
    },
    
    // this is the keyboard control for the mini game prompt
     keyDownPrompt: function(e) {

        if (e.keyCode == dojo.keys.UP_ARROW) {
            this.playGame();
        }
        
        if (e.keyCode == dojo.keys.DOWN_ARROW) {
            this.audio.stop();
            this.audio.say({text: "You decided not to cross the street."});
            dojo.disconnect(this.link);
            this.link = dojo.connect(window, 'keydown', this, 'keyDown');
        }
    },

});

