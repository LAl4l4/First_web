class Tetris {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.length = 30;
        this.bg = [];
        this.blocks = {
            T: [[1,1,1],[0,1,0]],
            L: [[1,0],[1,0],[1,1]],
            one: [[1,1,1,1]],
            sqr: [[1,1],[1,1]]
        };
        this.currentBlock = null;
        this.background = null;
        this.game = null;

        this.initBackground();
        this.initBlock();
        this.setupControls();
        this.startGame();
    }

    initBackground() {
        for (let i = 0; i < 20; i++) {
            let row = [];
            for (let k = 0; k < 10; k++) {
                row.push(0);
            }
            this.bg.push(row);
        }
        this.background = new thebg(this.bg);
    }

    randomBlock() {
        const arr = Object.values(this.blocks);
        return arr[Math.floor(Math.random() * arr.length)];
    }

    initBlock() {
        const tbl = this.randomBlock();
        const startPos = {x: 180, y: 0};
        this.currentBlock = new Block(tbl, startPos.x, startPos.y, this.length, this.canvas.width);
    }

    startGame() {
        if(this.game) clearInterval(this.game);
        this.game = setInterval(() => this.gameLoop(), 300);
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentBlock.draw(this.ctx);

        this.currentBlock.pos.y += this.length;

        if (this.currentBlock.pos.y + this.currentBlock.shape.length * this.length - this.length >= this.canvas.height ||
            this.background.iscollapse(this.currentBlock.shape, this.currentBlock.pos)) {

            this.currentBlock.pos.y -= this.length;
            this.background.posireco(this.currentBlock.shape, this.currentBlock.pos);
            this.initBlock(); // 新方块
        }

        this.background.eliminate();
        this.background.draw(this.ctx);
    }

    setupControls() {
        window.addEventListener("keydown", (event) => {
            if (!this.currentBlock) return;
            switch(event.key) {
                case "a":
                    this.currentBlock.rotateCW();
                    break;
                case "d":
                    this.currentBlock.rotateACW();
                    break;
                case "ArrowLeft":
                    this.currentBlock.moveLeft();
                    break;
                case "ArrowRight":
                    this.currentBlock.moveRight();
                    break;
            }
        });
    }
}
