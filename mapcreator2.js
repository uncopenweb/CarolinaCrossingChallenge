dojo.declare('dragndrop', [ ], {

    width: window.innerWidth,
    height: window.innerHeight,
    
    type_number: {
        'fourway': 210,
        'northt': 42,
        'eastt': 30,
        'southt': 105,
        'westt': 70,
        'horiz': 21,
        'vert': 10,
        'nwcorner': 14,
        'necorner': 6,
        'secorner': 15,
        'swcorner': 35,
    },

    constructor: function() {
    
        var self = this;

        this.raph = Raphael('holder', 1000, 530);
        
        this.map = [];   // this is the object that holds all the map info (road names, building names, etc.)
        this.mapGrid = [];    // This holds the raph objects for the map
        this.tiles = [];  // this holds the tiles from which you can choose
        this.tile_types = ['fourway', 'northt', 'eastt', 'southt', 'westt',
            'nwcorner', 'necorner', 'secorner', 'swcorner', 'vert', 'horiz'];

        for (i = 0 ; i < 11 ; i++){
            this.tiles[i] = this.raph.image("images/background/" + this.tile_types[i] + ".gif", 
                300 + Math.floor(i/6)*100, 40 + (i%6)*80, 70, 70);
            this.setupTileTemplateDrag(this.tiles[i]);
        }

        this.drawEmptyGrid();
       

    },
    
    setupDrag: function(raphObject){
        var self = this;
    
        var dragStart = function(){

            this.toFront();
            this.ox = this.attr("x");
            this.oy = this.attr("y");
            this.attr({opacity: 0.5});
        };
        
        var dragMove = function(dx, dy){
            this.attr({x: this.ox + dx, y: this.oy + dy,});
        };
        
        var dragStop = function(){
            var gridx, gridy;
            
            if (this.attr("x") > 450 && this.attr("x") < 950 && this.attr("y") > -20 && this.attr("y") < 480 ){
                gridx = Math.floor((this.attr("x")+50)/100)-5;
                gridy = Math.floor((this.attr("y")+20)/100);            
                self.mapGrid[gridx + 5*gridy].attr({ src: this.attr("src") });
                self.setupGridDrag(self.mapGrid[gridx + 5*gridy]);
                self.getTileInfo(gridx + 5*gridy);
            }
            
            this.remove();
        };

        raphObject.drag(dragMove, dragStart, dragStop);
    
    },
    
    setupGridDrag: function(raphObject){
        temp = raphObject.clone();
        raphObject.attr({src: "images/background/empty.png"});
        this.setupDrag(temp);
    
    },
    
    setupTileTemplateDrag: function(raphObject){
        var self = this;
    
        var dragStart = function(){
            self.setupTileTemplateDrag(this.clone());
            this.toFront();
            this.ox = this.attr("x");
            this.oy = this.attr("y");
            this.attr({opacity: 0.5, height: 100, width: 100});
        };
        
        var dragMove = function(dx, dy){
            this.attr({x: this.ox + dx, y: this.oy + dy,});
        };
        
        var dragStop = function(){
            var gridx, gridy;
            
            if (this.attr("x") > 450 && this.attr("x") < 950 && this.attr("y") > -20 && this.attr("y") < 480 ){
                gridx = Math.floor((this.attr("x")+50)/100)-5;
                gridy = Math.floor((this.attr("y")+20)/100);            
                self.mapGrid[gridx + 5*gridy].attr({ src: this.attr("src") });
                self.setupGridDrag(self.mapGrid[gridx + 5*gridy]);
            }
            
            this.remove();
        };

        raphObject.drag(dragMove, dragStart, dragStop);
    },
    
    drawEmptyGrid: function(){
        for (i = 0 ; i < 25 ; i++){
            this.mapGrid[i] = this.raph.image('images/background/empty.png', 
                100*(i%5)+500,100*Math.floor(i/5)+30,100,100);
            this.mapGrid[i].imageURL = "empty.png";
        }
    },
    
    // takes the index of the tile you want to get in the array map
    getTileInfo: function(index){
        if (this.map[index]) {

        } else {
            this.map[index] = {};
        }

    
    },

});