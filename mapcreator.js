    dojo.require("dijit.form.Button");
    dojo.require("dijit.Dialog");
    dojo.require("dijit.form.TextBox");

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

    constructor: function(holder) {
    
        var self = this;

        this.raph = holder;
        
        this.map = [];   // this is the object that holds all the map info (road names, building names, etc.)
        this.mapGrid = [];    // This holds the raph objects for the map
        this.tiles = [];  // this holds the tiles from which you can choose
        this.tile_types = ['nwcorner', 'necorner', 'secorner', 'swcorner', 'vert', 'horiz',
            'fourway', 'northt', 'eastt', 'southt', 'westt'];
        this.currentlySelectedTile = null;

        for (i = 0 ; i < 11 ; i++){
            this.tiles[i] = this.raph.image("images/background/" + this.tile_types[i] + ".gif", 
                300 + Math.floor(i/6)*100, 40 + (i%6)*80, 70, 70);
            this.tiles[i].tileType = this.tile_types[i];
            this.tiles[i].fresh = true;
            this.setupCopyDrag(this.tiles[i]);
        }

        this.drawEmptyGrid();

        dojo.connect(dijit.byId("button1"), "onClick", this, "getTileInfo");
    },
    
    setupDrag: function(raphObject, newURL, removeDrag){
        var self, dragStart, dragMove, dragStop, startx, starty, stopx, stopy;
        self = this;
        
        dragStart = function(){       
            self.currentlySelectedTile = this;
            
            startx = Math.floor((this.attr("x") + 50)/100)-5;
            starty = Math.floor((this.attr("y") + 20)/100);

            this.toFront();
            this.ox = this.attr("x");
            this.oy = this.attr("y");
            this.attr({opacity: 0.5});
        };
        
        dragMove = function(dx, dy){
            this.attr({x: this.ox + dx, y: this.oy + dy,});
        };

        dragStop = function(){ 
            var x = this.attr("x");
            var y = this.attr("y");
            if ( x > 450 && x < 950 && y > -20 && y < 480 ){
                
                endx = Math.floor((x + 50)/100)-5;
                endy = Math.floor((y + 20)/100);            
                self.placeTileOnGrid(endx + 5*endy, this, startx + starty*5);
            } else {
                this.remove();
                self.mapGrid[startx + 5*starty] = null;
            }
        };        
    
        raphObject.drag(dragMove, dragStart, dragStop);
    },
    
    setupCopyDrag: function(raphObject, newURL, removeDrag){
        var self, copy, dragStart, dragMove, dragStop, startx,starty;
        self = this;
        
        dragStart = function(){
            copy = this.clone();
            copy.tileType = this.tileType;
            
            self.currentlySelectedTile = copy;
            
            copy.toFront();
            copy.ox = copy.attr("x");
            copy.oy = copy.attr("y");
            copy.attr({opacity: 0.5});
        };
        
        dragMove = function(dx, dy){
            copy.attr({x: copy.ox + dx, y: copy.oy + dy,});
        };

        dragStop = function(){ 
            var x = copy.attr("x");
            var y = copy.attr("y");
            if ( x > 450 && x < 950 && y > -20 && y < 480 ){            
                gridx = Math.floor((x + 35)/100)-5;
                gridy = Math.floor((y + 5)/100); 
                
                self.setupDrag(copy);           
                self.placeTileOnGrid(gridx + 5*gridy, copy);
            } else {
                copy.remove();
                self.mapGrid[startx + 5*starty] = null;
            }
        };        
    
        raphObject.drag(dragMove, dragStart, dragStop);
    },
   

    
    drawEmptyGrid: function(){
        var self = this;
        
        for (i = 0 ; i < 25 ; i++){
            this.raph.rect(100*(i%5)+500,100*Math.floor(i/5)+30,100,100).attr({
                fill: "#ccc",
                stroke: "#000",
            });
        }
    },
    
    // this gets the information from the dialog box for the currentlySelectedTile
    // This is connected with the "Change Tile Info" button in the dialog box
    getTileInfo: function(){
        var info = this.currentlySelectedTile.tileInfo;
        
        if (!info){
            return;
        }
        
        info.vert = dijit.byId("vert").attr('value');
        info.horiz = dijit.byId("horiz").attr('value');
        info.nw = dijit.byId("nw").attr('value');
        info.ne = dijit.byId("ne").attr('value');
        info.se = dijit.byId("se").attr('value');
        info.sw = dijit.byId("sw").attr('value');
        
    },
    
    // prompts the pop up window to get the tile information
    displayInfoBox: function(raphObject, index){
        if (!raphObject.tileInfo){
            raphObject.tileInfo = {
                vert: "Avenue #" + (index%5 + 1),
                horiz: "Street #" + (Math.floor(index/5) + 1),
                nw: "a building",
                ne: "a building",
                se: "a building",
                sw: "a building"
            }
        }
        
            // copy the name of the vertical road above or below the tile
        if (index >= 5 && this.mapGrid[index-5]){
            raphObject.tileInfo.vert = this.mapGrid[index-5].tileInfo.vert;
        } else if (index < 20 && this.mapGrid[index+5]){
            raphObject.tileInfo.vert = this.mapGrid[index+5].tileInfo.vert;
        }
        
            // copy the name of the horizontal road to teh left or right of the tile
        if (index%5 != 4 && this.mapGrid[index+1]){
            raphObject.tileInfo.horiz = this.mapGrid[index+1].tileInfo.horiz;
        } else if (index%5 != 0 && this.mapGrid[index-1]){
            raphObject.tileInfo.horiz = this.mapGrid[index-1].tileInfo.horiz;
        }

        dijit.byId("vert").set('value',raphObject.tileInfo.vert);
        dijit.byId("horiz").set('value', raphObject.tileInfo.horiz);
        dijit.byId("nw").set('value', raphObject.tileInfo.nw);
        dijit.byId("ne").set('value', raphObject.tileInfo.ne);
        dijit.byId("se").set('value', raphObject.tileInfo.se);
        dijit.byId("sw").set('value', raphObject.tileInfo.sw);
    
        formDlg = dijit.byId("formDialog");
        
        formDlg.show();
        
        
    },
    
    // place raphObject into the map grid at the index
    placeTileOnGrid: function(index, raphObject, startindex){
        var isLegal = true;
        
    
        if (!isNaN(startindex)){
            this.mapGrid[startindex] = null;
        }
        
        // check if the placement will be legal
            // check above tile
        if (index - 5 >= 0 && this.mapGrid[index-5] && 
                (   
                    (
                        this.type_number[this.mapGrid[index-5].tileType]%5 == 0 && 
                        this.type_number[raphObject.tileType]%2 != 0
                    ) || 
                    (
                        this.type_number[this.mapGrid[index-5].tileType]%5 != 0 && 
                        this.type_number[raphObject.tileType]%2 == 0
                    )
                )
            ){
            isLegal = false;
        }
            // check tile below
        if (index + 5 < 20 && this.mapGrid[index+5] && 
                (   
                    (
                        this.type_number[this.mapGrid[index+5].tileType]%2 == 0 && 
                        this.type_number[raphObject.tileType]%5 != 0
                    ) || 
                    (
                        this.type_number[this.mapGrid[index+5].tileType]%2 != 0 && 
                        this.type_number[raphObject.tileType]%5 == 0
                    )
                )
            ) {
            isLegal = false;
        }
            // check tile to the right
        if (index%5 != 4 && this.mapGrid[index+1] && 
                (   
                    (
                        this.type_number[this.mapGrid[index+1].tileType]%7 == 0 && 
                        this.type_number[raphObject.tileType]%3 != 0
                    ) || 
                    (
                        this.type_number[this.mapGrid[index+1].tileType]%7 != 0 && 
                        this.type_number[raphObject.tileType]%3 == 0
                    )
                )
            ) {
            isLegal = false;
        }
            // check tile to the left
         if (index%5 != 0 && this.mapGrid[index-1] && 
                (   
                    (
                        this.type_number[this.mapGrid[index-1].tileType]%3 == 0 && 
                        this.type_number[raphObject.tileType]%7 != 0
                    ) || 
                    (
                        this.type_number[this.mapGrid[index-1].tileType]%3 != 0 && 
                        this.type_number[raphObject.tileType]%7 == 0
                    )
                )
            ) {
            isLegal = false;
        }
        
            // what to do if the move is legal
        if (isLegal){
        
            if (this.mapGrid[index]){
                this.mapGrid[index].remove();
            }
            
            this.mapGrid[index] = raphObject;
            raphObject.attr({
                x: (index%5+5)*100,
                y: Math.floor(index/5)*100 + 30, 
                opacity: 1, 
                height: 100, 
                width: 100
            });
        
            this.displayInfoBox(raphObject, index);
        }
            // what to do if the move is illegal
        else {
                // the tile has no previous spot, so it is removed
            if (isNaN(startindex)){
                raphObject.remove();
            }   // the tile moves back to its previous spot 
            else {
                this.mapGrid[startindex] = raphObject;
                    raphObject.attr({
                        x: (startindex%5+5)*100,
                        y: Math.floor(startindex/5)*100 + 30, 
                        opacity: 1, 
                        height: 100, 
                        width: 100
                    });
            }
        }
        
    },
    
    
    
    
    

});