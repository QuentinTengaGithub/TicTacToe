import React, { useState, useEffect } from "react";
import "./App.css";
import sunIcon from "./sun.png";
import moonIcon from "./moon.png";

const initialBoard = Array(9).fill(null);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function App() {
  const [squares, setSquares] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem("score");
    return savedScore ? JSON.parse(savedScore) : { X: 0, O: 0 };
  });
  const [countdown, setCountdown] = useState(5);
  const [theme, setTheme] = useState("dark");

  const [winningLine, setWinningLine] = useState([]);

  const { winner, line } = calculateWinner(squares);
  const nextPlayer = xIsNext ? "X" : "O";

  useEffect(() => {
    if (winner) {
      setWinningLine(line);
    }
  }, [winner, line]);

  useEffect(() => {
    localStorage.setItem("score", JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    if (winner) {
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1,
      }));
    }
  }, [winner]);

  useEffect(() => {
    const isDraw = squares.every((square) => square !== null);
    let timer;
    let resetTimeout;

    if (winner || isDraw) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      resetTimeout = setTimeout(() => {
        handleReset();
      }, 5000);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(resetTimeout);
    };
  }, [winner, squares]);

  function handleClick(index) {
    if (squares[index] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(initialBoard);
    setXIsNext(true);
    setCountdown(5);
    setWinningLine([]);
  }

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const isDraw = squares.every((square) => square !== null) && !winner;

  return (
    <>
      <div className="app-container">
        <div className="theme-toggle" onClick={toggleTheme}>
          <img src={theme === "light" ? moonIcon : sunIcon} alt="Toggle Theme" />
        </div>
              <div className="score">
                <div className={nextPlayer === "X" ? "pulse" : ""}>
                  Player X: {score.X}
                </div>
                <div className={nextPlayer === "O" ? "pulse" : ""}>
                  Player O: {score.O}
                </div>
              </div>
        <div className={`status ${winner ? `winner-${winner}` : (isDraw ? "" : `player-${nextPlayer}`)}`}>
          <strong>
            {winner
              ? `Winner: ${winner}`
              : isDraw
              ? "Draw"
              : `${nextPlayer}'s turn`}
          </strong>
        </div>

        <div className={`board player-${nextPlayer}`}>
          {squares.map((value, index) => (
            <button
              key={index}
              className={`square ${value} ${
                winningLine.includes(index) ? "winning-square" : ""
              }`}
              onClick={() => handleClick(index)}
            >
              {value}
            </button>
          ))}
        </div>

        <button className="reset-button" onClick={handleReset}>
          Reset Game
        </button>
      </div>
      {(winner || isDraw) && (
        <div className="countdown">Next game in {countdown}...</div>
      )}
    </>
  );
}

export default App;

