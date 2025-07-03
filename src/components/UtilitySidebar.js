import React from "react";
import "./UtilitySidebar.scss";
import PomodoroClock from "./PomodoroClock";


function UtilitySidebar() {
    return (
      <nav className="utility-sidebar">
        <div className="utility-sidebar__gradient"></div>
        <div className="utility-sidebar__content">
          <PomodoroClock />
          <button className="utility-sidebar__content-add-task">
              <span className='ms-4'>اضافه کردن تسک جدید</span>
              <div className="circle">
                  <img src="/assets/icons/plus.svg" alt=""/>
              </div>
          </button>
        </div>
      </nav>
    );
}

export default UtilitySidebar;