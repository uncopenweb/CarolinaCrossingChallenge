
MAPS = {
    chapel_hill: {
        1: {
            name: 'Tile 1',
            // lists the name of the tile adjacent to the current tile in the direction
            adjTile: {
                0: 2,
                1: 3,
                2: 4,
                3: 5,
            },
            // the names of the roads
            roadName: {
                vert: 'Columbia',  // vertical street
                horiz: 'Franklin',  // horizontal street
            },
            
            buildName: {
                nw: "Qdoba",
                ne: "Spanky's",
                se: "Top of the Hill Restaurant",
                sw: "University Baptist Church",
            },
            
            // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
            BG_grid: {
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
        },
        2: {
            name: 'Tile 2',
            // lists the name of the tile adjacent to the current tile in the direction
            adjTile: {
                0: null,
                1: null,
                2: 1,
                3: null,
            },
            // the names of the roads
            roadName: {
                vert: 'Columbia',  // vertical street
                horiz: 'Rosemary',  // horizontal street
            },
            
            buildName: {
                nw: "Syd's Hair Shop",
                ne: "RBC Bank",
                se: "a parking lot",
                sw: "Buns restaurant",
            },
            
            // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
            BG_grid: {
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
        },
        3: {
            name: 'Tile 3',
            // lists the name of the tile adjacent to the current tile in the direction
            adjTile: {
                0: null,
                1: null,
                2: null,
                3: 1,
            },
            // the names of the roads
            roadName: {
                vert: 'Henderson Street',  // vertical street
                horiz: 'Franklin Street',  // horizontal street
            },
            
            buildName: {
                nw: "the Post Office",
                ne: "Mc Alister's Deli",
                se: "Polk Place",
                sw: "Battle Hall",
            },
            
            // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
            BG_grid: {
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
        },
        4: {
            name: 'Tile 4',
            // lists the name of the tile adjacent to the current tile in the direction
            adjTile: {
                0: 1,
                1: null,
                2: null,
                3: null
            },
            // the names of the roads
            roadName: {
                vert: 'Columbia',  // vertical street
                horiz: 'Cameron Avenue',  // horizontal street
            },
            
            buildName: {
                nw: "Fraternity Court",
                ne: "Swain Hall",
                se: "Peabody Hall",
                sw: "The Carolina Inn",
            },
            
            // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
            BG_grid: {
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
        },
        5: {
            name: 'Tile 5',
            // lists the name of the tile adjacent to the current tile in the direction
            adjTile: {
                0: null,
                1: 1,
                2: null,
                3: null,
            },
            // the names of the roads
            roadName: {
                vert: 'Church Street',  // vertical street
                horiz: 'Franklin Street',  // horizontal street
            },
            
            buildName: {
                nw: "Lime and Basil",
                ne: "a parking lot",
                se: "Time-Out",
                sw: "35 Chinese",
            },
            
            // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
            BG_grid: {
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
        },
    },
};