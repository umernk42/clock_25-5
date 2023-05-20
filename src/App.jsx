import { useState, useEffect } from "react";
import "./App.css";
import beep from './assets/beep.mp3'

function App() {
  const [breakLen, setBreakLen] = useState(5);
  const [sessionLen, setSessionLen] = useState(25);
  const [running, setRunning] = useState(false);
  const [breakTime, setBreakTime] = useState(false);
  const [sessionCount, setSessionCount] = useState(sessionLen * 60);

  const tick = () => {
    setSessionCount((prev) => prev - 1);
  };

  const changeState = () => {
    if (breakTime) {
      setSessionCount(sessionLen * 60);
    } else {
      setSessionCount(breakLen * 60);
    }
    setBreakTime((prev) => !prev);
  };

  useEffect(() => {
    if (running === true) {
      const IntervalID = setInterval(tick, 1000);
      if (sessionCount === -1) {
        changeState();
      }
      return () => {
        clearInterval(IntervalID);
      };
    }
  }, [running, sessionCount]);

  const StartStop = () => {
    setRunning((prev) => !prev);
  };

  const resetLen = () => {
    setSessionLen(25);
    setBreakLen(5);
    setSessionCount(25 * 60);
    setRunning(false);
  };

  const changeSession = (e) => {
    if (e.target.id === "session-increment") {
      setSessionLen((prev) => (prev === 60 ? prev : prev + 1));
      if (sessionLen < 60) setSessionCount((prev) => prev + 60);
    } else if (e.target.id === "session-decrement") {
      setSessionLen((prev) => (prev === 1 ? prev : prev - 1));
      if (sessionLen > 1) setSessionCount((prev) => prev - 60);
    } else if (e.target.id === "break-increment") {
      setBreakLen((prev) => (prev === 60 ? prev : prev + 1));
    } else if (e.target.id === "break-decrement") {
      setBreakLen((prev) => (prev === 1 ? prev : prev - 1));
    }
  };

  const secToMMSS = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds - minutes * 60;
    let paddMin = "",
      paddSec = "";
    if (minutes < 10) paddMin = "0";
    if (sec < 10) paddSec = "0";

    return ` ${paddMin}${minutes} : ${paddSec}${sec}`;
  };

  return (
    <>
      <div id="break-label">
        <p>
          Break Length - <span id="break-length">{breakLen}</span>
        </p>
        <button id="break-increment" className="Up" onClick={changeSession}>
          Up
        </button>
        <button id="break-decrement" className="Down" onClick={changeSession}>
          Down
        </button>
      </div>
      <br />
      <div id="session-label">
        <p>
          Session Length - <span id="session-length">{sessionLen}</span>
        </p>
        <button id="session-increment" className="Up" onClick={changeSession}>
          Up
        </button>

        <button id="session-decrement" className="Down" onClick={changeSession}>
          Down
        </button>
      </div>
      <br />
      <div id="timer-label">
        {breakTime ? <div>Break</div> : <div>Session</div>}
      </div>
      <div id="time-left">{secToMMSS(sessionCount)}</div>
      <button id="start_stop" onClick={StartStop}>
        start-stop
      </button>
      <button id="reset" onClick={resetLen}>
        reset
      </button>
      <div></div>
      {(sessionCount === 0) ? (<audio id="beep" autoPlay src={beep}></audio>) : <div></div>}
    </>
  );
}

export default App;
