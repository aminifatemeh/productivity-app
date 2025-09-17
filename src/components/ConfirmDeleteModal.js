import React from 'react';
import './ConfirmDeleteModal.scss';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="ConfirmDeleteModal">
            <div className="ConfirmDeleteModal-content">
                <h3>حذف تسک</h3>
                <p>آیا مطمئن هستید که می‌خواهید تسک "{taskTitle}" را حذف کنید؟</p>
                <div className="ConfirmDeleteModal-buttons">
                    <button className="btn btn-secondary" onClick={onClose}>
                        خیر
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        بله، حذف کن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;