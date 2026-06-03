import React from "react";
import './SectionPlaceholder.scss';

function SectionPlaceholder({ name, hint }) {
    return (
        <div className="section-placeholder">
            <div className="section-placeholder__inner">
                <span className="section-placeholder__tag">📌 {name}</span>
                {hint && <p className="section-placeholder__hint">{hint}</p>}
            </div>
        </div>
    );
}

export default SectionPlaceholder;