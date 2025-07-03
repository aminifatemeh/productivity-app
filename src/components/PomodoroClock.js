import React from 'react';
import './PomodoroClock.scss';

function PomodoroClock() {
  return (
    <>
        <div className="pomodoro-clock">
            <div className="pomodoro-clock__white-bg">
            </div>
            <div className="pomodoro-clock__play-button">
                <div className="pomodoro-clock__triangle"></div>
            </div>
            <span className='pomodoro-clock__minute'>0</span>
          <span className='pomodoro-clock__minute'>15</span>
            <span className='pomodoro-clock__minute'>30</span>
            <span className='pomodoro-clock__minute'>45</span>
            <div className="pomodoro-clock__timer"><span>00</span>: <span>00</span> : <span>00</span></div>
        </div>
    </>
  );
}

export default PomodoroClock;
