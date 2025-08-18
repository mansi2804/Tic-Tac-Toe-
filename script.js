// Modern Tic Tac Toe Game
class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameMode = 'pvp'; // 'pvp' or 'pvc'
        this.gameActive = false;
        this.players = {
            X: { name: 'Player 1', score: 0 },
            O: { name: 'Player 2', score: 0 }
        };
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        this.moveHistory = [];
        this.roundNumber = 1;
        
        this.initializeGame();
    }

    initializeGame() {
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        // Game mode selection
        document.getElementById('pvp-mode').addEventListener('click', () => this.setGameMode('pvp'));
        document.getElementById('pvc-mode').addEventListener('click', () => this.setGameMode('pvc'));

        // Player setup
        document.getElementById('start-game').addEventListener('click', () => this.startGame());

        // Game controls
        document.getElementById('reset-round').addEventListener('click', () => this.resetRound());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('change-players').addEventListener('click', () => this.changePlayers());

        // Modal controls
        document.getElementById('play-again').addEventListener('click', () => this.playAgain());
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());

        // Board clicks
        document.getElementById('game-board').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const index = parseInt(e.target.dataset.index);
                this.makeMove(index);
            }
        });

        // Enter key support for player names
        document.getElementById('player1-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });
        document.getElementById('player2-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // Keyboard navigation for game board
        document.addEventListener('keydown', (e) => {
            if (this.gameActive && e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                this.makeMove(index);
            }
        });
    }

    setGameMode(mode) {
        this.gameMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode === 'pvp' ? 'pvp-mode' : 'pvc-mode').classList.add('active');
        
        // Update player 2 setup based on mode
        const player2Input = document.getElementById('player2-name');
        const player2Label = document.querySelector('label[for="player2-name"]');
        
        if (mode === 'pvc') {
            player2Input.placeholder = 'AI Player';
            player2Input.value = 'AI';
            player2Input.disabled = true;
            player2Label.textContent = 'Player 2 (O): AI';
        } else {
            player2Input.placeholder = 'Enter name';
            player2Input.disabled = false;
            player2Label.textContent = 'Player 2 (O):';
            if (player2Input.value === 'AI') {
                player2Input.value = '';
            }
        }
    }

    startGame() {
        const player1Name = document.getElementById('player1-name').value.trim() || 'Player 1';
        const player2Name = this.gameMode === 'pvc' ? 'AI' : 
                           (document.getElementById('player2-name').value.trim() || 'Player 2');

        // Validate input
        if (this.gameMode === 'pvp' && player1Name === player2Name) {
            this.showNotification('Players must have different names!', 'error');
            return;
        }

        this.players.X.name = player1Name;
        this.players.O.name = player2Name;

        // Show game board and hide setup
        document.getElementById('player-setup').style.display = 'none';
        document.getElementById('game-board-container').style.display = 'block';

        this.gameActive = true;
        this.updateDisplay();
        this.updatePlayerCards();
        
        // Update player 2 icon for AI mode
        if (this.gameMode === 'pvc') {
            document.getElementById('player2-icon').className = 'fas fa-robot';
        } else {
            document.getElementById('player2-icon').className = 'fas fa-user';
        }

        this.showNotification(`Game started! ${this.players[this.currentPlayer].name}'s turn`, 'success');
    }

    makeMove(index) {
        // Validate move
        if (!this.gameActive || this.board[index] !== '' || index < 0 || index > 8) {
            return;
        }

        // Make the move
        this.board[index] = this.currentPlayer;
        this.moveHistory.push({ player: this.currentPlayer, index, round: this.roundNumber });
        
        // Update UI
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase(), 'cell-animation');
        
        // Check for win or draw
        const result = this.checkGameEnd();
        
        if (result.gameEnded) {
            this.handleGameEnd(result);
        } else {
            // Switch players
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
            this.updatePlayerCards();
            
            // AI move if in PvC mode
            if (this.gameMode === 'pvc' && this.currentPlayer === 'O' && this.gameActive) {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;

        const availableMoves = this.board.map((cell, index) => cell === '' ? index : null)
                                        .filter(val => val !== null);
        
        if (availableMoves.length === 0) return;

        let move;
        
        // AI Strategy: Easy to Hard
        // 1. Try to win
        move = this.findWinningMove('O');
        if (move !== -1) {
            this.makeMove(move);
            return;
        }

        // 2. Block player from winning
        move = this.findWinningMove('X');
        if (move !== -1) {
            this.makeMove(move);
            return;
        }

        // 3. Take center if available
        if (this.board[4] === '') {
            this.makeMove(4);
            return;
        }

        // 4. Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.board[corner] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            this.makeMove(randomCorner);
            return;
        }

        // 5. Take any available move
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        this.makeMove(randomMove);
    }

    findWinningMove(player) {
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            const line = [this.board[a], this.board[b], this.board[c]];
            
            // Check if two positions have the player's symbol and one is empty
            if (line.filter(cell => cell === player).length === 2 && 
                line.filter(cell => cell === '').length === 1) {
                
                // Return the empty position
                if (this.board[a] === '') return a;
                if (this.board[b] === '') return b;
                if (this.board[c] === '') return c;
            }
        }
        return -1;
    }

    checkGameEnd() {
        // Check for win
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return {
                    gameEnded: true,
                    winner: this.board[a],
                    winningCombination: combination,
                    type: 'win'
                };
            }
        }

        // Check for draw
        if (this.board.every(cell => cell !== '')) {
            return {
                gameEnded: true,
                winner: null,
                type: 'draw'
            };
        }

        return { gameEnded: false };
    }

    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result.type === 'win') {
            // Update score
            this.players[result.winner].score++;
            
            // Highlight winning combination
            result.winningCombination.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning');
            });
            
            // Show result
            this.showGameResult(
                `${this.players[result.winner].name} Wins!`,
                `Congratulations! Round ${this.roundNumber} goes to ${this.players[result.winner].name}`,
                'win'
            );
            
            this.showNotification(`${this.players[result.winner].name} wins round ${this.roundNumber}!`, 'success');
        } else {
            // Draw
            this.showGameResult(
                "It's a Draw!",
                `Round ${this.roundNumber} ends in a tie. Well played!`,
                'draw'
            );
            
            this.showNotification(`Round ${this.roundNumber} is a draw!`, 'info');
        }
        
        this.updateDisplay();
        this.updatePlayerCards();
    }

    showGameResult(title, message, type) {
        const modal = document.getElementById('game-result-modal');
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        
        resultTitle.textContent = title;
        resultMessage.textContent = message;
        
        // Update icon based on result type
        resultIcon.className = 'result-icon ' + type;
        if (type === 'win') {
            resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        } else {
            resultIcon.innerHTML = '<i class="fas fa-handshake"></i>';
        }
        
        modal.classList.add('show');
    }

    resetRound() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.roundNumber++;
        
        // Clear board UI
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateDisplay();
        this.updatePlayerCards();
        this.showNotification(`Round ${this.roundNumber} started!`, 'info');
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.roundNumber = 1;
        this.players.X.score = 0;
        this.players.O.score = 0;
        this.moveHistory = [];
        
        // Clear board UI
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateDisplay();
        this.updatePlayerCards();
        this.showNotification('Game reset! New game started.', 'info');
    }

    changePlayers() {
        // Reset everything and go back to setup
        this.resetGame();
        document.getElementById('game-board-container').style.display = 'none';
        document.getElementById('player-setup').style.display = 'block';
        this.gameActive = false;
    }

    playAgain() {
        this.closeModal();
        this.resetRound();
    }

    closeModal() {
        document.getElementById('game-result-modal').classList.remove('show');
    }

    updateDisplay() {
        // Update turn indicator
        const turnIndicator = document.getElementById('turn-indicator');
        if (this.gameActive) {
            turnIndicator.textContent = `${this.players[this.currentPlayer].name}'s Turn`;
        } else {
            turnIndicator.textContent = 'Game Over';
        }
        
        // Update player displays
        document.getElementById('player1-display').textContent = this.players.X.name;
        document.getElementById('player2-display').textContent = this.players.O.name;
        document.getElementById('player1-score').textContent = this.players.X.score;
        document.getElementById('player2-score').textContent = this.players.O.score;
    }

    updatePlayerCards() {
        const player1Card = document.querySelector('.player-card.player1');
        const player2Card = document.querySelector('.player-card.player2');
        
        // Remove active class from both
        player1Card.classList.remove('active');
        player2Card.classList.remove('active');
        
        // Add active class to current player
        if (this.gameActive) {
            if (this.currentPlayer === 'X') {
                player1Card.classList.add('active');
            } else {
                player2Card.classList.add('active');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #4ecdc4, #45b7aa)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
                break;
            case 'info':
                notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods for game statistics
    getGameStats() {
        return {
            totalGames: this.players.X.score + this.players.O.score,
            player1Wins: this.players.X.score,
            player2Wins: this.players.O.score,
            currentRound: this.roundNumber,
            moveHistory: this.moveHistory,
            gameMode: this.gameMode
        };
    }

    // Method to export game state (for potential save/load functionality)
    exportGameState() {
        return {
            board: [...this.board],
            currentPlayer: this.currentPlayer,
            gameMode: this.gameMode,
            gameActive: this.gameActive,
            players: JSON.parse(JSON.stringify(this.players)),
            roundNumber: this.roundNumber,
            moveHistory: [...this.moveHistory]
        };
    }

    // Method to import game state
    importGameState(state) {
        this.board = [...state.board];
        this.currentPlayer = state.currentPlayer;
        this.gameMode = state.gameMode;
        this.gameActive = state.gameActive;
        this.players = JSON.parse(JSON.stringify(state.players));
        this.roundNumber = state.roundNumber;
        this.moveHistory = [...state.moveHistory];
        
        // Update UI
        this.updateDisplay();
        this.updatePlayerCards();
        
        // Update board UI
        this.board.forEach((cell, index) => {
            const cellElement = document.querySelector(`[data-index="${index}"]`);
            cellElement.textContent = cell;
            if (cell) {
                cellElement.classList.add(cell.toLowerCase());
            }
        });
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToe();
    
    // Make game instance globally available for debugging
    window.ticTacToe = game;
    
    // Add keyboard shortcuts info
    console.log('🎮 Tic Tac Toe Game Loaded!');
    console.log('💡 Tips:');
    console.log('   - Use number keys 1-9 to make moves when game is active');
    console.log('   - Press Enter in name fields to start game quickly');
    console.log('   - Access game.getGameStats() in console for statistics');
    console.log('   - Use game.exportGameState() to save current state');
});

// Service Worker registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
