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

var image = new Image(), mapImage = new Image(), tree = new Image(), monster = new Image(), portal = new Image(), wall = new Image();
image.src = "img/wappo.png";
mapImage.src = "img/map.png";
tree.src = "img/tree.png";
monster.src = "img/monster.png";
portal.src = "img/portal.png";
wall.src = "img/wall.png";
function map(loadmap) {
    this.cells = [];
    this.monsters = [];
    this.blockedMonster = [];

    this.monsterMoviments = [];

    //WATING MOVE = 2, MOVING MONSTER = 3, WAPPO_ANIMATING = 4, WON_GAME = 5
    this.GAMESTATE = 2;

    this.start = function () {
        for (i = 0; i < 49; i += 1) {
            this.cells[i] = loadmap[i];
        }
        this.wappoX = loadmap[49];
        this.wappoY = loadmap[50];

        for(i = 51; i < loadmap.length; i++) {
            this.monsters.push(loadmap[i]);
            if (i%2 == 1) this.blockedMonster.push(0);
        }
    };

    this.isValidPosition = function(x,y) {
        if (x < 0 || x > 6 || y < 0 || y > 6) return false;
        if (this.cells[7*x + y] & 1) return false;
        return true;
    };
    this.distance = function(x1,y1,x2,y2) {
        console.log(x1 + "-" + y1 + "-" + x2 + "-" + y2);
        return Math.abs(y2-y1) + Math.abs(x2-x1);
    }
    this.canGoTo = function(to) {
        i = this.wappoX, j = this.wappoY, p = this.cells[7*j + i];
        return !((to == 0 && p & 8) || (to == 1 && p & 4) || (to == 2 && p & 16) || (to == 3 && p & 2));
    };
    this.monsterCanGoTo = function(i,j,to) {
        p = this.cells[7*j + i];
        return !((to == 0 && p & 8) || (to == 1 && p & 4) || (to == 2 && p & 16) || (to == 3 && p & 2));
    };

    //back = 0, right = 1, front = 2, left = 3
    this.side = 2;

    this.lastMove = 2;
    this.animate = 0;

    this.monsterAnimate = 0;

    //up = 0, right = 1, down = 2, left = 3
    this.move = function(to) {
        if ((this.canGoTo(to)) && ((to == 0 && this.isValidPosition(this.wappoY-1,this.wappoX)) || (to == 1 && this.isValidPosition(this.wappoY,this.wappoX+1)) || (to == 2 && this.isValidPosition(this.wappoY+1,this.wappoX)) || (to == 3 && this.isValidPosition(this.wappoY,this.wappoX-1)))) {
            for(i = 0; i < this.blockedMonster.length; i++) {
                if(this.blockedMonster[i] > 0) this.blockedMonster[i]--;
            }
            this.lastMove = to;
            this.GAMESTATE = 4;
        }
    };

    this.clear = function() {
        for(i = 0; i < 49; i++) {
            this.cells[i] = 0;
        }
    };

    this.drawWappo = function(ctx) {
        var k = Math.floor(((myGameArea.frameNo)%8) /2);
        if (this.GAMESTATE == 2 || this.GAMESTATE == 3) {
            ctx.drawImage(image,k*100,this.side * 100,100,100,52*this.wappoX,52*this.wappoY,52,52);
        }
        else if (this.GAMESTATE == 4) {
            var to = this.lastMove;
            this.animate++;
            if (to == 0) {//UP, decrease Y
                ctx.drawImage(image,k*100,this.side * 100,100,100,52*this.wappoX,52*this.wappoY - 10*this.animate,52,52);
            }
            if (to == 1) {//RIGHT, increase X
                ctx.drawImage(image,k*100,this.side * 100,100,100,52*this.wappoX + this.animate*10,52*this.wappoY,52,52);
            }
            if (to == 2) {//DOWN, increase Y
                ctx.drawImage(image,k*100,this.side * 100,100,100,52*this.wappoX,52*this.wappoY + 10*this.animate,52,52);
            }
            if (to == 3) {//LEFT, decrease X
                ctx.drawImage(image,k*100,this.side * 100,100,100,52*this.wappoX - this.animate*10,52*this.wappoY,52,52);
            }
            if (this.animate == 5) {//End of animation. Go to MONSTER MOVEMENT STATE and update the position of WAPPO
                this.animate = 0;
                if (to == 0 && this.isValidPosition(this.wappoY-1,this.wappoX)) {
                    this.wappoY--;
                }
                else if (to == 1 && this.isValidPosition(this.wappoY,this.wappoX+1)) {
                    this.wappoX++;
                }
                else if (to == 2 && this.isValidPosition(this.wappoY+1,this.wappoX)) {
                    this.wappoY++;
                }
                else if (to == 3 && this.isValidPosition(this.wappoY,this.wappoX-1)) {
                    this.wappoX--;
                }

                k = this.cells[7*this.wappoY + this.wappoX];
                joinedPortal = false;
                if (k & 32) {
                    for(i = 0; i < 7 && !joinedPortal; i++) {
                        for(j = 0; j < 7 && !joinedPortal; j++) {
                            if (this.cells[7*j+i] & 32 && 7*j+i != 7*this.wappoY + this.wappoX) {
                                this.wappoY = j;
                                this.wappoX = i;
                                joinedPortal = true;
                            }
                        }
                    }
                }


                this.GAMESTATE = 3;


                if (k & 128) { //Won game
                    this.GAMESTATE = 5;
                }
                //after wappo moves. add monster movements
                if (this.monsterMoviments.length == 0) for(i = 0; i < this.monsters.length; i += 2) {
                    if (this.monsters[i] >= 20) {
                        this.monsterMoviments.push(i);
                        this.monsterMoviments.push(i);
                        this.monsterMoviments.push(i);
                    }
                    else {
                        this.monsterMoviments.push(i);
                        this.monsterMoviments.push(i);
                    }
                }
            }
        }
    };


    //Draw 
    this.draw = function(ctx) {
        if (this.GAMESTATE == 5) {
            ctx.font = "30px Arial";
            ctx.fillText("CONGRATULATIONS!",30,100);
            ctx.fillText("YOU WON!",100,150);
            return;
        }
        //draw map
        for(i = 0; i < 7; i++) {
            for(j = 0; j < 7; j++) {
                k = this.cells[7*j + i];
                if (k & 64) {
                    ctx.drawImage(mapImage,51,51*3,52,52,52*i,52*j,52,52);
                }
                else if (k & 128) {
                    ctx.drawImage(mapImage,51,51*2,52,52,52*i,52*j,52,52);
                }
                else {
                    ctx.drawImage(mapImage,51,0,52,52,52*i,52*j,52,52);
                }
                //check top wall
                if (k & 8) {
                    ctx.drawImage(wall,15,0,52,14,52*i,52*j -3,52,6);
                }
                //check left wall
                if (k & 2) {
                    ctx.drawImage(wall,0,0,14,52,52*i -3,52*j,6,52);
                }
                if (k & 1) {
                    ctx.drawImage(tree,0,0,52,52,52*i,52*j,52,52);
                }
                //draw portal
                if (k & 32) {
                    ctx.drawImage(portal,(myGameArea.frameNo%4)*69,0,69,69,2+ 52*i,2 + 52*j,48,48);
                }
            }
        }

        //draw wappo
        this.drawWappo(ctx);

        if (this.GAMESTATE == 3) {
            if (this.monsterAnimate == 0) {
                this.GAMESTATE = 33;
            }
            this.monsterAnimate++;
            if (this.monsterAnimate == 3) this.monsterAnimate = 0;
        }
        if (this.GAMESTATE == 33) { //make only one move

            //up = 0, right = 1, down = 2, left = 3
            //moving monsters.
            moved = false;

            i = this.monsterMoviments[0];
            if (this.blockedMonster[i/2] > 0) {
                this.monsterMoviments.splice(0,1);
                if (this.monsterMoviments.length == 0) this.GAMESTATE = 2;
                else this.GAMESTATE = 3;
            }

            else {
                _x1 = this.wappoX; _y1 = this.wappoY;
                _x2 = this.monsters[i]%10; _y2 = this.monsters[i+1]%10; currentD = this.distance(_x1,_y1,_x2,_y2);
                //direita
                if (this.distance(_x1,_y1,_x2+1,_y2) < currentD && this.monsterCanGoTo(_x2,_y2,1)) {
                    this.monsters[i] += 1;
                    moved = true;
                }
                //esquerda
                else if (this.distance(_x1,_y1,_x2-1,_y2) < currentD && this.monsterCanGoTo(_x2,_y2,3)) {
                    this.monsters[i] -= 1;
                    moved = true;
                }
                //cima
                else if (this.distance(_x1,_y1,_x2,_y2-1) < currentD && this.monsterCanGoTo(_x2,_y2,0)) {
                    this.monsters[i+1] -= 1;
                    moved = true;
                }
                //baixo
                else if (this.distance(_x1,_y1,_x2,_y2+1) < currentD && this.monsterCanGoTo(_x2,_y2,2)) {
                    this.monsters[i+1] += 1;
                    moved = true;
                }
                if (moved) {
                    if (this.cells[7*(this.monsters[i+1]%10) + (this.monsters[i]%10)] & 64) {
                        this.blockedMonster[i/2] = 4;
                    }
                    mergedmonsters = false;
                    for(k = 0; k < this.monsters.length; k += 2) {
                        if (k != i)
                            if (!this.distance(this.monsters[i]%10,this.monsters[i+1]%10,this.monsters[k]%10,this.monsters[k+1]%10)) {
                                this.monsters.splice(k,2);
                                this.monsters[i] = (this.monsters[i] % 10) + 20;
                                this.monsters[i+1] = (this.monsters[i+1] % 10) + 20;
                                x=0;
                                while(x < this.monsterMoviments.length) {
                                    if (this.monsterMoviments[x] == i || this.monsterMoviments[x] == k) {
                                        this.monsterMoviments.splice(x,1);
                                    }
                                    else x++;
                                }
                                mergedmonsters = true;
                                break;
                            }
                    }
                }
                else {
                    this.monsterAnimate = 0;
                }
                this.monsterMoviments.splice(0,1);
                if (this.monsterMoviments.length == 0) this.GAMESTATE = 2;
                else this.GAMESTATE = 3;
            }
        }

        //draw monsters
        for(i = 0; i < this.monsters.length; i += 2) {
            if (this.monsters[i] < 10) {
                ctx.drawImage(monster,(myGameArea.frameNo%4)*27,0,27,48,12 + 52*(this.monsters[i]%10),2 + 52*(this.monsters[i+1]%10),27,48);
            }
            else if (this.monsters[i] < 20) {
                ctx.drawImage(monster,(myGameArea.frameNo%4)*27,48,27,48,12 + 52*(this.monsters[i]%10),2 + 52*(this.monsters[i+1]%10),27,48);
            }
            else {
                ctx.drawImage(monster,(myGameArea.frameNo%4)*27,96,27,48,12 + 52*(this.monsters[i]%10),2 + 52*(this.monsters[i+1]%10),27,48);
            }
        }
    };

    this.checkStatus = function(ctx) {

    };

    var instance;
    map = function() {
        return instance;
    };

    instance = this;
    if (loadmap) { this.start(); }
    else { this.clear(); }
}
