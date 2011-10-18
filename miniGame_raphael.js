// This is the real version of the mini game that goes with the game

dojo.declare('miniGame', [ ], {

    width: 500,         // dimensions of the canvas
    height: 500,
    
    isSuccess: false,   // keeps track if the player has crossed the street or not
    isSafe: false,      // keeps track if the player can cross the street
    isActive: false,    // whether the game is active (ie, whether the player can press 'up' to cross the street)
    isOver: false,    // whether the miniGame is over, used for Street Crosser
    misses: 0,          // keps track of the number of misses the player has had
    
    audio_info: null,  // the object that the JSON file becomes
    audio_url: null,   // the URL for the traffic clip
    audio_file_number: 3,  // number of available traffic clips (mp3/ogg with adjoining JSON file)

    
        // the constructor gets called when we create the object
    constructor: function(paper, whichSide) {
       
       // initilize the Raphael canvas
        this.raph = paper;
        
        // save the side of the person that the road is on (default is the right side)
        if (whichSide == 'L'){
            this.whichSide = 'L';
        } else {
            this.whichSide = 'R';
        }
        
        this.link = dojo.connect(window, 'keydown', this, 'keyDown');
        
        // get the cross walk pictures
        this.goPic = this.raph.image("images/go.png", 100, 30, 300, 400).hide();
        this.stopPic = this.raph.image("images/stop.png", 100, 30, 300, 400).hide();
        
        this.status_holder = this.raph.rect(100, 350, 300, 100).attr({fill: '#ccf',  stroke: '#00f'});
        
        // a queue for the traffic statuses (first-in-first-out)
        this.status_queue = ["", "", "", ""];  
        this.traffic_status = this.raph.text(250, 400, "");
            
        this.traffic_status.attr({
            'font-size': 18, 
            'text-anchor': 'middle'
        });
        
        

        this.raph.rect(1,1,this.width-2,this.height-2); // draw the border
        
        // write the instructions on the screen
        this.raph.text(this.width/2, 50, "Listen to the street sounds and").attr('font-size', 20);
        this.raph.text(this.width/2, 75, "press up when you want to cross the street.").attr('font-size', 20);

        // initialize audio
        uow.getAudio({ defaultCaching: true }).then(dojo.hitch(this, function(a) {
            this.audio = a;  // save the audio object for later use
            this.importFiles();
        }));
    },
    
    importFiles: function() {
        var self = this;
        var rnd = Math.floor(Math.random()*this.audio_file_number) + 1;  // the radomization of the audio file
        dojo.byId('form1').value = rnd;
        
        // get the url for the sound file
        this.audio_url = 'sounds/traffic/' + rnd + this.whichSide;
        var json_url = "sounds/traffic/" + rnd + ".json";
    
        // "import" the appropriate JSON file
        dojo.xhrGet({
            url : json_url,
            handleAs : "json",
            load : function(response) {
                self.audio_info = response;
                self.newGame();
            },
            error : function(error) {
                alert("Couldn't fetch your data: " + error);
            }
        });

    },
    
    newGame: function() {
        var self = this;
        var v = this.audio.say({text: "Listen to the street sounds and press up when you want to cross the street."});
        
        // We want to put the traffic sound on the audio queue so it will start as soon the directions end
        this.playAudio();

        v.callAfter(function() {
            self.isActive = true;
            self.goPic.hide();
            self.stopPic.show();
        });

    },
    
    playAudio: function(){
        this.audio.setProperty({name : 'volume', value : 1.0});
        this.updateTrafficStatus();
        var self = this;
        var a = this.audio.play({url: this.audio_url});
        a.errBefore( function() {
            alert("Couldn't fetch the audio clip!");
        })
        a.callBefore( function() {
            self.trafficStatus(0);
        }); 

    },
    
    // This is a recursive call that displays the traffic statuses as they occur according to the JSON file
    trafficStatus: function(index){
    
        // base step
        if (index == this.audio_info.length){
            return;
        }

        this.addToQueue(this.audio_info[index].state);
        this.updateTrafficStatus();
        if (this.audio_info[index].state == 'sidesurging' || this.audio_info[index].state == 'sidetraffic'){
            this.isSafe = true;
            this.goPic.show();
            this.stopPic.hide();
        } else {
            this.isSafe = false;
            this.goPic.hide();
            this.stopPic.show();
        }
        
        var self = this;        
        // recursive step
        this.timer1 = setTimeout(function() {
            self.trafficStatus(index+1);
            }, (this.audio_info[index+1].time-this.audio_info[index].time)*1000);
    },
    
    // An object which is used in the updateTrafficStatus to display some text
    statusToText: {
        '': '',
        'crosstraffic': "Cross traffic is active",
        'crossstopping': "Cross traffic is stopping",
        'sidesurging': "Side traffic is surging",
        'sidetraffic': "Side traffic is active",
        'sidestopping': "Side traffic is stopping",
        'crosssurging': "Cross traffic is surging",
    },
    
    updateTrafficStatus: function(){
        this.traffic_status.attr('text',  
            this.statusToText[this.status_queue[0]] + "...\n|||||||||||\n" + 
            this.statusToText[this.status_queue[1]] + ".\n" + 
            this.statusToText[this.status_queue[2]] + ".\n" + 
            this.statusToText[this.status_queue[3]] + "."
        );
    },
    
    // adds the value to the status queue
    addToQueue: function(value) {
        this.status_queue[3] = this.status_queue[2];
        this.status_queue[2] = this.status_queue[1];
        this.status_queue[1] = this.status_queue[0];
        if (value){
            this.status_queue[0] = value;
        } else {
            this.status_queue[0] = "";
        }
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
            if (this.timer1){
                window.clearTimeout(this.timer1);
            }
            

            // walked at the wrong time, so you try again
            if (this.isSafe == false) {
                //this.audio.play({url: 'sounds/miss/miss1'});
                
                this.misses++;
                var a;
                
                if (this.status_queue[0] == 'crosstraffic'){
                    a = this.audio.say({text: "You walked too early into the perpendicular traffic. " + 
                        " Wait until the parallel traffic surges on your side."});
                }
                else if (this.status_queue[0] == 'crossstopping'){
                    a = this.audio.say({text: "You walked too early. " + 
                        " Wait until you hear the perpendicular traffic completely stop and the parallel traffic surge"});
                }
                else if (this.status_queue[0] == 'sidestopping'){
                    a = this.audio.say({text: "You walked too late. " + 
                        " The parallel was stopping and did not have enough time to cross. " +  
                        " Try to cross as soon as you hear the parallel traffic surging."});
                }
                else if (this.status_queue[0] == 'crosssurging'){
                    a = this.audio.say({text: "You walked too late. " + 
                        " The parallel traffic was surging, so you walked into traffic. " +  
                        " Take your time and wait for the parallel traffic to start again."});
                }
                    
                a.callAfter( function(){
                    self.status_queue = ["", "", "", ""]; 
                    self.newGame();
                });
            } 
            // the player walked at the right time, so the game ends
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




