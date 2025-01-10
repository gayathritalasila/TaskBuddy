import React from "react";

interface ChevronUpIconProps {
  styles?: React.CSSProperties;
  color?: string;
}

const ChevronUpIcon: React.FC<ChevronUpIconProps> = ({ styles }) => {
  return (
    <div style={styles}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9999 12.7501C17.6159 12.7501 17.2319 12.8971 16.9394 13.1896L10.9394 19.1896C10.3529 19.7761 10.3529 20.7241 10.9394 21.3106C11.5259 21.8971 12.4739 21.8971 13.0604 21.3106L18.0179 16.3531L22.9574 21.1231C23.5559 21.6976 24.5024 21.6811 25.0784 21.0856C25.6544 20.4901 25.6379 19.5391 25.0424 18.9646L19.0424 13.1716C18.7499 12.8896 18.3749 12.7501 17.9999 12.7501Z" fill="#0D7A0A" />
        <mask id="mask0_2038_7582" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="10" y="12" width="16" height="10">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9999 12.7501C17.6159 12.7501 17.2319 12.8971 16.9394 13.1896L10.9394 19.1896C10.3529 19.7761 10.3529 20.7241 10.9394 21.3106C11.5259 21.8971 12.4739 21.8971 13.0604 21.3106L18.0179 16.3531L22.9574 21.1231C23.5559 21.6976 24.5024 21.6811 25.0784 21.0856C25.6544 20.4901 25.6379 19.5391 25.0424 18.9646L19.0424 13.1716C18.7499 12.8896 18.3749 12.7501 17.9999 12.7501Z" fill="white" />
        </mask>
        <g mask="url(#mask0_2038_7582)">
          <rect width="36" height="36" transform="matrix(1 0 0 -1 0 36)" fill="#3E0344" />
        </g>
      </svg>
    </div>
  );
};

export default ChevronUpIcon;