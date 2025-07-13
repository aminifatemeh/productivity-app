import React from "react";
import './ProgressBar.scss'

function ProgressBar({ className, progress }) {
  return (
    <div className={`progressbar-container ${className || ""}`}>
      <div className="progressbar" style={{width: `${progress}`}}></div>
      <span className="progressbar-percentage">{progress}</span>
    </div>
  );
}

export default ProgressBar;