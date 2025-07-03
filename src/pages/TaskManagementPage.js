import React from "react";
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";

function TaskManagementPage() {
    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            <SidebarMenu />

            <div className="d-flex flex-column flex-grow-1">
                {/* Header Section */}
                <div style={{ height: "100px", backgroundColor: "lightcoral" }}></div>
                <div style={{ height: "100px", backgroundColor: "lightcoral" }}></div>

                {/* Grid Section */}
                <div
                    className="flex-grow-1"
                    style={{
                        margin: "30px",
                        padding: '20px',
                        overflowY: "auto",
                        overflowX: "hidden",
                        backgroundColor: "lightgreen",
                    }}
                >
                    <div className="row gy-4">
                        {[...Array(20)].map((_, index) => (
                            <div
                                className="col-12 col-sm-6 col-md-4"
                                key={index}
                            >
                                <TaskCard />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskManagementPage;
