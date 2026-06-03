import React from "react";
import './LogoPlaceholder.scss';


function LogoPlaceholder() {
    return (
        <div className="logo-placeholder">
            <div className="logo-placeholder__icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="10" fill="url(#logoGrad)"/>
                    <path d="M8 16 L14 22 L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                            <stop offset="0%" stopColor="#38A3A5"/>
                            <stop offset="100%" stopColor="#57CC99"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <span className="logo-placeholder__text">یار پلنر</span>
        </div>
    );
}

export default LogoPlaceholder;