import React from "react";
import "./ProfileSnippet.scss"

function ProfileSnippet(props) {
    return (
        <div className="profile-snippet">
            <div className="profile-snippet__avatar">
                <img
                    src="/assets/images/profile-snippet-avatar.svg"
                    alt="profile avatar"
                />
            </div>
            <div className="profile-snippet__info">
                <h5>{props.username}</h5>
                <span>{props.userstatus}</span>
            </div>
        </div>
    );
}

export default ProfileSnippet;