import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./UtilitySidebar.scss";
import PomodoroClock from "./PomodoroClock";
import AddTaskModal from "../taskmanagement/AddTaskModal";
import { TaskContext } from "../taskmanagement/TaskContext";
import { LanguageContext } from "../../context/LanguageContext";
import moment from "jalali-moment";

function UtilitySidebar({ selectedTask, selectedDate }) {
    const { t, language } = useContext(LanguageContext);
    const [showModal, setShowModal] = useState(false);
    const { setTasks } = useContext(TaskContext);
    const navigate = useNavigate();

    const handleTaskAdded = (newTask) => {
        const formattedTask = {
            ...newTask,
            deadline_date: language === "fa"
                ? moment(newTask.deadline_date, "YYYY-MM-DD").locale("fa").format("jYYYY/jMM/jDD")
                : moment(newTask.deadline_date, "YYYY-MM-DD").format("YYYY/MM/DD"),
            isDone: false,
            subtasks: newTask.subtasks || [],
        };
        setTasks((prevTasks) => [...prevTasks, formattedTask]);
        setShowModal(false);
        navigate("/task-management");
    };

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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 11L12 14L22 4"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
            onClick={() => setShowModal(true)}
          >
            <span className="utility-sidebar__add-button-text">
              {t("utilitySidebar.addTask")}
            </span>
            <div className="utility-sidebar__add-button-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <AddTaskModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  onTaskAdded={handleTaskAdded}
                  selectedDate={selectedDate}
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    );
}

export default UtilitySidebar;
