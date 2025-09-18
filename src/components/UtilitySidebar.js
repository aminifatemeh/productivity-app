import React from "react";
import "./UtilitySidebar.scss";
import PomodoroClock from "./PomodoroClock";

function UtilitySidebar({ selectedTask }) {
    return (
        <nav className="utility-sidebar">
            <div className="utility-sidebar__gradient"></div>
            <div className="utility-sidebar__content">
                <PomodoroClock selectedTask={selectedTask} />
                {selectedTask && (
                    <div className="task-details__rectangle">
                        <h3 className="task-details__title">{selectedTask.title}</h3>
                        <p className="task-details__description">
                            {selectedTask.description || "بدون توضیحات"}
                        </p>
                    </div>
                )}
                <button className="utility-sidebar__content-add-task">
                    <span className="ms-4">اضافه کردن تسک جدید</span>
                    <div className="circle">
                        <img src="/assets/icons/plus.svg" alt="" />
                    </div>
                </button>
            </div>
        </nav>
    );
}

export default UtilitySidebar;