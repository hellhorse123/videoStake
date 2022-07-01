import React, { memo } from "react";
import styles from "./ProfileImg.scss";

const ProfileImg = ({
  classname = "",
  width,
  height,
  src,
  id = "",
  alt = "",
}) => {
  return (
    <div className="thumbnail">
      <div className="thumbnail__wrapper">
        <img
          id={id}
          width={width}
          height={height}
          className="img"
          src={src}
          alt={alt}
        />
      </div>
    </div>
  );
};

export default memo(ProfileImg);