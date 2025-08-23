window.addEventListener("keydown",(event)=>{
    if(event.key === "a"){
        currentblock.rotateCW();
    }else if(event.key==="d"){
        currentblock.rotateACW();
    }else if (event.key==="ArrowLeft"&&currentblock.x!==0){
        currentblock.moveLeft();
    }else if(event.key==="ArrowRight"&&currentblock.pos.x+currentblock.shape[0].length*30!==300){
        currentblock.moveRight();
    }
});

let background; 
let tbl;
let currentblock;
const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const length = 30;
    let game;
    let deflautposition;
    let T = [[1,1,1],[0,1,0]];
    let L = [[1,0],[1,0],[1,1]];
    let one = [[1,1,1,1]];
    let sqr = [[1,1],[1,1]];
    let bg = [];

    function initialization(){
        ctx.clearRect(0,0,canvas.width,canvas.height);

        tbl = random();
        deflautposition = {x:180,y:0};
        currentblock = new Block(tbl,deflautposition.x,deflautposition.y);
        if(!background)background = new thebg(bg);
        game = setInterval(()=>gameloop(currentblock),300);


    }


    function bgini(){
        for(let i=0;i<20;i++){
            let row = [];
            for(let k=0; k < 10;k++){
                
                row.push(0);
            }
            bg.push(row);
        }
        return bg;
    }


function gameloop(thisblock) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    thisblock.draw(ctx);
    thisblock.pos.y += length;
    if (thisblock.pos.y + thisblock.shape.length * length - length === 600) {
        thisblock.pos.y -= length;
        background.posireco(thisblock.shape, thisblock.pos);
        clearInterval(game);
        initialization();
    } else if (background.iscollapse(thisblock.shape, thisblock.pos)) {
        thisblock.pos.y -= length;
        background.posireco(thisblock.shape, thisblock.pos);
        clearInterval(game);
        initialization();
    }
    background.eliminate();
    background.draw(ctx);
}

function random() {
    const blocks = [T, L, one, sqr]; // all possible shapes
    const index = Math.floor(Math.random() * blocks.length); // random integer from 0 to blocks.length-1
    return blocks[index];
}

function clws(thisblock){
    let numRows = thisblock.length;
    let numCols = thisblock[0].length;
    let nnum = [];

    // Initialize empty rows
    for (let i = 0; i < numCols; i++) {
        nnum.push(new Array(numRows));
    }

        for (let row = 0; row < thisblock.length; row++) {
            for (let col = 0; col < thisblock[row].length; col++) {
                nnum[col][thisblock.length-1-row] = thisblock[row][col];
        }
    }
    return nnum;
}

function anticlws(thisblock){
        let numRows = thisblock.length;
    let numCols = thisblock[0].length;
    let nnum = [];

    // Initialize empty rows
    for (let i = 0; i < numCols; i++) {
        nnum.push(new Array(numRows));
    }

        for (let row = 0; row < thisblock.length; row++) {
            for (let col = 0; col < thisblock[row].length; col++) {
                nnum[thisblock[row].length-1-col][row] = thisblock[row][col];
        }
    }
    return nnum;
}

class Block {
    constructor(shape, startX, startY) {
        this.shape = shape; // 相当于 tbl
        this.pos = { x: startX, y: startY }; // 相当于 position
    }

    moveLeft() {
        if (this.pos.x > 0) {
            this.pos.x -= length;
        }
    }

    moveRight() {
        if (this.pos.x + this.shape[0].length * length < canvas.width) {
            this.pos.x += length;
        }
    }

    rotateCW() {
        this.shape = clws(this.shape);
    }

    rotateACW() {
        this.shape = anticlws(this.shape);
    }

    draw(ctx) {
        ctx.fillStyle = "white";
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col] === 1) {
                    ctx.fillRect(this.pos.x + col * length, this.pos.y + row * length, length, length);
                }
            }
        }
    }
}
    
class thebg{
    constructor(backg){
        this.tbg = backg;

    }
    
    posireco(thisblock,pos){
        for (let row = 0; row < thisblock.length; row++) {
            for (let col = 0; col < thisblock[row].length; col++) {
                if(thisblock[row][col]===1)this.tbg[pos.y/30+row][pos.x/30+col] = 1;
            }
        }        
    }

    iscollapse(thisblock,pos){
        for (let row = 0; row < thisblock.length; row++) {
            for (let col = 0; col < thisblock[row].length; col++) {
                if(this.tbg[pos.y/30+row][pos.x/30+col] === 1&&thisblock[row][col]===1){
                    return true;
                }
            }
        }     
        return false;
    }
    draw(ctx) { 
        for (let row = 0; row < this.tbg.length; row++) {
            for (let col = 0; col < this.tbg[row].length; col++) {
                if (this.tbg[row][col] === 1) {
                    ctx.fillRect(col * length, row * length, length, length);
                }
            }
        }
    }
    eliminate() {
    for (let row = this.tbg.length - 1; row >= 0; row--) {
        // 判断该行是否满
        if (this.tbg[row].every(cell => cell === 1)) {
            // 删除该行
            this.tbg.splice(row, 1);
            // 在顶部插入空行
            this.tbg.unshift(new Array(this.tbg[0].length).fill(0));
            // 删除一行后，要再次检查当前行，因为下一行下移了
            row++;
        }
    }
}
}



bgini();

    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => {
            if(game) clearInterval(game); // 防止重复启动
    initialization(); // 初始化方块和背景
    });

    resetBtn.addEventListener('click', () => {
          clearInterval(game);
    bg = [];           // 清空背景
    background = new thebg(bgini());         // 重新初始化背景
    initialization(); 
    });