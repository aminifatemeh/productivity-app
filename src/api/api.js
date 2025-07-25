import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskComponent() {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://156.253.5.245:8000/api/tasks/khak_khorde/')
            .then(response => {
                setTask(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>در حال بارگذاری...</div>;
    if (error) return <div>خطا: {error}</div>;

    return (
        <div>
            <h2>اطلاعات تسک</h2>
            <pre>{JSON.stringify(task, null, 2)}</pre>
        </div>
    );
}

export default TaskComponent;
