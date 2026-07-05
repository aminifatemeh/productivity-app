import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./UtilitySidebar.scss";
import PomodoroClock from "./PomodoroClock";
import AddTaskModal from "../taskmanagement/AddTaskModal";
import { TaskContext } from "../../api/TaskContext";
import { LanguageContext } from "../../context/LanguageContext";
import moment from "jalali-moment";
import { CheckSquareIcon, PlusIcon } from "../Icons"; // <-- Import Icons


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
            onClick={() => setShowModal(true)}
          >
            <span className="utility-sidebar__add-button-text">
              {t("utilitySidebar.addTask")}
            </span>
            <div className="utility-sidebar__add-button-icon">
                <PlusIcon />
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
