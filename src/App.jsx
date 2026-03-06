import React, { useState, useEffect } from 'react';

const COLORS = {
  0: "#b4c6cd", 2: "#daecee", 4: "#c8e9ed", 8: "#79d2f2", 
  16: "#63d3f5", 32: "#5f71f6", 64: "#3b7df6", 128: "#ad72ed",
  256: "#be61ed", 512: "#e250ed", 1024: "#dc3fed", 2048: "#ed2ee3"
};

const App = () => {
  const [grid, setGrid] = useState(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false); // État Game Over

  const addRandom = (board) => {
    const newBoard = [...board];
    const empties = newBoard.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
    if (empties.length > 0) {
      newBoard[empties[Math.floor(Math.random() * empties.length)]] = Math.random() > 0.1 ? 2 : 4;
    }
    return newBoard;
  };

  const resetGame = () => {
    const emptyGrid = Array(16).fill(0);
    setGrid(addRandom(addRandom(emptyGrid)));
    setScore(0);
    setGameOver(false); 
  };

  useEffect(() => { resetGame(); }, []);

  // Vérifie si un mouvement est encore possible
  const checkGameOver = (currentGrid) => {
    if (currentGrid.includes(0)) return false; // Encore des cases vides
    
    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      // Vérifier voisin de droite
      if (col < 3 && currentGrid[i] === currentGrid[i + 1]) return false;
      // Vérifier voisin du bas
      if (row < 3 && currentGrid[i] === currentGrid[i + 4]) return false;
    }
    return true;
  };

  const slide = (row) => {
    let arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        setScore(s => s + arr[i]);
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  };

  const move = (dir) => {
    if (gameOver) return; // Bloque les mouvements si game over

    let newGrid = [...grid];
    let changed = false;

    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 4; j++) {
        if (dir === 'LEFT') row.push(newGrid[i * 4 + j]);
        if (dir === 'RIGHT') row.push(newGrid[i * 4 + (3 - j)]);
        if (dir === 'UP') row.push(newGrid[j * 4 + i]);
        if (dir === 'DOWN') row.push(newGrid[(3 - j) * 4 + i]);
      }

      const movedRow = slide(row);

      for (let j = 0; j < 4; j++) {
        let idx;
        if (dir === 'LEFT') idx = i * 4 + j;
        if (dir === 'RIGHT') idx = i * 4 + (3 - j);
        if (dir === 'UP') idx = j * 4 + i;
        if (dir === 'DOWN') idx = (3 - j) * 4 + i;
        if (newGrid[idx] !== movedRow[j]) changed = true;
        newGrid[idx] = movedRow[j];
      }
    }

    if (changed) {
      const gridWithNewTile = addRandom(newGrid);
      setGrid(gridWithNewTile);
      if (checkGameOver(gridWithNewTile)) setGameOver(true);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.includes('Arrow')) {
        e.preventDefault();
        move(e.key.replace('Arrow', '').toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid, gameOver]);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', width: '100vw', backgroundColor: '#faf8ef', fontFamily: 'sans-serif',
      position: 'relative'
    }}>
      <div style={{ color: '#776e65', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
        Score : {score}
      </div>
      
      <div style={{ position: 'relative' }}>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '10px', 
          backgroundColor: '#bbada0', padding: '10px', borderRadius: '6px' 
        }}>
          {grid.map((val, i) => (
            <div key={i} style={{ 
              width: '80px', height: '80px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '25px', fontWeight: 'bold',
              backgroundColor: COLORS[val] || "#3c3a32",
              color: val <= 4 ? "#776e65" : "white"
            }}>
              {val > 0 ? val : ""}
            </div>
          ))}
        </div>

        {gameOver && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(238, 228, 218, 0.73)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRadius: '6px', textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', color: '#776e65', margin: '0' }}>Game Over !</h2>
            <button onClick={resetGame} style={{
              marginTop: '20px', padding: '10px 20px', backgroundColor: '#8f7a66',
              color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
            }}>
              Réessayer
            </button>
          </div>
        )}
      </div>

      {!gameOver && (
        <button onClick={resetGame} 
                style={{ 
                  marginTop: '30px', padding: '12px 25px', cursor: 'pointer', 
                  border: 'none', borderRadius: '5px', backgroundColor: '#8f7a66', 
                  color: 'white', fontWeight: 'bold', fontSize: '1rem' 
                }}>
          Nouvelle Partie
        </button>
      )}
    </div>
  );
};

export default App;