import React, { useState } from "react";
import "./TaskCard.scss";
import SubtaskBar from "./SubtaskBar";
import ProgressBar from "./ProgressBar";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function TaskCard({ task, onUpdateTask, onDeleteTask, onEditTask }) {
  const [expanded, setExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState(
      task.subtasks.map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        isDone: !!subtask.done_date,
      }))
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === index || draggedIndex === null) return;
    const newSubTasks = [...subtasks];
    const draggedItem = newSubTasks[draggedIndex];
    newSubTasks.splice(draggedIndex, 1);
    newSubTasks.splice(index, 0, draggedItem);
    setSubtasks(newSubTasks);
    setDraggedIndex(null);
    onUpdateTask({ ...task, subtasks: newSubTasks });
  };

  const toggleSubtaskDone = (index) => {
    const updated = [...subtasks];
    updated[index].isDone = !updated[index].isDone;
    setSubtasks(updated);
    onUpdateTask({ ...task, subtasks: updated });
  };

  const handleDeleteSubtask = (index) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
    onUpdateTask({ ...task, subtasks: newSubtasks });
  };

  const toggleCard = () => {
    // فقط در صورتی که ساب‌تسک وجود داشته باشد، کارت باز یا بسته شود
    if (subtasks.length > 0) {
      setExpanded(!expanded);
    }
  };

  const handleEdit = () => {
    onEditTask(task);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTask(task.id);
    setIsDeleteModalOpen(false);
  };

  const handleToggleDone = () => {
    const updatedTask = { ...task, isDone: !task.isDone };
    setSubtasks(updatedTask.subtasks.map(subtask => ({
      ...subtask,
      isDone: updatedTask.isDone ? true : !!subtask.done_date,
    })));
    onUpdateTask(updatedTask);
  };

  const doneCount = subtasks.filter((t) => t.isDone).length;
  const progressPercent = subtasks.length === 0 ? 0 : Math.round((doneCount / subtasks.length) * 100);

  return (
      <>
        <div className={`TaskCard ${expanded ? "expanded" : ""} ${task.isDone ? "done" : ""}`} onClick={toggleCard}>
          <div className="TaskCard__description">
            <div className="TaskCard__description-titles">
              <span>{task.title}</span>
              <span>{task.description}</span>
              <span>تاریخ انقضا: {task.deadline_date}</span>
            </div>
            <div className="TaskCard__description-labels">
              <div className="task-icons">
                <img
                    src="/assets/icons/edit.svg"
                    alt="ویرایش"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    style={{ cursor: "pointer" }}
                />
                <img
                    src="/assets/icons/trash-bin.svg"
                    alt="حذف"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    style={{ cursor: "pointer" }}
                />
                <img
                    src="/assets/icons/green-tick.svg"
                    alt="تکمیل"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDone();
                    }}
                    style={{ cursor: "pointer", opacity: task.isDone ? 0.5 : 1 }}
                />
              </div>
              <div className="task-label">
                {task.tags && task.tags.length > 0 ? (
                    task.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="task-tag"
                            style={{
                              backgroundColor: tag.color || "#D9D9D9",
                              marginRight: "5px",
                              padding: "2px 8px",
                              borderRadius: "3px",
                              color: "white",
                              fontSize: "12px",
                              display: "inline-block",
                              width: "70px",
                              height: "21px",
                              textAlign: "center",
                              opacity: task.isDone ? 0.5 : 1,
                            }}
                        >
                    {tag.name}
                  </span>
                    ))
                ) : (
                    <></>
                )}
              </div>
            </div>
          </div>
          <div className="TaskCard__divider--top" />
          <div className="TaskCard__divider" />
          {expanded && subtasks.length > 0 && (
              <div className="TaskCard__expanded-area">
                <div className="task-label-spacer" />
                {subtasks.map((subtask, index) => (
                    <div
                        key={subtask.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className="w-100"
                    >
                      <SubtaskBar
                          title={subtask.title}
                          isDone={subtask.isDone}
                          onToggle={() => toggleSubtaskDone(index)}
                          onDelete={() => handleDeleteSubtask(index)}
                      />
                    </div>
                ))}
              </div>
          )}
          <ProgressBar className="TaskCard__progressBar" progress={`${progressPercent}%`} />
        </div>
        <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            taskTitle={task.title}
        />
      </>
  );
}

export default TaskCard;