import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS } from './constants';
import type { Board, Player, TetrominoKey } from './types';

const createBoard = (): Board => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill('0'));

const App: React.FC = () => {
    const [board, setBoard] = useState<Board>(createBoard());
    const [player, setPlayer] = useState<Player>({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS['0'].shape,
        shape: '0',
        collided: false,
    });
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const dropTime = 1000 / (level + 1) + 200;

    const randomTetromino = useCallback((): TetrominoKey => {
        const tetrominos: TetrominoKey[] = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];
        const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
        return randTetromino;
    }, []);

    const checkCollision = useCallback((playerToCheck: Player, newBoard: Board, { x: moveX, y: moveY }: { x: number, y: number }): boolean => {
        for (let y = 0; y < playerToCheck.tetromino.length; y += 1) {
            for (let x = 0; x < playerToCheck.tetromino[y].length; x += 1) {
                if (playerToCheck.tetromino[y][x] !== 0) {
                    const newY = y + playerToCheck.pos.y + moveY;
                    const newX = x + playerToCheck.pos.x + moveX;

                    if (
                        !newBoard[newY] || // outside height
                        !newBoard[newY][newX] || // outside width
                        newBoard[newY][newX] !== '0' // cell is not empty
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, []);

    const resetPlayer = useCallback(() => {
        const newShape = randomTetromino();
        const newPlayer = {
            pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
            tetromino: TETROMINOS[newShape].shape,
            shape: newShape,
            collided: false,
        };

        if (checkCollision(newPlayer, board, { x: 0, y: 0 })) {
            setGameOver(true);
            setIsPlaying(false);
        } else {
            setPlayer(newPlayer);
        }
    }, [board, checkCollision, randomTetromino]);
    
    const startGame = useCallback(() => {
        setBoard(createBoard());
        setScore(0);
        setRows(0);
        setLevel(0);
        setGameOver(false);
        setIsPlaying(true);
        resetPlayer();
        gameAreaRef.current?.focus();
    }, [resetPlayer]);

    const updatePlayerPos = ({ x, y, collided }: { x: number, y: number, collided: boolean }): void => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
            collided,
        }));
    };

    const movePlayer = useCallback((dir: -1 | 1) => {
        if (!checkCollision(player, board, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0, collided: false });
        }
    }, [board, checkCollision, player]);

    const drop = useCallback(() => {
        if (!checkCollision(player, board, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            if (player.pos.y < 1) {
                setGameOver(true);
                setIsPlaying(false);
                return;
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }, [board, checkCollision, player]);

    const rotatePlayer = useCallback(() => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        const { tetromino } = clonedPlayer;
        
        // Transpose
        const rotatedTetromino = tetromino.map((_: any, index: number) => 
            tetromino.map((col: any[]) => col[index])
        );
        // Reverse each row to get a clockwise rotation
        rotatedTetromino.forEach((row: any[]) => row.reverse());
        
        clonedPlayer.tetromino = rotatedTetromino;
        
        if (!checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
            setPlayer(clonedPlayer);
        } else {
            // Wall kick (simple version)
            let kick = 1;
            if (!checkCollision(clonedPlayer, board, { x: kick, y: 0 })) {
                clonedPlayer.pos.x += kick;
                setPlayer(clonedPlayer);
                return;
            }
            kick = -1;
             if (!checkCollision(clonedPlayer, board, { x: kick, y: 0 })) {
                clonedPlayer.pos.x += kick;
                setPlayer(clonedPlayer);
                return;
            }
        }

    }, [board, checkCollision, player]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!isPlaying || gameOver) return;
        if (e.key === 'ArrowLeft') movePlayer(-1);
        else if (e.key === 'ArrowRight') movePlayer(1);
        else if (e.key === 'ArrowDown') drop();
        else if (e.key === 'ArrowUp') rotatePlayer();
    }, [drop, gameOver, isPlaying, movePlayer, rotatePlayer]);

    useEffect(() => {
        if (player.collided) {
            const newBoard = board.map(row => row.slice());
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newBoard[y + player.pos.y][x + player.pos.x] = player.shape;
                    }
                });
            });

            // Check for cleared rows
            let rowsCleared = 0;
            const sweptBoard = newBoard.reduce((ack, row) => {
                if (row.every(cell => cell !== '0')) {
                    rowsCleared += 1;
                    ack.unshift(Array(BOARD_WIDTH).fill('0'));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, [] as Board);
            
            if (rowsCleared > 0) {
                const linePoints = [0, 40, 100, 300, 1200];
                setScore(prev => prev + linePoints[rowsCleared] * (level + 1));
                setRows(prev => {
                    const newTotalRows = prev + rowsCleared;
                    setLevel(Math.floor(newTotalRows / 10));
                    return newTotalRows;
                });
            }
            
            setBoard(sweptBoard);
            resetPlayer();
        }
    }, [player, board, resetPlayer, level]);

    useEffect(() => {
        let interval: number | undefined;
        if (isPlaying && !gameOver) {
            interval = window.setInterval(() => {
                drop();
            }, dropTime);
        }
        return () => {
            if(interval) clearInterval(interval);
        };
    }, [isPlaying, gameOver, drop, dropTime]);


    const renderedBoard = board.map((row, y) =>
      row.map((cell, x) => {
        let color = TETROMINOS[cell].color;
        // Draw player piece on top of the board
        player.tetromino.forEach((pRow, pY) => {
          pRow.forEach((pValue, pX) => {
            if (pValue !== 0 && y === player.pos.y + pY && x === player.pos.x + pX) {
              color = TETROMINOS[player.shape].color;
            }
          });
        });
        const cellKey = `cell-${y}-${x}`;
        return <div key={cellKey} className={`w-full aspect-square ${color} border-gray-900/50 border-[1px] shadow-inner`}></div>;
      })
    );


    return (
        <div 
            className="w-screen h-screen bg-gray-900 text-white font-mono flex items-center justify-center" 
            onKeyDown={handleKeyDown} 
            tabIndex={0} 
            ref={gameAreaRef}
        >
            <div className="flex flex-col md:flex-row gap-8 items-start p-4">
                <div className="relative">
                    <div className="grid grid-cols-10 gap-0 p-2 bg-gray-800 rounded-lg shadow-2xl" style={{ width: 'min(40vh, 40vw)' }}>
                       {renderedBoard}
                    </div>
                </div>
                <aside className="w-full md:w-48 flex flex-col gap-4">
                    <div className='bg-gray-800 p-4 rounded-lg shadow-lg text-center'>
                        <h2 className='text-lg font-bold text-gray-400'>SCORE</h2>
                        <p className='text-3xl font-bold text-cyan-400'>{score}</p>
                    </div>
                     <div className='bg-gray-800 p-4 rounded-lg shadow-lg text-center'>
                        <h2 className='text-lg font-bold text-gray-400'>ROWS</h2>
                        <p className='text-3xl font-bold text-cyan-400'>{rows}</p>
                    </div>
                     <div className='bg-gray-800 p-4 rounded-lg shadow-lg text-center'>
                        <h2 className='text-lg font-bold text-gray-400'>LEVEL</h2>
                        <p className='text-3xl font-bold text-cyan-400'>{level}</p>
                    </div>
                    {!isPlaying && (
                        <button
                          onClick={startGame}
                          className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        >
                            {gameOver ? 'Play Again' : 'Start Game'}
                        </button>
                    )}
                </aside>
                {gameOver && !isPlaying && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10">
                       <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
                            <h1 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h1>
                            <p className="text-xl text-gray-300 mb-6">Final Score: {score}</p>
                            <button
                              onClick={startGame}
                              className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
                 {!isPlaying && !gameOver && (
                     <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10">
                       <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
                            <h1 className="text-4xl font-bold text-cyan-400 mb-4">ColorFall Tetris</h1>
                            <p className="text-lg text-gray-300 mb-6">Arrange the blocks, clear the lines.</p>
                             <button
                              onClick={startGame}
                              className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default App;
