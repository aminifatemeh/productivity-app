import React from "react";
import "./TaskPreviewCard.scss";

const cardConfigs = {
  active: {
    color: "#38A3A5",
    icon: "/assets/icons/active.svg",
    label: "نوبتش میشه",
  },
  upNext: {
    color: "#57CC99",
    icon: "/assets/icons/up-next.svg",
    label: "روی میز",
  },
  archived: {
    color: "#80ED99",
    icon: "/assets/icons/archived.svg",
    label: "خاک خورده",
  },
};

function TaskPreviewCard({ cardName, tasks, setSelectedTask }) {
  const config = cardConfigs[cardName];

  // فیلتر کردن تسک‌ها بر اساس cardName
  const filteredTasks = tasks.filter((task) => {
    if (cardName === "active") return task.flag_tuNobat && !task.isDone;
    if (cardName === "upNext") return !task.flag_tuNobat && !task.isDone;
    if (cardName === "archived") return task.isDone;
    return false;
  });

  return (
      <div
          className="task-preview__card"
          style={{ backgroundColor: config.color }}
      >
        <div>
          <img src={config.icon} alt="" />
          <span>{config.label}</span>
        </div>
        <div className="task-preview__card-tasks">
          {filteredTasks.length === 0 ? (
              <span>هیچ تسکی موجود نیست</span>
          ) : (
              filteredTasks.map((task) => (
                  <div key={task.id} className="task-preview__card-task">
                    <div className="circle"></div>
                    <span>{task.title}</span>
                    <img
                        src="/assets/icons/Polygon.svg"
                        alt="Select Task"
                        className="cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                    />
                  </div>
              ))
          )}
        </div>
      </div>
  );
}

export default TaskPreviewCard;