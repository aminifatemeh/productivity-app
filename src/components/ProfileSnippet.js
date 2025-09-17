import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSnippet.scss";

function ProfileSnippet() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const isLoggedIn = !!localStorage.getItem('accessToken');

    const handleClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
        }
        // Optionally navigate to a profile page if logged in
        // else navigate('/profile');
    };

    return (
        <div className="profile-snippet" onClick={handleClick}>
            <div className="profile-snippet__avatar">
                <img
                    src="/assets/images/profile-snippet-avatar.svg"
                    alt="profile avatar"
                />
            </div>
            <div className="profile-snippet__info">
                <h5>{isLoggedIn && username ? username : 'ورود'}</h5>
                <span>{isLoggedIn ? 'وارد شده' : 'لطفاً وارد شوید'}</span>
            </div>
        </div>
    );
}

export default ProfileSnippet;