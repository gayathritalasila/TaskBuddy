import React from "react";

interface ChevronDownIconProps {
  styles?: React.CSSProperties;
  color?: string;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ styles }) => {
  return (
    <div style={styles}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0001 23.2499C18.3841 23.2499 18.7681 23.1029 19.0606 22.8104L25.0606 16.8104C25.6471 16.2239 25.6471 15.2759 25.0606 14.6894C24.4741 14.1029 23.5261 14.1029 22.9396 14.6894L17.9821 19.6469L13.0426 14.8769C12.4441 14.3024 11.4976 14.3189 10.9216 14.9144C10.3456 15.5099 10.3621 16.4609 10.9576 17.0354L16.9576 22.8284C17.2501 23.1104 17.6251 23.2499 18.0001 23.2499Z" fill="#0D7A0A" />
        <mask id="mask0_2038_8175" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="10" y="14" width="16" height="10">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0001 23.2499C18.3841 23.2499 18.7681 23.1029 19.0606 22.8104L25.0606 16.8104C25.6471 16.2239 25.6471 15.2759 25.0606 14.6894C24.4741 14.1029 23.5261 14.1029 22.9396 14.6894L17.9821 19.6469L13.0426 14.8769C12.4441 14.3024 11.4976 14.3189 10.9216 14.9144C10.3456 15.5099 10.3621 16.4609 10.9576 17.0354L16.9576 22.8284C17.2501 23.1104 17.6251 23.2499 18.0001 23.2499Z" fill="white" />
        </mask>
        <g mask="url(#mask0_2038_8175)">
          <rect width="36" height="36" transform="matrix(-1 0 0 1 36 0)" fill="#0D7A0A" />
        </g>
      </svg>
    </div>
  );
};

export default ChevronDownIcon;
