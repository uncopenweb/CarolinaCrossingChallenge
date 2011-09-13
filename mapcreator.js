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
        
            // this is the raphael canvas for the pop-up box
        this.popup = Raphael("picture", 130, 100);
        this.popup.image("images/background/fourway.gif", 20, 0, 100, 100);


        

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
        
        var rect = this.raph.rect(100, 400, 150, 50, 10).attr({
            stroke: "#000",
            fill:"#aaf",
            'stroke-width': 5,
        });
        var quit = this.raph.text(175, 425, "Create the map!").attr({
            'font-size': 18,
        });
        this.quitButton = this.raph.set(rect, quit);
        
        

        this.drawEmptyGrid();

        dojo.connect(dijit.byId("button1"), "onClick", this, "getTileInfo");
        this.quitButton.click(this.createTheMap, this);
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
        
        dojo.byId("picture")
    
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
    
    createTheMap: function(){
    
        var mapName, finalMap, i, tile, info;
        
        if (confirm("Press 'okay' if you are finished editing your map.")){
            mapName = prompt("What is the name of this Map?");
        } else {
            return;
        }
        
        // instantiate the map
        finalMap = {
            name: mapName,
            height: 5,
            width: 5,
            0: [], 
            1: [],
            2: [],
            3: [],
            4: [],
        };
        
        for (i = 0 ; i < 25 ; i++){
            if (!this.mapGrid[i]){
                finalMap[Math.floor(i/5)][i%5] = null;
            } else {
                info = this.mapGrid[i].tileInfo;

                if (!finalMap.start){
                    finalMap.start = [Math.floor(i/5), i%5];
                }
                
                finalMap[Math.floor(i/5)][i%5] = {
                
                    type: this.mapGrid[i].tileType,
                    
                    roadName: {
                        vert: info.vert,
                        horiz: info.horiz,
                    },
                    
                    buildName: {
                        nw: info.nw,
                        ne: info.ne,
                        se: info.se,
                        sw: info.sw,
                    },
                    
                    BG_grid: MAP_GRIDS[this.mapGrid[i].tileType],
  
                };
            }
        }
        
        // trim off excess tile spaces
        var isOkay, ht, wd;
        
            //remove empty rows from the top
        isOkay = false;
        while (!isOkay){
            for (wd = 0 ; wd < finalMap.width ; wd++){
                if (finalMap[0][wd] != null){
                    isOkay = true;
                }
            }
            if (!isOkay){
                for ( ht = 1 ; ht < finalMap.height ; ht++){
                    for (wd = 0 ; wd < finalMap.width ; wd++){
                        finalMap[ht-1][wd] = finalMap[ht][wd];
                    }
                }
                finalMap.height--;
            }
        }
            //remove empty rows from below
        isOkay = false;
        while (!isOkay){
            for (wd = 0 ; wd < finalMap.width ; wd++){
                if (finalMap[finalMap.height-1][wd] != null){
                    isOkay = true;
                }
            }
            if (!isOkay){
                finalMap.height--;
            }  
        }
            //remove empty rows from the left
        isOkay = false;
        while (!isOkay){
            for (ht = 0 ; ht < finalMap.height ; ht++){
                if (finalMap[ht][0] != null){
                    isOkay = true;
                }
            }
            if (!isOkay){
                for ( wd = 1 ; wd < finalMap.width ; wd++){
                    for (ht =0 ; ht < finalMap.height ; ht++){
                        finalMap[ht][wd-1] = finalMap[ht][wd];
                    }
                }
                finalMap.width--;
            }  
        }
            //remove empty rows from the right
        isOkay = false;
        while (!isOkay){
            for (ht = 0 ; ht < finalMap.height ; ht++){
                if (finalMap[ht][finalMap.width-1] != null){
                    isOkay = true;
                }
            }
            if (!isOkay){
                finalMap.width--;
            }
        }
        
        this.showMap(finalMap);
        
            // save the map the online database
        if (confirm("Would like to save this map online?")){
                // make sure the user has a name for the map
            while (mapName == ""){
                mapName = prompt("You need a name for the map.  What is it?");
                finalMap.name = mapName;
            }
            
            if (!mapName) return;
        
            var def = uow.data.getDatabase({
                database: 'CCC', 
                collection : 'maps', 
                mode : 'c'
            });
            
            def.then(function(db) {
                db.newItem({mapName: finalMap});
                db.save();
            });
            
            alert("Congrats! You did it!");
        }
    },
    
        // This is for testing reasons, and NOT TO BE USED IN THE FINAL CREATION
    showMap: function(theMap){

    
        var hold = this.raph;
        // height and width of each of the tiles in the minimap
        var sz = Math.min(300/(theMap.height),300/(theMap.width));
        
        var cell_type; // this 
        this.raph.image("images/gps.gif", 0, 0, 500, 500);
        
        // draw all the tiles
        for (var x = 0 ; x < theMap.width; x++){
            for (var y = 0 ; y < theMap.height ; y++){
                if (theMap[y] && theMap[y][x]){
                    // display the tile picture
                   hold.image("images/background/"+theMap[y][x].type+".gif", x*sz+100, y*sz+100, sz, sz);
                   

                } else {
                    hold.rect(x*sz + 100, y*sz + 100, sz, sz).attr({fill: "#000", stroke: "#000",});
                }
                

            }
        }

    },

});

MAP_GRIDS = {

    'fourway':{
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
            4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            6: [0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
    },
    
    'northt':{
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
            4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            6: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            7: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            8: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            9: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
    },
    
    'eastt':{
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [10,10,10,2, 1, 1, 2, 0, 0, 0],
            4: [10,10,10,0, 1, 1, 1, 1, 1, 1],
            5: [10,10,10,0, 1, 1, 1, 1, 1, 1],
            6: [10,10,10,2, 1, 1, 2, 0, 0, 0],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
    },
    
    'southt':{
            0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            3: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            6: [0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
    },

    'westt':{
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [0, 0, 0, 2, 1, 1, 2, 8, 8, 8],
            4: [1, 1, 1, 1, 1, 1, 0, 8, 8, 8],
            5: [1, 1, 1, 1, 1, 1, 0, 8, 8, 8],
            6: [0, 0, 0, 2, 1, 1, 2, 8, 8, 8],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
    },
    
    'vert':{
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [10,10,10,2, 1, 1, 2, 8, 8, 8],
            4: [10,10,10,0, 1, 1, 0, 8, 8, 8],
            5: [10,10,10,0, 1, 1, 0, 8, 8, 8],
            6: [10,10,10,2, 1, 1, 2, 8, 8, 8],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
    },
    
    'horiz':{
            0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            3: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            6: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            7: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            8: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            9: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
    },
    
    'nwcorner':{
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [0, 0, 0, 2, 1, 1, 2, 8, 8, 8],
            4: [1, 1, 1, 1, 1, 1, 0, 8, 8, 8],
            5: [1, 1, 1, 1, 1, 1, 0, 8, 8, 8],
            6: [0, 0, 0, 2, 0, 0, 2, 8, 8, 8],
            7: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            8: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            9: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
    },
    
    'necorner':{
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [10,10,10,2, 1, 1, 2, 0, 0, 0],
            4: [10,10,10,0, 1, 1, 1, 1, 1, 1],
            5: [10,10,10,0, 1, 1, 1, 1, 1, 1],
            6: [10,10,10,2, 0, 0, 2, 0, 0, 0],
            7: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            8: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
            9: [6, 6, 6, 9, 9, 9, 9, 5, 5, 5],
    },
    
    'secorner':{
            0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            3: [10,10,10,2, 0, 0, 2, 0, 0, 0],
            4: [10,10,10,0, 1, 1, 1, 1, 1, 1],
            5: [10,10,10,0, 1, 1, 1, 1, 1, 1],
            6: [10,10,10,2, 1, 1, 2, 0, 0, 0],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
    },
    
    'swcorner':{
            0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            3: [0, 0, 0, 2, 0, 0, 2, 8, 8, 8],
            4: [1, 1, 1, 1, 1, 1, 0, 8, 8, 8],
            5: [1, 1, 1, 1, 1, 1, 0, 8, 8, 8],
            6: [0, 0, 0, 2, 1, 1, 2, 8, 8, 8],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
    },
}
