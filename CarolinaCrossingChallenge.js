
// What I need to do now:
//  - Contact Gary Bishop to get more audio clips
//  - Add more of the audio clips I already have (by converting to .ogg, changing code etc.)
//  - Organize the x and y coordinate system
//  - Test the game for errors
//  - Build the menus with more options/links
//  - Work on the mini game to make more aesthetic and professional

// This is the menu screen, which selects the game, other menus, and tutorials etc.

dojo.declare('CCC', [ ], {

    width: 500,         // dimensions of the canvas
    height: 500,
   
        
    
        // the constructor gets called when we create the object
    constructor: function(primHolder, auxHolder) {
       
       // initilize the Raphael canvases
        this.auxHolder = auxHolder;
        this.raph = primHolder;
        
        var self = this;    
           
        this.mainMenu = {
            size: 3,
            0: {
                text: "Play Game",
                url: "playgame",
                action: function(){
                    self.currentMenu = self.chooseMap;
                    self.currentTab = 0;
                    self.displayMenu();
                },
            },
            1: {
                text: "Quick Game",
                url: "quick",
                action: function(){
                    self.raph.clear();
                    dojo.disconnect(self.link);
                    
                    // get a random tile in the chapel hill map
                    var map = MAPS.chapel_hill;
                    do {
                        var rnd1 = Math.floor(Math.random() * map.height);
                        var rnd2 = Math.floor(Math.random() * map.width);
                    } while ( !map[rnd1] && !map[rnd1][rnd2])
                    var tile = map[rnd1][rnd2];
                    
                    // get a random building in that tile
                    var rnd3 = Math.floor(Math.random()*4);
                    var obj;
                    if (rnd3 == 0) { obj = tile.buildName.nw;}
                    else if (rnd3 == 1) { obj = tile.buildName.ne;}
                    else if (rnd3 == 2) { obj = tile.buildName.se;}
                    else { obj = tile.buildName.sw;}
                    
                    dojo.byId('form3').value = obj;
                    dojo.byId('form4').value = rnd2 + ", " + rnd1;
                    
                    var s = new seeker(self.raph, self.auxHolder, map, obj, rnd2, rnd1);
                },
            },
            2: {
                text: "Other Menu",
                url: "other",
                action: function(){
                    self.currentMenu = self.otherMenu;
                    self.currentTab = 0;
                    self.displayMenu();
                },
            },
        };
        
        this.otherMenu = {
            size: 2,
            0: {
                text: "Tutorial",
                url: "tutorial",
                action: function(){
                    
                },
            },
            1: {
                text: "Main Menu",
                url: "main",
                action: function(){
                    self.currentMenu = self.mainMenu;
                    self.currentTab = 0;
                    self.displayMenu();
                },
            },
        };
        
        this.chooseMap = {
            size: 3,
            0: {
                text: "Downtown Chapel Hill",
                url: "chapelhill",
                action: function(){
                    self.raph.clear();
                    dojo.disconnect(self.link);
                    var s = new seeker(self.raph, self.auxHolder, MAPS.chapel_hill, 
                        "The Carolina Inn", 1, 2);
                },
            },
            1: {
                text: "Graham",
                url: "graham",
                action: function(){
                    self.raph.clear();
                    dojo.disconnect(self.link);
                    var s = new seeker(self.raph, self.auxHolder, MAPS.graham_nc, 
                        "Graham Middle School", 0, 3, 4, 2);
                },
            },
            2: {
                text: "Main Menu",
                url: "main",
                action: function(){
                    self.currentMenu = self.mainMenu;
                    self.currentTab = 0;
                    self.displayMenu();
                },
            },
        };

        // initialize audio
        uow.getAudio({ defaultCaching: true }).then(dojo.hitch(this, function(a) {
            this.audio = a;  // save the audio object for later use
            this.newGame();
        }));
        
    },
    
    newGame: function(){
        var self = this;
        
        this.currentMenu = this.mainMenu;
        this.currentTab = 0;

        this.audio.say({text: "Welcome to Carolina Crossing Challenge. "}).callAfter( function(){     
            self.link = dojo.connect(window, 'keydown', self, 'keyDown');
        });
        this.audio.say({text: "Press right to move through the menu and press up to select an option."});
        this.displayMenu();
    },
    
    displayMenu: function(){
        this.raph.clear();
            
        this.raph.image("images/menuBG.gif", 0, 0, 500, 500);
        
        for (i = 0 ; i < this.currentMenu.size ; i++){
            this.raph.image("images/" + this.currentMenu[i].url + "N.png", 150, 75*i+250, 200, 50);
        }
        this.raph.image("images/" + this.currentMenu[this.currentTab].url + "A.png",
            150, 75*this.currentTab+250, 200, 50);
        this.audio.say({text: this.currentMenu[this.currentTab].text});
    },
    
        
    
    keyDown: function(e) {
        var self = this

        this.audio.stop();

        if (e.keyCode == dojo.keys.LEFT_ARROW) {
            //this.currentTab = (this.currentTab + this.currentMenu.size-1)%this.currentMenu.size;
            //this.displayMenu();
        }

        if (e.keyCode == dojo.keys.UP_ARROW) {
            this.currentMenu[this.currentTab].action();
        }
        
        if (e.keyCode == dojo.keys.RIGHT_ARROW) {
            this.currentTab = (this.currentTab + 1)%this.currentMenu.size;
            this.displayMenu();
        }
    },
    
});



// kick off the game by creating the object
function main() {
    var h1 = Raphael("holder", 500, 500);
    var h2 = Raphael("holder", 500, 500);
    var s = new CCC(h2, h1);
}

// don't start until everything is loaded
dojo.ready(main);
