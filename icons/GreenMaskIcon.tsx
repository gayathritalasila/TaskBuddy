import React from "react";

interface GreenMaskIconProps {
    style?: React.CSSProperties;
}

const GreenMaskIcon: React.FC<GreenMaskIconProps> = ({ style }) => {
    return (
        <div style={style}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5795 7.00449L8.77283 12.0045C8.61616 12.2103 8.37366 12.332 8.11533 12.3337H8.10949C7.85366 12.3337 7.61199 12.2153 7.45366 12.0137L5.42699 9.42449C5.14366 9.06283 5.20699 8.53866 5.56949 8.25533C5.93116 7.97116 6.45616 8.03449 6.73949 8.39783L8.10033 10.1362L11.2537 5.99533C11.532 5.62949 12.0545 5.55783 12.422 5.83699C12.7878 6.11616 12.8587 6.63866 12.5795 7.00449ZM9.00033 0.666992C4.39783 0.666992 0.666992 4.39783 0.666992 9.00033C0.666992 13.602 4.39783 17.3337 9.00033 17.3337C13.6028 17.3337 17.3337 13.602 17.3337 9.00033C17.3337 4.39783 13.6028 0.666992 9.00033 0.666992Z" fill="#1B8D17" />
            </svg>
        </div>
    );
};

export default GreenMaskIcon;
