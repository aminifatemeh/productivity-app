import React from "react";
import './ProgressBar.scss'

function ProgressBar({ className }) {
  return (
    <div className={`Progressbar-container ${className || ""}`}>
      <div className="progressbar"></div>
      <span className="progressbar-percentage"></span>
    </div>
  );
}

export default ProgressBar;