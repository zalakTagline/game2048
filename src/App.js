import { useEffect } from "react";
import { useState } from "react";
import "./index.css";

function App() {
  const length = 4;
  const [game, setGame] = useState(Array(length).fill(Array(length).fill(0)));
  const [status, setStatus] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let tempGame = getMetrix(game)
    settingNumber(tempGame, true);  
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    checkWinGame();
    checkGameOver();

  }, [game]);

  useEffect(() => {
    if (status) {
      alert(status)
      resetGame();
    }
  }, [status]);

  const resetGame = () => {
    let tempGame = getMetrix(Array(length).fill(Array(length).fill(0)))
    setStatus(null);
    settingNumber(tempGame , true);
    setScore(0);
  };

  const keyHandler = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        arrowLeftPressed();
        break;
      case "ArrowRight":
        arrowRightPressed();
        break;
      case "ArrowUp":
        arrowUpPressed();
        break;
      case "ArrowDown":
        arrowDownPressed();
        break;
      default:
        console.log("e.key :>> ", e.key);
    }
  };

  const leftTransformation = (addScore) => {
    let tempGame = getMetrix(game);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    return tempGame;
  };

  const rightTransformation = (addScore) => {
    let tempGame = getMetrix(game);
    tempGame = moveMetrixLeft(tempGame);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    tempGame = moveMetrixLeft(tempGame);
    return tempGame;
  };
  const topTransformation = (addScore) => {
    let tempGame = getMetrix(game);
    tempGame = moveMetrixForUpOrDown(tempGame);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    tempGame = moveMetrixForUpOrDown(tempGame);
    return tempGame;
  };

  const bottomTransformation = (addScore) => {
    let tempGame = getMetrix(game);
    tempGame = moveMetrixForUpOrDown(tempGame);
    tempGame = moveMetrixLeft(tempGame);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    tempGame = moveMetrixLeft(tempGame);
    tempGame = moveMetrixForUpOrDown(tempGame);
    return tempGame;
  };

  const afterTransformation =(tempGame)=>{
    setGame(tempGame);
    if (!checkForUpdate(tempGame, game)) {
      settingNumber(tempGame);
    }
  }
  const arrowLeftPressed = () => {
    let tempGame = leftTransformation(true);
    afterTransformation(tempGame)
   
  };
  const arrowRightPressed = () => {
    let tempGame = rightTransformation(true);
   afterTransformation(tempGame)
  };

  const arrowDownPressed = () => {
    let tempGame = bottomTransformation(true);

    afterTransformation(tempGame)
  };
  const arrowUpPressed = () => {
    let tempGame = topTransformation(true);

    afterTransformation(tempGame)
  };

  const checkGameOver = () => {
    const checkSpace = game.some((row) => {
      return row.some((ele) => ele === 0);
    });
    if (!checkSpace) {
      if (
        checkForUpdate(game, leftTransformation()) &&
        checkForUpdate(game, rightTransformation()) &&
        checkForUpdate(game, topTransformation()) &&
        checkForUpdate(game, bottomTransformation())
      ) {
        setStatus("gameover");
      }
    }
  };

  const checkWinGame = () => {
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        if (game[row][col] === 2048) {
          setStatus("you won the game");
        }
      }
    }
  };
  const moveNumbersLeft = (tempGame) => {
    tempGame = tempGame.map((row) => {
      let nums = row.filter((ele) => ele !== 0);
      let zeros = row.filter((ele) => ele === 0);
      return [...nums, ...zeros];
    });
    // console.log('Move Num l tempGame :>> ', tempGame);
    return tempGame;
  };
  const mergeNumbers = (tempGame, addScore) => {
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length - 1; col++) {
        if (
          tempGame[row][col] === tempGame[row][col + 1] &&
          tempGame[row][col] !== 0
        ) {
          // console.log("setting" ,tempGame)
          tempGame[row][col] *= 2;
          if (addScore)
            setScore((prevScore) => (prevScore += tempGame[row][col]));

          tempGame[row].splice(col + 1, 1);
          tempGame[row].push(0);
        }
      }
    }
    // console.log('merger :>> ', tempGame);

    return tempGame;
  };

  const moveMetrixLeft = (tempGame) => {
    let newGame = getMetrix(tempGame);
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        newGame[row][col] = tempGame[row][length - col - 1];
      }
    }
    return newGame;
  };

  const moveMetrixForUpOrDown = (tempGame) => {
    let newGame = getMetrix(tempGame);
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        newGame[row][col] = tempGame[col][row];
      }
    }
    // console.log('moveMetrixForUpOrDown :>> ', newGame);
    return newGame;
  };

  const getMetrix = (game) => {
    let tempGame = new Array(length);
    for (let i = 0; i < length; i++) {
      tempGame[i] = [...game[i]];
    }
    // console.log('tempGame :>> ', tempGame);
    return tempGame;
  };

  const checkForUpdate = (currentGame, prevGame) => {
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        if (currentGame[row][col] !== prevGame[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  const getRandomPos = () => {
    const col = Math.floor(Math.random() * length);
    const row = Math.floor(Math.random() * length);
    return [row, col];
  };

  const settingNumber = (tempGame, flag) => {
        // console.log('tempGame :>> ', tempGame);
    
    const checkSpace = tempGame.some((row) => {
      return row.some((ele) => ele === 0);
    });
    if (checkSpace) {
      let row, col;

      for (;;) {
        [row, col] = getRandomPos();
        if (tempGame[row][col] === 0) {
          tempGame[row][col] =2
          break;
        }
      }  
      setGame(tempGame);
      if (flag) {
        settingNumber(tempGame);
        // console.log('tempGame :>> ', tempGame);
      }
    }
  };
  return (
    <div className="App">
      {/* {console.log('game', game)} */}
      <div className="flex-row">
        <h1>Score : {score}</h1>
        <button onClick={resetGame} className="resetBtn">
          Reset
        </button>
      </div>
      <div className="game-container">
        {game.map((row) => {
          return row.map((val, i) => (
            <div className={`color-for-${val}`} key={i}>
              {val ? val : ""}
            </div>
          ));
        })}
      </div>
    </div>
  );
}
export default App;

   
