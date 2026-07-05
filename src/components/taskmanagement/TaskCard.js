import React, { useState, useEffect } from "react";
import "./TaskCard.scss";
import SubtaskBar from "./SubtaskBar";
import ProgressBar from "../ProgressBar";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import moment from "jalali-moment";

// رنگ دسته‌بندی‌ها مطابق با AddTaskModal
const CATEGORY_COLORS = {
  "درس": "#4690E4",
  "کار": "#DA348D",
  "کلاس": "#FFA500",
  "ورزش": "#34AA7B",
  "سلامتی": "#FF6B6B",
};

const DEFAULT_TAG_COLOR = "#38A3A5";
const MAX_VISIBLE_TAGS = 3;

const getTagColor = (tag) =>
    tag?.color || CATEGORY_COLORS[tag?.name] || DEFAULT_TAG_COLOR;

function TaskCard({
                    task,
                    onUpdateTask,
                    onDeleteTask,
                    onEditTask,
                    onToggleTask,
                    originalIndex,
                  }) {
  const [expanded, setExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState(
      Array.isArray(task.subtasks)
          ? task.subtasks.map((subtask) => ({
            id: subtask.id,
            title: subtask.title,
            isDone: !!subtask.done_date,
          }))
          : []
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // همگام‌سازی subtasks لوکال وقتی task تغییر می‌کند
  useEffect(() => {
    setSubtasks(
        Array.isArray(task.subtasks)
            ? task.subtasks.map((subtask) => ({
              id: subtask.id,
              title: subtask.title,
              isDone: !!subtask.done_date,
            }))
            : []
    );
  }, [task.subtasks]);

  // تابع تبدیل تاریخ میلادی به شمسی برای نمایش
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const m = moment(dateStr, "YYYY-MM-DD", true);
    if (!m.isValid()) {
      console.log("تاریخ نامعتبر در TaskCard:", dateStr);
      return "";
    }
    return m.locale("fa").format("jYYYY/jMM/jDD");
  };

  useEffect(() => {
    if (task.isDone !== undefined) {
      const isAllDone = task.isDone;
      setSubtasks((prevSubtasks) =>
          prevSubtasks.map((subtask) => ({
            ...subtask,
            isDone: isAllDone,
          }))
      );
    }
  }, [task.isDone]);

  const toggleSubtaskDone = (index) => {
    const updated = [...subtasks];
    updated[index].isDone = !updated[index].isDone;
    setSubtasks(updated);

    const newDoneCount = updated.filter((t) => t.isDone).length;
    const isTaskDone = updated.length > 0 && newDoneCount === updated.length;

    onUpdateTask({ ...task, subtasks: updated, isDone: isTaskDone });
  };

  const handleDeleteSubtask = (index) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
    onUpdateTask({ ...task, subtasks: newSubtasks });
  };

  const toggleCard = () => {
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

  const handleConfirmDelete = async () => {
    const result = await onDeleteTask(task.id);
    if (result && result.success) {
      setIsDeleteModalOpen(false);
    } else {
      console.error("Error deleting task:", result?.error);
      alert(result?.error || "خطایی در حذف تسک رخ داد");
    }
  };

  const handleToggleDone = async () => {
    const isBecomingDone = !task.isDone;

    const updatedLocalSubtasks = subtasks.map((subtask) => ({
      ...subtask,
      isDone: isBecomingDone,
    }));
    setSubtasks(updatedLocalSubtasks);

    const result = await onToggleTask(task.id);
    if (!result.success) {
      console.error("Error toggling task:", result.error);
      setSubtasks((prev) =>
          prev.map((subtask) => ({
            ...subtask,
            isDone: !isBecomingDone,
          }))
      );
      alert(result.error || "خطایی در تغییر وضعیت تسک رخ داد");
    }
  };

  const doneCount = subtasks.filter((t) => t.isDone).length;
  const progressPercent = task.isDone
      ? 100
      : subtasks.length === 0
          ? 0
          : Math.round((doneCount / subtasks.length) * 100);

  const visibleCategories = Array.isArray(task.categories)
      ? task.categories.slice(0, MAX_VISIBLE_TAGS)
      : [];

  const hiddenCategoriesCount = Array.isArray(task.categories)
      ? Math.max(task.categories.length - MAX_VISIBLE_TAGS, 0)
      : 0;

  return (
      <>
        <div
            className={`TaskCard ${expanded ? "expanded" : ""} ${
                task.isDone ? "done" : ""
            }`}
            onClick={toggleCard}
        >
          <div className="TaskCard__description">
            <div className="TaskCard__description-titles">
              <span>{task.title}</span>
              <span>{task.description}</span>
              {task.deadline_date && (
                  <span>تاریخ انقضا: {formatDateForDisplay(task.deadline_date)}</span>
              )}
            </div>

            <div className="TaskCard__description-labels">
              <div className="task-icons">
                <button
                    type="button"
                    className="task-icon task-icon--edit"
                    aria-label="ویرایش"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                    type="button"
                    className="task-icon task-icon--delete"
                    aria-label="حذف"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline
                        points="3 6 5 6 21 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 11v6M14 11v6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                    type="button"
                    className={`task-icon task-icon--done ${
                        task.isDone ? "is-done" : ""
                    }`}
                    aria-label="تکمیل"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDone();
                    }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="task-label">
                {visibleCategories.map((category) => (
                    <span
                        key={category.id || category.name}
                        className="task-tag"
                        style={{ backgroundColor: getTagColor(category) }}
                    >
                  {category.name}
                </span>
                ))}

                {hiddenCategoriesCount > 0 && (
                    <span className="task-tag task-tag--more">
                  +{hiddenCategoriesCount}
                </span>
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
                    <div key={subtask.id || index} className="w-100">
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

          <ProgressBar
              className="TaskCard__progressBar"
              progress={`${progressPercent}%`}
          />
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
