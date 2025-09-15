
# ColorFall Tetris

A vibrant, modern take on the classic puzzle game, built with React, TypeScript, and Tailwind CSS. ColorFall Tetris delivers the addictive, line-clearing fun you know and love, wrapped in a sleek, responsive interface with immersive sound effects.

## Features

- **Classic Tetris Gameplay**: Manipulate falling tetrominoes to create and clear solid horizontal lines.
- **Responsive Design**: The game board and UI scale gracefully to fit various screen sizes, making it playable on both desktop and mobile browsers.
- **Scoring System**: Earn points for every line cleared, with big bonuses for clearing multiple lines at once (a "Tetris"!).
- **Progressive Difficulty**: The game speed increases as you level up, keeping the challenge fresh and exciting.
- **Sleek, Modern UI**: A clean, minimalist design with a dark theme and vibrant, colorful blocks.
- **Immersive Audio**: Custom sound effects for piece movement, rotation, drops, line clears, level-ups, and game-over events enhance the gameplay experience.
- **Zero Dependencies**: Runs directly in the browser with no installation or build steps required.

## How to Play

The controls are simple and intuitive, designed for keyboard input.

-   **Start Game**: Click the "Start Game" or "Play Again" button to begin.
-   **Move Piece**: Use the `Left Arrow` and `Right Arrow` keys to move the falling piece horizontally.
-   **Soft Drop**: Press the `Down Arrow` key to speed up the piece's descent.
-   **Rotate Piece**: Use the `Up Arrow` or `X` key to rotate the piece clockwise.

The goal is to clear as many lines as possible and achieve the highest score before the blocks stack to the top of the screen.

## Tech Stack

This project is built with modern web technologies and has no external build dependencies.

-   **[React](https://react.dev/)**: A JavaScript library for building user interfaces.
-   **[TypeScript](https://www.typescriptlang.org/)**: A statically typed superset of JavaScript that enhances code quality and maintainability.
-   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
-   **Web Audio API**: Used for generating and playing all in-game sound effects directly in the browser without requiring external audio files.

## Project Structure

The codebase is organized into logical, reusable components and modules.

```
/
├── index.html          # Main HTML entry point
├── index.tsx           # React application root
├── metadata.json       # Application metadata
├── App.tsx             # Core game component with all logic and state
├── constants.ts        # Game constants (board size, tetromino shapes)
├── types.ts            # TypeScript type definitions
├── sounds.ts           # Base64-encoded sound data for audio effects
└── README.md           # This file
```

-   **`App.tsx`**: This is the heart of the application. It manages the game state (board, player, score), handles all game logic (movement, collision, line clearing), and renders the UI.
-   **`sounds.ts`**: This file contains Base64-encoded data URLs for all sound effects. This unique approach embeds the audio directly into the code, making the project self-contained and reducing HTTP requests.
-   **`constants.ts` & `types.ts`**: These files help maintain a clean and strongly-typed codebase by separating static data and type definitions from the application logic.

