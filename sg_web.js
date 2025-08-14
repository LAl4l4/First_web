window.addEventListener('pageshow', function(event) {
    if (event.persisted) { // 如果页面来自缓存
        const btn = document.querySelector('.btn');
        
        btn.classList.remove("btn");
        void btn.offsetWidth;
        btn.classList.add("btn");

    }
});


    //Game module
        // Game variables
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        const snakeSize = 30;
        let snake;
        let direction;
        let food;
        let score;
        let gameInterval;


        // Initialize the game
        function initializeGame() {
            snake = [
                { x: 90, y: 60 },
                { x: 60, y: 60 },
                { x: 30, y: 60 }
            ];
            direction = "RIGHT";
            score = 0;
            generateFood();
            if (gameInterval) 
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 300);
        }

        // Generate food at a random position
        function generateFood() {
            food = {
                x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
                y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize
            };
        }

        // Handle keypress events to change snake direction
        document.addEventListener("keydown", (event) => {
            event.preventDefault();
            if (event.key === "ArrowUp" && direction !== "DOWN") {
                direction = "UP";
            } else if (event.key === "ArrowDown" && direction !== "UP") {
                direction = "DOWN";
            } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
                direction = "LEFT";
            } else if (event.key === "ArrowRight" && direction !== "LEFT") {
                direction = "RIGHT";
            } else if (event.key === "Escape") {
                clearInterval(gameInterval);
                //alert("Game Over! Score: " + score);
            }
        });

        // Game loop function
        function gameLoop() {
            // Move the snake
            let head = { ...snake[0] };

            if (direction === "UP") head.y -= snakeSize;
            if (direction === "DOWN") head.y += snakeSize;
            if (direction === "LEFT") head.x -= snakeSize;
            if (direction === "RIGHT") head.x += snakeSize;

            // Check if snake eats food
            if (head.x === food.x && head.y === food.y) {
                score++;
                generateFood();
            } else {
                snake.pop();  // Remove tail
            }

            // Check for collisions with wall or self
            if (
                head.x < 0 || head.x >= canvas.width || 
                head.y < 0 || head.y >= canvas.height || 
                checkCollision(head)
            ) {
                clearInterval(gameInterval);
                //alert("Game Over! Score: " + score);
                return;
            }

            snake.unshift(head);  // Add new head to snake

            // Draw the game
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSnake();
            drawFood();
            drawScore();
        }

        // Check if the snake collides with itself
        function checkCollision(head) {
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    return true;
                }
            }
            return false;
        }

        // Draw the snake
        function drawSnake() {
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = "green";
                ctx.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
            }
        }

        // Draw the food
        function drawFood() {
            ctx.fillStyle = "red";
            ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
        }

        // Draw the score
        function drawScore() {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("Score: " + score, 10, 20);
        }

        // Restart button functionality
        const restartButton = document.getElementById("restartButton");
        restartButton.addEventListener("click", () => {
            initializeGame();  // Restart the game
        });

        // Initialize the game when the page loads
        initializeGame(); 