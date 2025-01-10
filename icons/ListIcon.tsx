import React from "react";

interface ListIconProps {
  style?: React.CSSProperties;
}

const ListIcon: React.FC<ListIconProps> = ({ style }) => {
  return (
    <div style={style}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.4116 5.59287H3.58984C3.35778 5.59287 3.13522 5.50068 2.97113 5.33659C2.80703 5.17249 2.71484 4.94993 2.71484 4.71787V3.58887C2.71484 3.3568 2.80703 3.13424 2.97113 2.97015C3.13522 2.80605 3.35778 2.71387 3.58984 2.71387H12.4116C12.6437 2.71387 12.8662 2.80605 13.0303 2.97015C13.1944 3.13424 13.2866 3.3568 13.2866 3.58887V4.71787C13.2863 4.94983 13.194 5.1722 13.0299 5.33622C12.8659 5.50024 12.6436 5.59254 12.4116 5.59287ZM3.58984 3.46387C3.55669 3.46387 3.5249 3.47704 3.50146 3.50048C3.47801 3.52392 3.46484 3.55572 3.46484 3.58887V4.71787C3.46484 4.75102 3.47801 4.78281 3.50146 4.80626C3.5249 4.8297 3.55669 4.84287 3.58984 4.84287H12.4116C12.4447 4.84287 12.4765 4.8297 12.5 4.80626C12.5234 4.78281 12.5366 4.75102 12.5366 4.71787V3.58887C12.5366 3.55572 12.5234 3.52392 12.5 3.50048C12.4765 3.47704 12.4447 3.46387 12.4116 3.46387H3.58984ZM12.4116 13.2854H3.58984C3.35778 13.2854 3.13522 13.1932 2.97113 13.0291C2.80703 12.865 2.71484 12.6424 2.71484 12.4104V11.2814C2.71484 11.0493 2.80703 10.8267 2.97113 10.6626C3.13522 10.4986 3.35778 10.4064 3.58984 10.4064H12.4116C12.6436 10.4067 12.8659 10.499 13.0299 10.663C13.194 10.827 13.2863 11.0494 13.2866 11.2814V12.4104C13.2866 12.6424 13.1944 12.865 13.0303 13.0291C12.8662 13.1932 12.6437 13.2854 12.4116 13.2854ZM3.58984 11.1564C3.55669 11.1564 3.5249 11.1695 3.50146 11.193C3.47801 11.2164 3.46484 11.2482 3.46484 11.2814V12.4104C3.46484 12.4435 3.47801 12.4753 3.50146 12.4988C3.5249 12.5222 3.55669 12.5354 3.58984 12.5354H12.4116C12.4447 12.5354 12.4765 12.5222 12.5 12.4988C12.5234 12.4753 12.5366 12.4435 12.5366 12.4104V11.2814C12.5366 11.2482 12.5234 11.2164 12.5 11.193C12.4765 11.1695 12.4447 11.1564 12.4116 11.1564H3.58984ZM12.4116 9.43912H3.58984C3.35778 9.43912 3.13522 9.34693 2.97113 9.18284C2.80703 9.01874 2.71484 8.79618 2.71484 8.56412V7.43512C2.71484 7.20305 2.80703 6.98049 2.97113 6.8164C3.13522 6.6523 3.35778 6.56012 3.58984 6.56012H12.4116C12.6436 6.56045 12.8659 6.65274 13.0299 6.81676C13.194 6.98079 13.2863 7.20315 13.2866 7.43512V8.56412C13.2866 8.79618 13.1944 9.01874 13.0303 9.18284C12.8662 9.34693 12.6437 9.43912 12.4116 9.43912ZM3.58984 7.31012C3.55669 7.31012 3.5249 7.32329 3.50146 7.34673C3.47801 7.37017 3.46484 7.40197 3.46484 7.43512V8.56412C3.46484 8.59727 3.47801 8.62906 3.50146 8.65251C3.5249 8.67595 3.55669 8.68912 3.58984 8.68912H12.4116C12.4447 8.68912 12.4765 8.67595 12.5 8.65251C12.5234 8.62906 12.5366 8.59727 12.5366 8.56412V7.43512C12.5366 7.40197 12.5234 7.37017 12.5 7.34673C12.4765 7.32329 12.4447 7.31012 12.4116 7.31012H3.58984Z" fill="black" />
      </svg>
    </div>
  );
};

export default ListIcon;
