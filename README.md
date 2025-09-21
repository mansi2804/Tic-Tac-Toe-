# 🎮 Modern Tic Tac Toe Game

A beautiful, responsive, and feature-rich tic-tac-toe game built with modern web technologies.

## ✨ Features

### 🎯 Core Gameplay
- **Player vs Player (PvP)** - Play against a friend locally
- **Player vs AI (PvC)** - Challenge an intelligent AI opponent
- **Smart AI** - AI uses strategic thinking (win, block, center, corners)
- **Win Detection** - All winning combinations properly detected
- **Draw Detection** - Handles tie games gracefully
  
### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations** - Smooth transitions and visual feedback
- **Modern Gradient Design** - Eye-catching color schemes
- **Interactive Elements** - Hover effects and button animations
- **Modal Dialogs** - Elegant game result presentations
 
### 🏆 Game Features
- **Score Tracking** - Persistent score across multiple rounds
- **Player Customization** - Custom player names
- **Round System** - Play multiple rounds with score tracking
- **Game History** - Move history tracking
- **Multiple Reset Options** - Reset round, game, or change players

### ⌨️ Accessibility & Controls
- **Keyboard Support** - Use number keys 1-9 to make moves
- **Enter Key Support** - Quick game start
- **Visual Feedback** - Clear turn indicators and winning highlights
- **Notifications** - In-game notifications for actions and results

### 🔧 Technical Features
- **ES6+ JavaScript** - Modern JavaScript with classes and modules
- **CSS Grid & Flexbox** - Modern layout techniques
- **Local Storage Ready** - Game state export/import capability
- **PWA Ready** - Service worker registration included
- **Mobile Optimized** - Touch-friendly interface

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start playing immediately!

### File Structure
```
TIC-TAC-TOE/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── script.js           # Game logic and functionality
└── README.md           # This file
```

## 🎮 How to Play

### Starting a Game
1. **Choose Game Mode**: Select Player vs Player or Player vs AI
2. **Enter Names**: Input player names (optional, defaults provided)
3. **Start Playing**: Click "Start Game" or press Enter

### Making Moves
- **Mouse**: Click on any empty cell
- **Keyboard**: Press number keys 1-9 (corresponding to grid positions)
- **Mobile**: Tap on any empty cell

### Game Controls
- **New Round**: Start a new round keeping scores
- **Reset Game**: Reset everything including scores
- **Change Players**: Return to player setup

## 🏆 Game Rules

### Winning Conditions
- Get three of your symbols (X or O) in a row
- Winning combinations: horizontal, vertical, or diagonal
- First to achieve this wins the round

### Draw Condition
- All 9 cells filled without a winner
- Round ends in a tie

### Scoring
- Winner gets +1 point
- Draws don't affect scores
- Scores persist across rounds

## 🤖 AI Behavior

The AI opponent uses intelligent strategy:

1. **Win**: Takes winning move if available
2. **Block**: Blocks player's winning move
3. **Center**: Takes center position if empty
4. **Corners**: Prefers corner positions
5. **Random**: Takes any available move as fallback

### Keyboard Shortcuts
- `1-9`: Make move in corresponding cell
- `Enter`: Start game (in setup screen)
- `Escape`: Close modal (when implemented)

## 🤝 Contributing

Feel free to contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 🎯 Edge Cases Handled

- Invalid moves (occupied cells, out of bounds)
- Game state validation
- Proper turn switching
- Win condition checking
- Draw detection
- Input validation (player names)
- AI move validation
- Responsive layout edge cases
- Keyboard navigation
- Modal state management

---

**Enjoy playing Modern Tic Tac Toe! 🎮✨**
