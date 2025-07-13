import React, { useState } from "react";
import "./TaskCard.scss";
import SubtaskBar from "./SubtaskBar";
import ProgressBar from "./ProgressBar";

function TaskCard() {
  const [expanded, setExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState([
    { id: 1, title: "فصل 1", isDone: false },
    { id: 2, title: "فصل 2", isDone: false },
    { id: 3, title: "فصل 3", isDone: false },
  ]);

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
  };

  const toggleSubtaskDone = (index) => {
    const updated = [...subtasks];
    updated[index].isDone = !updated[index].isDone;
    setSubtasks(updated);
  };

  const toggleCard = () => setExpanded(!expanded);

  const handleDelete = (index) => {
    const newTasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newTasks);
  };

  const doneCount = subtasks.filter((t)=> t.isDone).length;
  const progressPercent = subtasks.length === 0 ? 0 : Math.round((doneCount/subtasks.length) * 100);

  return (
    <div
      className={`TaskCard ${expanded ? "expanded" : ""}`}
      onClick={toggleCard}
    >
      <div className="TaskCard__description">
        <div className="TaskCard__description-titles">
          <span>مطالعه سه فصل آخر کتاب</span>
          <span>آمادگی برای آزمون پایان ترم</span>
          <span>تاریخ انقضا: 15 فروردین 1404</span>
        </div>
        <div className="TaskCard__description-labels">
          <div className="task-icons">
            <img src="/assets/icons/edit.svg" alt="" />
            <img src="/assets/icons/trash-bin.svg" alt="" />
            <img src="/assets/icons/green-tick.svg" alt="" />
          </div>
          <div className="task-label">امتحانات ترم</div>
        </div>
      </div>
      <div className="TaskCard__divider--top" />
      <div className="TaskCard__divider" />

      {/* فقط وقتی باز شد، محتوای اضافه رو نشون بده */}
      {expanded && (
        <div className="TaskCard__expanded-area">
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
                onDelete={() => handleDelete(index)}
              />
            </div>
          ))}
        </div>
      )}
      <ProgressBar
        className="TaskCard__progressBar"
        progress={`${progressPercent}%`}
      />
    </div>
  );
}

export default TaskCard;
