import React, { useState, useEffect } from "react";
import "./TaskCard.scss";
import SubtaskBar from "./SubtaskBar";
import ProgressBar from "../ProgressBar";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { EditIcon, DeleteIcon, CheckIcon } from "../Icons"; // <-- Import Icons
import moment from "jalali-moment";

const TAG_COLOR = "#01575C"; // Matches your app's primary dark color
const MAX_VISIBLE_TAGS = 3;

const getTagColor = () => TAG_COLOR;

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



  const toggleSubtaskDone = async (index) => {
    const originalSubtasks = [...subtasks];

    // 1. Update local state immediately
    const updated = subtasks.map((s, i) =>
        i === index ? { ...s, isDone: !s.isDone } : s
    );
    setSubtasks(updated);

    const doneCount = updated.filter((t) => t.isDone).length;
    const allDone = updated.length > 0 && doneCount === updated.length;

    // 2. Persist subtasks silently
    const result = await onUpdateTask(
        {
          ...task,
          subtasks: updated,
          isDone: task.isDone,
        },
        { silent: true }
    );

    if (!result?.success) {
      setSubtasks(originalSubtasks);
      return;
    }

    // 3. Toggle parent task when ALL subtasks just became done
    if (allDone && !task.isDone) {
      await onToggleTask(task.id);
    }

    // ✅ NEW: Untoggle parent task when it WAS done but now isn't 100%
    if (!allDone && task.isDone) {
      await onToggleTask(task.id);
    }
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
              <span>
                تاریخ انقضا: {formatDateForDisplay(task.deadline_date)}
              </span>
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
                <EditIcon />
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
                <DeleteIcon />
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
                <CheckIcon />
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
