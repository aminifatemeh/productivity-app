import React from "react";
import "./TaskPreviewCard.scss";

const cardConfings = {
  active: {
    color: "#38A3A5",
    icon: "/assets/icons/active.svg",
    label: "نوبتش میشه",
    tasks: ["ریاضی", "عربی", "زبان"],
  },
  upNext: {
    color: "#57CC99",
    icon: "/assets/icons/up-next.svg",
    label: "روی میز",
    tasks: ["زبان", "برنامه نویسی"],
  },
  archived: {
    color: "#80ED99",
    icon: "/assets/icons/archived.svg",
    label: "خاک خورده",
    tasks: ["علوم", "اجتماعی"],
  },
};

function TaskPreviewCard({ cardName }) {
  const config = cardConfings[cardName];
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
          {config.tasks.map((task, index) => (
              <div key={index} className="task-preview__card-task">
                  <div className="circle"></div>
                  <span>{task}</span>
                  <img src="/assets/icons/Polygon.svg" alt=""/>
              </div>
          ))}
      </div>
    </div>
  );
}

export default TaskPreviewCard;
