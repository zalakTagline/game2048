import { useEffect } from "react";
import { useState } from "react";
import "./index.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const length = 4;
  const [game, setGame] = useState(Array(length).fill(Array(length).fill(0)));
  const [status, setStatus] = useState({type :"",msg:""});
  const [score, setScore] = useState(0);

  useEffect(() => {
    let tempGame = getMatrix(game)
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
    if (status.msg) {
      console.log('status :>> ', status);
     
      toast[status.type](status.msg)
      setTimeout(()=>resetGame(),3000)
      // resetGame();
    }
  }, [status]);

  const resetGame = () => {
    let tempGame = getMatrix(Array(length).fill(Array(length).fill(0)))
    setStatus({type:'' ,msg:''});
    settingNumber(tempGame , true);
    setScore(0);
  };

  const keyHandler = (e) => {
    console.log({status})
    if(!status.msg){
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
    }else{
      console.log("not")
    }
    
  };

  const leftTransformation = (addScore) => {
    let tempGame = getMatrix(game);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    return tempGame;
  };

  const rightTransformation = (addScore) => {
    let tempGame = getMatrix(game);
    tempGame = moveMatrixLeft(tempGame);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    tempGame = moveMatrixLeft(tempGame);
    return tempGame;
  };
  const topTransformation = (addScore) => {
    let tempGame = getMatrix(game);
    tempGame = moveMatrixForUpOrDown(tempGame);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    tempGame = moveMatrixForUpOrDown(tempGame);
    return tempGame;
  };

  const bottomTransformation = (addScore) => {
    let tempGame = getMatrix(game);
    tempGame = moveMatrixForUpOrDown(tempGame);
    tempGame = moveMatrixLeft(tempGame);
    tempGame = moveNumbersLeft(tempGame);
    tempGame = mergeNumbers(tempGame, addScore);
    tempGame = moveMatrixLeft(tempGame);
    tempGame = moveMatrixForUpOrDown(tempGame);
    return tempGame;
  };

  const afterTransformation =(tempGame)=>{
    setGame(tempGame);
    if (!comparMatrix(tempGame, game)) {
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
        comparMatrix(game, leftTransformation()) &&
        comparMatrix(game, rightTransformation()) &&
        comparMatrix(game, topTransformation()) &&
        comparMatrix(game, bottomTransformation())
      ) {
        setStatus({type:"error", msg:`Game over  , your score : ${score}`});
      }
    }
  };

  const checkWinGame = () => {
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        if (game[row][col] === 2048) {
          setStatus({type:"success",msg :`you won the game, your score : ${score}`});
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

  const moveMatrixLeft = (tempGame) => {
    let newGame = getMatrix(tempGame);
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        newGame[row][col] = tempGame[row][length - col - 1];
      }
    }
    return newGame;
  };

  const moveMatrixForUpOrDown = (tempGame) => {
    let newGame = getMatrix(tempGame);
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        newGame[row][col] = tempGame[col][row];
      }
    }
    // console.log('moveMatrixForUpOrDown :>> ', newGame);
    return newGame;
  };

  const getMatrix = (game) => {
    let tempGame = new Array(length);
    for (let i = 0; i < length; i++) {
      tempGame[i] = [...game[i]];
    }
    // console.log('tempGame :>> ', tempGame);
    return tempGame;
  };

  const comparMatrix = (currentGame, prevGame) => {
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
      <ToastContainer className='toast-message'autoClose={2000} hideProgressBar={true} position="bottom-center" theme="dark"/>
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

   
