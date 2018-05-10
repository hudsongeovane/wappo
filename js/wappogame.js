/*
TREE 1
LEFT WALL 2
RIGHT WALL 4
TOP WALL 8
BOTTOM WALL 16
PORTAL 32
TRAP 64
WINGAME 128
*/

var firstMap = [
  /*0, 0, 0, 0, 0, 64, 0, 
    0, 16, 0, 0, 4, 22, 2, 
    0, 8, 0, 4, 6, 10, 0, 
    68, 38, 2, 0, 16, 4, 2, 
    16, 16, 0, 0, 8, 16, 0, 
    140, 10, 4, 6, 2, 56, 0, 
    0, 0, 0, 0, 0, 8, 0, 
    //starting position:
    5, 6, 
    //monsters position
    1, 1, 
    1, 6*/
    0, 0, 0, 0, 16, 16, 0, 
    36, 130, 4, 2, 56, 8, 0, 
    4, 2, 16, 0, 28, 2, 0, 
    16, 16, 12, 6, 10, 4, 2, 
    8, 8, 0, 0, 4, 22, 2, 
    4, 2, 80, 0, 0, 12, 2, 
    0, 0, 8, 0, 0, 0, 0, 
    
	3,6,
	
	1,0,
	3,5
	
    //or more...
];

var myMap = new map(firstMap);


window.addEventListener('keydown', this.check,false);

function check(e) {
    if (myMap.GAMESTATE != 2) return;
    
    var code = e.keyCode;
    console.log(e.keyCode);
    
    //Left arrow
    if (code == 37) {
        myMap.side = 3;
        myMap.move(3);
    }
    //Up arrow
    if (code == 38) {
        myMap.side = 0;
        myMap.move(0);
    }
    //Right arrow
    if (code == 39) {
        myMap.side = 1;
        myMap.move(1);
    }
    //Down arrow
    if (code == 40) {
        myMap.side = 2;
        myMap.move(2);
    }
    myMap.checkStatus();
}

function startGame() {
    myGameArea.start();
}

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 52*7;
		this.canvas.height = 52*7;
		this.context = this.canvas.getContext("2d");

		document.body.insertBefore(this.canvas, document.body.childNodes[0]);

		this.frameNo = 0;
		
		this.interval = setInterval(updateGameArea, 100);
	},
	clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNo += 1;
    ctx = myGameArea.context;
    
    //draw map
    myMap.draw(ctx);
}


