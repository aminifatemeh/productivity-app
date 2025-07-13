import React, {useRef, useEffect} from "react";
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import TaskComponent from "../api/api";

function TaskManagementPage() {
  const [showModal, setShowModal] = React.useState(false);
  const gridSectionRef = useRef(null);
    useEffect(() => {
        if (gridSectionRef.current) {
            gridSectionRef.current.style.overflowY = showModal ? "hidden" : "auto";
        }
    }, [showModal]);
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <SidebarMenu />

      <div className="d-flex flex-column flex-grow-1">
        {/* Header Section */}
        <div style={{ height: "100px", backgroundColor: "lightcoral" }}></div>
        <div style={{ height: "100px", backgroundColor: "lightcoral" }}></div>
          <TaskComponent/>

        {/* Grid Section */}
        <div
            ref={gridSectionRef}
          className="flex-grow-1 d-flex flex-column"
          style={{
            margin: "30px",
            padding: "20px",
            overflowY: "auto",
            overflowX: "hidden",
              position: "relative",
          }}
        >
          <div className="row gy-4">
            {[...Array(10)].map((_, index) => (
              <div className="col-12 col-sm-6 col-md-4" key={index}>
                <TaskCard />
              </div>
            ))}
          </div>
            {showModal && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(77, 91, 85, 0.94)",
                        borderRadius: '8px',
                        zIndex: 10,
                        padding: '20px 0'
                    }}
                >
                    <AddTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
                </div>
            )}

        </div>
        <div className="d-flex w-100 justify-content-center align-items-center">
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "320px",
              height: "50px",
              backgroundColor: "#80D084",
              border: "none",
              borderRadius: "28px",
              marginBottom: "20px",
            }}
          >
            افزودن تسک
          </button>
        </div>
      </div>
    </div>
        );
}

export default TaskManagementPage;
