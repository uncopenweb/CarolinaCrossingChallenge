


dojo.declare('creator', [ ], {

    width: 500,         // dimensions of the canvas
    height: 500,
    
    tile_template: {
        type: 'fourway',
        name: '',
        
        // the names of the roads
        roadName: {
            vert: 'Vertical Street',  // vertical street
            horiz: 'Horizontal Street',  // horizontal street
        },
        
        buildName: {
            nw: "NW Corner",
            ne: "NE Corner",
            se: "SE Corner",
            sw: "SW Corner",
        },

        BG_grid: null,
    },
    
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
    
        // Here the object that holds the information for the whole page.
        // Each element of the object represents a buttons/spot on the page.
        // 0 = file name of pic, 1 = Rapheal object, 2 = canvas,
        //    3 = x pos, 4 = y pos, 5 = width, 6 = height,
        //    7 = index above, 8 = to right, 9 = below, 10 = to left
        //    11 = tile object for the "map" pieces
        //
    page: [],   
    
        
    
    
        // the constructor gets called when we create the object
    constructor: function(primHolder, auxHolder) {
        var i, self;
        self = this;
       
       // initilize the Raphael canvases
        this.auxHolder = auxHolder;
        this.raph = primHolder;
        
        this.link = dojo.connect(window, 'keydown', this, 'keyDown');
        
        this.ci = 0;  //  currently selected index
        this.select = this.raph.rect(0,0,0,0);  // the object for the selection box
        this.tileSelected = null;  // the current name of the tile template selected
        this.legal = true;  // whether the selection is illegal
        
        // the object that holds the raph text for the tile info
        this.tileInfo1 = this.auxHolder.text(0, 0, " ").attr({
            'font-size' : 14,
        });
                // the object that holds the raph text for the tile info
        this.tileInfo2 = this.auxHolder.text(0, 0, " ").attr({
            'font-size' : 14,
        });
        this.tileInfoBox = this.auxHolder.rect(0,0,0,0).attr({
            fill: "#fff",
            stroke: '#000',
        });
        
        // the first 25 indices of the page are occupied by the empty "map"
        for (i = 0 ; i < 25 ; i++){
            this.page[i] = [
                null, 
                null, 
                this.auxHolder, 
                (i%5)*100,  // x and y
                Math.floor(i/5)*100, 
                100,        // width and height
                100, 
                i-5,        // index to above
                i+1,        // to the right
                i+5,        // below
                i-1         // to the left
            ];
            if (i < 5) {this.page[i][7] = null;}
            if (i%5 == 4) {this.page[i][8] = null;}
            if (i >= 20) {this.page[i][9] = null;}
            if (i == 0) {this.page[i][10] = 25;}
            if (i == 5) {this.page[i][10] = 26;}
            if (i == 10) {this.page[i][10] = 27;}
            if (i == 15) {this.page[i][10] = 28;}
            if (i == 20) {this.page[i][10] = 29;}
            
            // this is the function for the map tiles if ENTER is pressed
            this.page[i][12] = function() {
            
                var p = this;
                
                // If a template tile is currently selected
                if (self.tileSelected && self.legal){
                    p[0] = self.tileSelected;
                    self.tileSelected = null;

                    p[1].remove();
                    p[1] = p[2].image("images/background/" + p[0] + ".gif", p[3], p[4], p[5], p[6]);
                    
                    self.getTileInfo();
                }
                
                
                // remove a tile from the map
                else {
                    p[1].remove();
                    p[1] = p[2].rect(p[3], p[4], p[5], p[6]).attr({
                        fill: "#ccc",
                        stroke: "#000",
                    });
                    p[11] = null;
                    p[0] = null;
                }  
            };
        }
        
        // add the tile options
        this.page[25] = ["fourway", null, this.raph, 
            410, 55, 70, 70, 
            null, 0, 26, 30];
        this.page[26] = ["northt", null, this.raph, 
            410, 135, 70, 70,  
            25, 5, 27, 31];
        this.page[27] = ["westt", null, this.raph, 
            410, 215, 70, 70,  
            26, 10, 28, 32];
        this.page[28] = ["southt", null, this.raph, 
            410, 295, 70, 70,  
           27, 15, 29, 33];
        this.page[29] = ["eastt", null, this.raph, 
            410, 375, 70, 70,  
            28, 20, null, 34];
        this.page[30] = ["vert", null, this.raph, 
            330, 15, 70, 70,  
            null, 25, 31, 36];
        this.page[31] = ["horiz", null, this.raph, 
            330, 95, 70, 70,  
            30, 26, 32, 36];
        this.page[32] = ["nwcorner", null, this.raph, 
            330, 175, 70, 70,  
            31, 27, 33, 36];
        this.page[33] = ["necorner", null, this.raph, 
            330, 255, 70, 70,  
            32, 28, 34, 36];
        this.page[34] = ["secorner", null, this.raph, 
            330, 335, 70, 70, 
            33, 29, 35, 36];
        this.page[35] = ["swcorner", null, this.raph, 
            330, 415, 70, 70, 
            34, 29, null, 36];
            
            // the function the template tiles when ENTER is pressed
        for (i = 25 ; i < 36 ; i ++){
            this.page[i][12] = function() {
                self.tileSelected = this[0];
            };
        }
        

        this.page[36] = ["drawMap", null, this.raph, 100, 100, 200, 100, null, 31, null, null];
        this.page[36][12] = function() {
            self.createMap();
        };
        

        // initialize audio
        uow.getAudio({ defaultCaching: true }).then(dojo.hitch(this, function(a) {
            this.audio = a;  // save the audio object for later use
            this.newGame();
        }));
                
    },
    
    newGame: function(){
            
        this.drawPage();
        this.drawCursor();
    },
    
    drawPage: function(){
        var i, p;
        
        for (i = 0 ; this.page[i] ; i++){
            p = this.page[i];
            if (p[0]){
                p[1] = p[2].image("images/background/" + p[0] + ".gif", p[3], p[4], p[5], p[6]);
                p[2].rect(p[3], p[4], p[5], p[6]).attr({
                    'fill-opacity': 0,
                    stroke: "#000",
                });
            } else {
                p[1] = p[2].rect(p[3], p[4], p[5], p[6]).attr({
                    fill: "#ccc",
                    stroke: "#000",
                });
            }
            p[1].drag(dragMove, dragStart, dragStop);
        }    
    },
    
    
    drawCursor: function(){
        var p;
        p = this.page[this.ci];
        
        this.select.remove();

        this.legal = this.ci < 25 ? this.isLegal() : true;
        
        if (this.tileSelected && this.ci < 25){
            
            // if the move is legal, show an opaque picture of the tile
            if (this.legal && !p[0]){
                this.select = p[2].image("images/background/" + this.tileSelected + ".gif", 
                    p[3],p[4],p[5],p[6]).attr({
                        opacity: 0.25,
                });
            }
            // if the move is not legal, show red rectangle
            else {
                this.select = p[2].rect(p[3],p[4],p[5],p[6]).attr({
                    fill: "#f00",
                    stroke: "#fff",
                    opacity: 0.25,
                });
            }

        }
        // if a template tile is not selected, display a blue rectangle
        else {
            this.select = p[2].rect(p[3],p[4],p[5],p[6]).attr({
                fill: "#00f",
                stroke: "#fff",
                opacity: 0.25,
            });
        }
        
        // display the current tile information
        if (this.ci < 25 && p[11]){
        
            this.tileInfoBox.attr({
                x: 200,
                y: 0,
                height: 100,
                width: 300,
                opacity: .9,
            });
            
            this.tileInfo1.attr({
                text:
                    " \n Vertical Road:    " +
                    " \n Horizontal Road:  " +
                    " \n NW Building:      " +
                    " \n NE Building:      " +
                    " \n SE Building:      " +
                    " \n SW Building:      " ,
                x: 210,
                y: 50,
                'text-anchor': 'start',
            });
            this.tileInfo2.attr({
                text:
                    '~' + p[11].roadName.vert + '\n~' +
                    p[11].roadName.horiz + '\n~' +
                    p[11].buildName.nw + '\n~' + 
                    p[11].buildName.ne + '\n~' + 
                    p[11].buildName.se + '\n~' + 
                    p[11].buildName.sw,
                x: 400,
                y: 50,
            });
            
            if (this.ci%5 > 1 && Math.floor(this.ci/5) < 1){
                this.tileInfoBox.attr('y', 100);
                this.tileInfo1.attr('y', 150);
                this.tileInfo2.attr('y', 150);
            }
            
            this.tileInfoBox.toFront();
            this.tileInfo1.toFront();
            this.tileInfo2.toFront();

        } else {
            this.tileInfoBox.attr({
                height: 0,
                width: 0,
            });
            this.tileInfo1.attr({
                text: "",
            });
            this.tileInfo2.attr({
                text: "",
            });
        }
    },
    
    isLegal: function() {
        var num, i, page;
        num = this.type_number[this.tileSelected];  // the tile number of the currently selected tile
        page = this.page;
        i = this.ci;
        
        if (i < 20 && page[i+5][0] &&
            !(num%5 == 0  && this.type_number[page[i+5][0]]%2 == 0) &&
            !(num%5 != 0  && this.type_number[page[i+5][0]]%2 != 0)){
            return false;
        }
        if (i >= 5 && page[i-5][0] &&
            !(num%2 == 0  && this.type_number[page[i-5][0]]%5 == 0) &&
            !(num%2 != 0  && this.type_number[page[i-5][0]]%5 != 0)){
            return false;
        }
        if (i%5 != 4 && page[i+1][0] &&
            !(num%3 == 0  && this.type_number[page[i+1][0]]%7 == 0) &&
            !(num%3 != 0  && this.type_number[page[i+1][0]]%7 != 0)){
            return false;
        }
        if (i%5 != 0 && page[i-1][0] &&
            !(num%7 == 0  && this.type_number[page[i-1][0]]%3 == 0) &&
            !(num%7 != 0  && this.type_number[page[i-1][0]]%3 != 0)){
            return false;
        }
        
        return true;
    },
    
        
    keyDown: function(e) {

        if (e.keyCode == dojo.keys.UP_ARROW) {
            if(this.page[this.ci][7] != null){
                this.ci = this.page[this.ci][7];
            }
        }

        else if (e.keyCode == dojo.keys.RIGHT_ARROW) {
            if(this.page[this.ci][8] != null){
                this.ci = this.page[this.ci][8];
            }
        }
        
        else if (e.keyCode == dojo.keys.DOWN_ARROW) {
            if(this.page[this.ci][9] != null){
                this.ci = this.page[this.ci][9];
            }
        }
        
        else if (e.keyCode == dojo.keys.LEFT_ARROW) {
            if(this.page[this.ci][10] != null){
                this.ci = this.page[this.ci][10];
            }
        }

        
        // Press Enter
        else if (e.keyCode == dojo.keys.ENTER) {
        
            if (this.page[this.ci][12]){
                this.page[this.ci][12]();
            } else {
                alert("There is an Error.  No function exists for object #" + this.ci + " on the page.");
            }  // a function that each spot has
        }

        this.drawCursor();
    },
    
    getTileInfo: function() {
        var page, ci, tile, vert, horiz, v_default, h_default, streets;
        tile = dojo.clone(this.tile_template);
        
        page = this.page;
        ci =  this.ci;
        
        numbers = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
        v_default = numbers[ci%5] + " Avenue";
        h_default = numbers[Math.floor(ci/5)] + " Street";
        
        // check tile above current tile for an existing road
        if (ci >= 5 && page[ci-5][0]){
            if (this.type_number[page[ci][0]]%2 == 0 && this.type_number[page[ci-5][0]]%5 == 0){
                v_default = page[ci-5][11].roadName.vert;
            }
        }
        // check tile to right of current tile for an existing road
        if (ci%5 != 4 && page[ci+1][0]){
            if (this.type_number[page[ci][0]]%3 == 0 && this.type_number[page[ci+1][0]]%7 == 0){
                h_default = page[ci+1][11].roadName.horiz;
            }
        }
        // check tile below current tile for an existing road
        if (ci < 20 && page[ci+5][0]){
            if (this.type_number[page[ci][0]]%5 == 0 && this.type_number[page[ci+5][0]]%2 == 0){
                v_default = page[ci+5][11].roadName.vert;
            }
        }
        // check tile to left of current tile for an existing road
        if (ci%5 != 0 && page[ci-1][0]){
            if (this.type_number[page[ci][0]]%7 == 0 && this.type_number[page[ci-1][0]]%3 == 0){
                h_default = page[ci-1][11].roadName.horiz;
            }
        }
        
        vert = prompt("Name of Vertical Road: ", v_default);
        horiz = prompt("Name of Horizontal Road: ", h_default);
        
        tile.roadName.vert = vert;
        tile.roadName.horiz = horiz;
        
        this.page[this.ci][11] = tile;
        
        
        this.updateBuildings();
    },
    
    // updates the building names for the current tile based on what's in the text boxes
    updateBuildings: function(){
        var tile = this.page[this.ci][11];
        if (tile){
            tile.buildName.ne = (dojo.byId("form1").value) ? 
                dojo.byId("form1").value : "NE/" + this.ci%5 + Math.floor(this.ci/5);
            tile.buildName.nw = (dojo.byId("form2").value) ? 
                dojo.byId("form2").value : "NW/" + this.ci%5 + Math.floor(this.ci/5);
            tile.buildName.se = (dojo.byId("form3").value) ? 
                dojo.byId("form3").value : "SE/" + this.ci%5 + Math.floor(this.ci/5);
            tile.buildName.sw = (dojo.byId("form4").value) ? 
                dojo.byId("form4").value : "SW/" + this.ci%5 + Math.floor(this.ci/5);
        }
            
    
    },
    
    createMap: function(){
        var map, i;
        map = [];
        for ( i = 0 ; i < 25 ; i++){
        
        }
        alert("HELLOOOOO!");
            
    
    },
    
    map_grids: {
        'fourway': {
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
        'northt': {
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
            4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            6: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            7: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            8: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            9: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
        },
        'eastt': {
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [7, 7, 7, 2, 1, 1, 2, 0, 0, 0],
            4: [7, 7, 7, 0, 1, 1, 1, 1, 1, 1],
            5: [7, 7, 7, 0, 1, 1, 1, 1, 1, 1],
            6: [7, 7, 7, 2, 1, 1, 2, 0, 0, 0],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
        },
        'southt': {
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
        'westt': {
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [0, 0, 0, 2, 1, 1, 2, 7, 7, 7],
            4: [1, 1, 1, 1, 1, 1, 0, 7, 7, 7],
            5: [1, 1, 1, 1, 1, 1, 0, 7, 7, 7],
            6: [0, 0, 0, 2, 1, 1, 2, 7, 7, 7],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
        },
        'horiz': {
            0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            3: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            6: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            7: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            8: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            9: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
        },
        'vert': {
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [7, 7, 7, 2, 1, 1, 2, 7, 7, 7],
            4: [7, 7, 7, 0, 1, 1, 0, 7, 7, 7],
            5: [7, 7, 7, 0, 1, 1, 0, 7, 7, 7],
            6: [7, 7, 7, 2, 1, 1, 2, 7, 7, 7],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
        },
        'nwcorner': {
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [0, 0, 0, 2, 1, 1, 2, 7, 7, 7],
            4: [1, 1, 1, 1, 1, 1, 0, 7, 7, 7],
            5: [1, 1, 1, 1, 1, 1, 0, 7, 7, 7],
            6: [0, 0, 0, 2, 0, 0, 2, 7, 7, 7],
            7: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            8: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            9: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
        },
        'necorner': {
            0: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            1: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            2: [3, 3, 3, 0, 1, 1, 0, 4, 4, 4],
            3: [7, 7, 7, 2, 1, 1, 2, 0, 0, 0],
            4: [7, 7, 7, 0, 1, 1, 1, 1, 1, 1],
            5: [7, 7, 7, 0, 1, 1, 1, 1, 1, 1],
            6: [7, 7, 7, 2, 0, 0, 2, 0, 0, 0],
            7: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            8: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
            9: [6, 6, 6, 7, 7, 7, 7, 5, 5, 5],
        },
        'secorner': {
            0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            3: [7, 7, 7, 2, 0, 0, 2, 0, 0, 0],
            4: [7, 7, 7, 0, 1, 1, 1, 1, 1, 1],
            5: [7, 7, 7, 0, 1, 1, 1, 1, 1, 1],
            6: [7, 7, 7, 2, 1, 1, 2, 0, 0, 0],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
        },
        'swcorner': {
            0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
            3: [0, 0, 0, 2, 0, 0, 2, 7, 7, 7],
            4: [1, 1, 1, 1, 1, 1, 0, 7, 7, 7],
            5: [1, 1, 1, 1, 1, 1, 0, 7, 7, 7],
            6: [0, 0, 0, 2, 1, 1, 2, 7, 7, 7],
            7: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            8: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
            9: [6, 6, 6, 0, 1, 1, 0, 5, 5, 5],
        },
    },        
    
});

