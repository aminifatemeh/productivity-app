import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./UtilitySidebar.scss";
import PomodoroClock from "./PomodoroClock";
import AddTaskModal from "./AddTaskModal";
import { TaskContext } from "./TaskContext";
import { LanguageContext } from "../context/LanguageContext";
import moment from "jalali-moment";

function UtilitySidebar({ selectedTask, selectedDate }) {
    const { t } = useContext(LanguageContext);
    const [showModal, setShowModal] = useState(false);
    const { setTasks } = useContext(TaskContext);
    const navigate = useNavigate();

    const handleTaskAdded = (newTask) => {
        const formattedTask = {
            ...newTask,
            deadline_date: moment(newTask.deadline_date, "YYYY-MM-DD")
                .locale("fa")
                .format("jYYYY/jMM/jDD"),
            isDone: false,
            subtasks: newTask.subtasks || [],
        };
        setTasks((prevTasks) => [...prevTasks, formattedTask]);
        setShowModal(false);
        navigate("/task-management");
    };

    return (
        <nav className="utility-sidebar">
            <div className="utility-sidebar__gradient"></div>
            <div className="utility-sidebar__content">
                <div className="utility-sidebar__top-content">
                    <PomodoroClock selectedTask={selectedTask} />
                    {selectedTask && (
                        <div className="task-details__rectangle">
                            <h3 className="task-details__title">{selectedTask.title}</h3>
                            <p className="task-details__description">
                                {selectedTask.description || t("utilitySidebar.noDescription")}
                            </p>
                        </div>
                    )}
                </div>
                <button
                    className="utility-sidebar__content-add-task"
                    onClick={() => setShowModal(true)}
                >
                    <span>{t("utilitySidebar.addTask")}</span>
                    <div className="circle">
                        <img src="/assets/icons/plus.svg" alt="add" />
                    </div>
                </button>
                {showModal && (
                    <div className="modal-overlay">
                        <AddTaskModal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            onTaskAdded={handleTaskAdded}
                            selectedDate={selectedDate}
                        />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default UtilitySidebar;