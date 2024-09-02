import React from "react";
import styled from "styled-components";

const YellowBtn = ({
  txt,
  onBtnClick,
  fontSize,
  type,
  width,
  borderRadius,
  color,
  fontWeight,
  backgroundColor,
  border,
  position,
  right,
  bottom,
  zIndex,
}) => {
  return (
    <ButtonBox
      onClick={onBtnClick}
      fontSize={fontSize}
      type={type}
      width={width}
      borderRadius={borderRadius}
      color={color}
      fontWeight={fontWeight}
      backgroundColor={backgroundColor}
      border={border}
      position={position}
      right={right}
      bottom={bottom}
      zIndex={zIndex}
    >
      {txt || "버튼"}
    </ButtonBox>
  );
};

export default YellowBtn;

const ButtonBox = styled.button`
  background-color: ${(props) => props.backgroundColor || "#ffbd30"};
  width: ${(props) => props.width || "300px"};
  height: 40px;
  border-radius: ${(props) => props.borderRadius || "5px"};
  border: ${(props) => props.border || "none"};
  color: ${(props) => props.color || "#471d06"};
  font-weight: ${(props) => props.fontWeight || "700"};
  box-shadow: 0px 2px 4px 0px #00000040;
  cursor: pointer;
  font-size: ${(props) => props.fontSize || "15px"};
  position: ${(props) => props.position || "static"};
  right: ${(props) => props.right || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  z-index: ${(props) => props.zIndex || "auto"};
`;
