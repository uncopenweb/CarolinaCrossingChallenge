

dojo.declare('miniGame', [ ], {

    width: 500,         // dimensions of the canvas
    height: 500,
    
    isSuccess: false,   // keeps track if the player has crossed the street or not
    isSafe: false,      // keeps track if the player can cross the street
    isActive: false,    // whether the game is active (ie, whether the player can press 'up' to cross the street)
    isOver: false,    // whether the miniGame is over, used for Street Crosser

    
        // the constructor gets called when we create the object
    constructor: function(paper) {
       
       // initilize the Raphael canvas
        this.raph = paper;
        
        this.link = dojo.connect(window, 'keydown', this, 'keyDown');

        // initialize audio
        uow.getAudio({ defaultCaching: true }).then(dojo.hitch(this, function(a) {
            this.audio = a;  // save the audio object for later use
            this.newGame();
        }));
    },
    
    newGame: function() {
    
        this.goPic = this.raph.image("images/go.png", 100, 100, 300, 400).hide();
        this.stopPic = this.raph.image("images/stop.png", 100, 100, 300, 400).hide();

        this.raph.rect(1,1,this.width-2,this.height-2); // draw the border
        
        this.raph.text(this.width/2, 50, "Listen to the street sounds and").attr('font-size', 20);
        this.raph.text(this.width/2, 75, "press up when you want to cross the street.").attr('font-size', 20);
        var v = this.audio.say({text: "Listen to the street sounds and press up when you want to cross the street."});
        var self = this;
        v.callAfter(function(){
            self.playAudio();
        })
    },
    
    playAudio: function(){
        this.audio.setProperty({name : 'volume', value : 1.0});
        var self = this;
        self.isActive = true;
        self.goPic.hide();
        self.stopPic.show();
        var a = this.audio.play({url: 'sounds/test1'});
        a.callBefore( function() {
            self.timer1 = setTimeout(function() {
                self.stopPic.hide();
                self.goPic.show();
                self.isSafe = true;
                }, 6000);
            self.timer2 = setTimeout(function() {
                self.goPic.hide();
                self.stopPic.show();
                self.isSafe = false;
                }, 15000);
        });
        
            a.callAfter( function() {
                if (this.isActive){
                    clearTimeout(self.timer1);
                    clearTimeout(self.timer2);
                    self.audio.stop();
                    self.playAudio();
                }
            });
    },
    
    // the event handlers for button presses
    keyDown: function(e) {
        var self = this


        if (e.keyCode == dojo.keys.UP_ARROW) {

            if (this.isActive == false){
                return;
            }
            
            // stop the audio from playing
            this.isActive = false;
            this.audio.stop();
            window.clearTimeout(this.timer1);
            window.clearTimeout(this.timer2);
            

            // walked at the wrong time, so you try again
            if (this.isSafe == false) {
                this.audio.play({url: 'sounds/miss/miss1'});
                this.audio.say({text: "You walked at the wrong time. Try again"}).callAfter( function(){
                    self.playAudio();
                });
            } // walked at the right time, so the game ends
            else {
                this.isSuccess = true;
                this.audio.play({url: 'sounds/hit/hit3'});
                this.audio.say({text: "You made it safely across.  Good Job!"}).callAfter( function(){
                    self.endGame();
                });
            
            }
        }

        if (e.keyCode == dojo.keys.LEFT_ARROW) {
    
        }

        if (e.keyCode == dojo.keys.SHIFT) {
            this.isSuccess = true;
            this.endGame();
        }
        
        if (e.keyCode == dojo.keys.DOWN_ARROW) {
            this.endGame();
        }
    },
    
    endGame: function(){
        if (this.timer1){
            window.clearTimeout(this.timer1);
            window.clearTimeout(this.timer1);
        }
        this.raph.clear();
        this.audio.stop();
        dojo.disconnect(this.link);
        this.isOver = true;
    },
    
});


// don't start until everything is loaded
dojo.ready(main);

