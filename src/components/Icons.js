import React from "react";

const IconWrapper = ({ children, size = 24, color = "currentColor", viewBox = "0 0 24 24", ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        {children}
    </svg>
);

// --- Task Preview Icons ---
export const KhakKhordeIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <circle cx="12" cy="12" r="1.2" fill={color} />
        <line x1="12" y1="12" x2="12" y2="3" stroke={color} strokeWidth="1.2" />
        <line x1="12" y1="12" x2="19.5" y2="7.5" stroke={color} strokeWidth="1.2" />
        <line x1="12" y1="12" x2="19.5" y2="16.5" stroke={color} strokeWidth="1.2" />
        <line x1="12" y1="12" x2="12" y2="21" stroke={color} strokeWidth="1.2" />
        <line x1="12" y1="12" x2="4.5" y2="16.5" stroke={color} strokeWidth="1.2" />
        <line x1="12" y1="12" x2="4.5" y2="7.5" stroke={color} strokeWidth="1.2" />
        <path d="M12 6 Q15.5 9 15.5 12 Q15.5 15 12 18 Q8.5 15 8.5 12 Q8.5 9 12 6Z" stroke={color} strokeWidth="1" fill="none" />
        <path d="M12 3.5 Q18 7.5 18 12 Q18 16.5 12 20.5 Q6 16.5 6 12 Q6 7.5 12 3.5Z" stroke={color} strokeWidth="1" fill="none" />
    </IconWrapper>
);

export const NobateshMisheIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <rect x="2" y="10" width="20" height="2.5" rx="1.2" stroke={color} strokeWidth="1.5" />
        <line x1="6" y1="12.5" x2="5" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="12.5" x2="19" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5.3" y1="17" x2="18.7" y2="17" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </IconWrapper>
);

export const RumizIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <line x1="7" y1="3" x2="17" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="21" x2="17" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 3 C8 3 8 8 12 12 C16 16 16 21 16 21" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M16 3 C16 3 16 8 12 12 C8 16 8 21 8 21" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9.5 19.5 Q12 17.5 14.5 19.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </IconWrapper>
);

// --- Player Icons ---
export const PlayIcon = ({ size = 16, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} viewBox="0 0 16 16" {...props}>
        <path d="M5 3L13 8L5 13V3Z" fill={color} />
    </IconWrapper>
);

export const PauseIcon = ({ size = 16, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} viewBox="0 0 16 16" {...props}>
        <rect x="4" y="3" width="3" height="10" rx="1" fill={color} />
        <rect x="9" y="3" width="3" height="10" rx="1" fill={color} />
    </IconWrapper>
);

// --- TaskCard Icons ---
export const EditIcon = ({ size = 16, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
);

export const DeleteIcon = ({ size = 16, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M10 11v6M14 11v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </IconWrapper>
);

export const CheckIcon = ({ size = 18, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
);

// --- UtilitySidebar Icons ---
export const CheckSquareIcon = ({ size = 18, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <path d="M9 11L12 14L22 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
);

export const PlusIcon = ({ size = 20, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
);

// --- SidebarMenu Icons ---
export const DashboardIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
);

export const TaskListIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <line x1="9" y1="6" x2="20" y2="6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="18" x2="20" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <polyline points="4,6.5 5.5,8 8,4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="4,12.5 5.5,14 8,10.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="4,18.5 5.5,20 8,16.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
);

export const EyeIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    </IconWrapper>
);

export const ChartIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <polyline points="4,18 8,12 12,15 17,8 20,10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="21" x2="20" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4" y1="4" x2="4" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="8" cy="12" r="1.2" fill={color} stroke="none" />
        <circle cx="12" cy="15" r="1.2" fill={color} stroke="none" />
        <circle cx="17" cy="8" r="1.2" fill={color} stroke="none" />
    </IconWrapper>
);

export const SettingsIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
);

export const LogoutIcon = ({ size, color, ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <path d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17,16 21,12 17,8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="21" y1="12" x2="10" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </IconWrapper>
);

// --- Subtask & Pomodoro Icons ---

export const SubtaskCheckIcon = ({ size = 11, ...props }) => (
    <IconWrapper size={size} viewBox="0 0 24 24" {...props}>
        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);

export const SubtaskDeleteIcon = ({ size = 14, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 11v6M14 11v6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </IconWrapper>
);

export const PomodoroPauseIcon = ({ size = 16, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <rect x="6" y="4" width="4" height="16" rx="1" fill={color}/>
        <rect x="14" y="4" width="4" height="16" rx="1" fill={color}/>
    </IconWrapper>
);

export const PomodoroPlayIcon = ({ size = 16, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <path d="M8 5.14v13.72L19 12L8 5.14z" fill={color}/>
    </IconWrapper>
);

export const PomodoroStopIcon = ({ size = 14, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <rect x="6" y="6" width="12" height="12" rx="1" fill={color}/>
    </IconWrapper>
);

// --- Settings Page Icons ---
export const SettingsPageTitleIcon = ({ size = 22, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </IconWrapper>
);

export const UserInfoIcon = ({ size = 16, color = "currentColor", ...props }) => (
    <IconWrapper size={size} color={color} {...props}>
        <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </IconWrapper>
);