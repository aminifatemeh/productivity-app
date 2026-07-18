import React, { useContext } from "react";
import "./UtilitySidebar.scss";
import PomodoroClock from "./PomodoroClock";
import { LanguageContext } from "../../context/LanguageContext";
import { CheckSquareIcon, PlusIcon } from "../Icons";

function UtilitySidebar({ selectedTask, selectedDate, onAddTaskClick }) {
    const { t } = useContext(LanguageContext);

    return (
        <nav className="utility-sidebar">
            <div className="utility-sidebar__background"></div>
            <div className="utility-sidebar__gradient"></div>
            <div className="utility-sidebar__content">
                <div className="utility-sidebar__top-content">
                    <div className="utility-sidebar__clock-wrapper">
                        <PomodoroClock selectedTask={selectedTask} />
                    </div>
                    {selectedTask && (
                        <div className="task-details">
                            <div className="task-details__header">
                                <div className="task-details__icon">
                                    <CheckSquareIcon />
                                </div>
                                <h3 className="task-details__title">{selectedTask.title}</h3>
                            </div>
                            <div className="task-details__content">
                                <p className="task-details__description">
                                    {selectedTask.description ||
                                        t("utilitySidebar.noDescription")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="utility-sidebar__add-button"
                    onClick={onAddTaskClick}
                >
                    <span className="utility-sidebar__add-button-text">
                        {t("utilitySidebar.addTask")}
                    </span>
                    <div className="utility-sidebar__add-button-icon">
                        <PlusIcon />
                    </div>
                </button>
            </div>
        </nav>
    );
}

export default UtilitySidebar;