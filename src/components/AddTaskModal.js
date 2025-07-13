import React from 'react';
import './AddTaskModal.scss'

const AddTaskModal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
        <div className='AddTaskModal'>
            <div className="AddTaskModal-border"></div>
            <span className="AddTaskModal-title">افزودن تسک</span>
            <form action="" className="AddTaskModal-form">
                <div className="form-group">
                    <label>نام</label>
                    <input type="text"/>
                </div>
            </form>
        </div>
    )
}

export default AddTaskModal;
