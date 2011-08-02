
// the tiles are alignined in a grid for easier manipulation in the CCC game

// these are the different possible types of tiles
// 0 = four-way; 1 = T-shape pointing North; 2,3,4 = East, South, West; 5 = vertical street; 6 = horiz street
tile_types = ['fourway', 'northt', 'eastt', 'southt', 'westt', 'vert', 'horiz'];


MAPS = {
    chapel_hill: {
        name: "Chapel Hill",
        height: 3,
        width: 3,
        // starting tile
        start: [1,1],
        // row 0
        0: {
            // row 0, col 0
            0 : {
                type: 'fourway',
                name: 'Tile 10',
                
                // the names of the roads
                roadName: {
                    vert: 'Church Street',  // vertical street
                    horiz: 'Rosemary',  // horizontal street
                },
                
                buildName: {
                    nw: "Pantana Bob's",
                    ne: "Las Potrillos Mexican",
                    se: "a parking lot",
                    sw: "NC Association Building",
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
            // row 0, col 1
            1 : {
                type: 'fourway',
                name: 'Tile 2',
                
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
            // row 0, col 2
            2: null,
        },
        // row 1
        1: {
            // row 1, col 0
            0: {
                type: 'northt',
                name: 'Tile 5',

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
            // row 1, col 1
            1: {
                type: 'fourway',
                name: 'Tile 1',
                
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
            // row 1, col 2
            2: {
                type: 'northt',
                name: 'Tile 3',

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
        },
        // row 2
        2: {
            // row 2, col 0
            0: {
                type: 'southt',
                name: 'Tile 8',
                
                // the names of the roads
                roadName: {
                    vert: 'Church Street',  // vertical street
                    horiz: 'Rosemary',  // horizontal street
                },
                
                buildName: {
                    nw: "Granville Towers",
                    ne: "Little Frat court",
                    se: "Carolina Inn",
                    sw: "Sigma Phi Epsilon",
                },
                
                // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
                BG_grid: {
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
            },
            // row 2, col 1
            1: {
                type: 'fourway',
                name: 'Tile 4',

                // the names of the roads
                roadName: {
                    vert: 'Columbia',  // vertical street
                    horiz: 'Cameron Avenue',  // horizontal street
                },
                
                buildName: {
                    nw: "Fraternity Court",
                    ne: "Abernathy Hall",
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
            // row 2, col 2
            2: {
                type: 'horiz',
                name: 'Tile 7',
                
                // the names of the roads
                roadName: {
                    vert: '',  // vertical street
                    horiz: 'Cameron Avenue',  // horizontal street
                },
                
                buildName: {
                    nw: "Swain Hall",
                    ne: "The Olde Well",
                    se: "Memorial Hall",
                    sw: "Phillips Hall",
                },
                
                // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
                BG_grid: {
                    0: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
                    1: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
                    2: [3, 3, 3, 7, 7, 7, 7, 4, 4, 4],
                    3: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
                    4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    6: [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
                    7: [6, 6, 6, 8, 8, 8, 8, 5, 5, 5],
                    8: [6, 6, 6, 8, 8, 8, 8, 5, 5, 5],
                    9: [6, 6, 6, 8, 8, 8, 8, 5, 5, 5],
                },
            },
        },
    },

    graham_nc: {
        name: "Chapel Hill",
        height: 5,
        width: 3,
        // starting tile
        start: [1,1],
        // row 0
        0: {
            // row 0, col 0
            0 : null,
            // row 0, col 1
            1 : null,
            // row 0, col 2
            2: {
                type: 'westt',
                name: 'Tile 2',
                
                // the names of the roads
                roadName: {
                    vert: 'Main Street',  // vertical street
                    horiz: 'Robin Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a building",
                    ne: "Kangaroo Express",
                    se: "Taco Bell",
                    sw: "a building",
                },
                
                // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
                BG_grid: {
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
            },
        },
        // row 1
        1: {
            // row 1, col 0
            0: {
                type: 'southt',
                name: 'Tile 5',

                // the names of the roads
                roadName: {
                    vert: 'Melville Street',  // vertical street
                    horiz: 'Gilbreath Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a house",
                    ne: "a house",
                    se: "a house",
                    sw: "a house",
                },
                
                // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
                BG_grid: {
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
            },
            // row 1, col 1
            1: {
                type: 'southt',
                name: 'Tile 1',
                
                // the names of the roads
                roadName: {
                    vert: 'Marshall Street',  // vertical street
                    horiz: 'Gilbreath Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a house",
                    ne: "a building",
                    se: "a building",
                    sw: "a house",
                },
                
                // 0 = sidewalk, 1 = road, 2 = street corner, >2 = building
                BG_grid: {
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
            },
            // row 1, col 2
            2: {
                type: 'fourway',
                name: 'Tile 3',

                // the names of the roads
                roadName: {
                    vert: 'Main Street',  // vertical street
                    horiz: 'Gilbreath Street',  // horizontal street
                },
                
                buildName: {
                    nw: "McDonald's",
                    ne: "CVS Pharmacy",
                    se: "Walgreens",
                    sw: "Bisquitville",
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
        },
        // row 2
        2: {
            // row 2, col 0
            0: {
                type: 'fourway',
                name: 'Tile 8',
                
                // the names of the roads
                roadName: {
                    vert: 'Melville Street',  // vertical street
                    horiz: 'McAden Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a house",
                    ne: "a house",
                    se: "a house",
                    sw: "Graham Middle School",
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
            // row 2, col 1
            1: {
                type: 'fourway',
                name: 'Tile 4',

                // the names of the roads
                roadName: {
                    vert: 'Marshall Street',  // vertical street
                    horiz: 'McAden Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a house",
                    ne: "a building",
                    se: "a building",
                    sw: "a house",
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
            // row 2, col 2
            2: {
                type: 'fourway',
                name: 'Tile 7',
                
                // the names of the roads
                roadName: {
                    vert: 'Main Street',  // vertical street
                    horiz: 'McAden Street',  // horizontal street
                },
                
                buildName: {
                    nw: "Woodlawn Eye Care",
                    ne: "Shell Gas Station",
                    se: "Central Bank",
                    sw: "Suntrust",
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
        },
        // row 3
        3: {
            // row 3, col 0
            0: {
                type: 'fourway',
                name: 'Tile 8',
                
                // the names of the roads
                roadName: {
                    vert: 'Melville Street',  // vertical street
                    horiz: 'Pine Street',  // horizontal street
                },
                
                buildName: {
                    nw: "Graham Middle School",
                    ne: "a house",
                    se: "a house",
                    sw: "a house",
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
            // row 2, col 1
            1: {
                type: 'fourway',
                name: 'Tile 4',

                // the names of the roads
                roadName: {
                    vert: 'Marshall Street',  // vertical street
                    horiz: 'Pine Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a house",
                    ne: "a Car Wash",
                    se: "Tractor Store",
                    sw: "Post Office",
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
            // row 2, col 2
            2: {
                type: 'fourway',
                name: 'Tile 7',
                
                // the names of the roads
                roadName: {
                    vert: 'Main Street',  // vertical street
                    horiz: 'Pine Street',  // horizontal street
                },
                
                buildName: {
                    nw: "an outside strip mall",
                    ne: "City Hall",
                    se: "Bank of America",
                    sw: "Mrs. Tiggywinkles",
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
        },
        // row 4
        4: {
            // row 4, col 0
            0: {
                type: 'fourway',
                name: 'Tile 8',
                
                // the names of the roads
                roadName: {
                    vert: 'Melville Street',  // vertical street
                    horiz: 'Elm Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a house",
                    ne: "a house",
                    se: "a house",
                    sw: "a house",
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
            // row 4, col 1
            1: {
                type: 'fourway',
                name: 'Tile 4',

                // the names of the roads
                roadName: {
                    vert: 'Marshall Street',  // vertical street
                    horiz: 'Elm Street',  // horizontal street
                },
                
                buildName: {
                    nw: "a Funeral Home",
                    ne: "a building",
                    se: "a building",
                    sw: "a building",
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
            // row 4, col 2
            2: {
                type: 'fourway',
                name: 'Tile 7',
                
                // the names of the roads
                roadName: {
                    vert: 'Main Street',  // vertical street
                    horiz: 'Elm Street',  // horizontal street
                },
                
                buildName: {
                    nw: "City Barber Shop",
                    ne: "Car Wash",
                    se: "Courthouse",
                    sw: "Graham Soda Shop and Grill",
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
        },
    },    
};