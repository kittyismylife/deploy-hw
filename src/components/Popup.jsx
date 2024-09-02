import React from "react";
import styled from "styled-components";
import Cancel from "../assets/cancel.svg";

const Popup = ({ title, children, onClose }) => {
  return (
    <Overlay>
      <Bar>
        <Title>{title}</Title>
        <CancelIcon src={Cancel} onClick={onClose} />
      </Bar>
      <CloseButton onClick={onClose}></CloseButton>
      <PopupContainer>{children}</PopupContainer>
    </Overlay>
  );
};

export default Popup;

//
// 스타일
//

const Bar = styled.div`
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 60px;
`;

const Title = styled.p`
  margin: 0;
`;

const CancelIcon = styled.img`
  position: absolute;
  right: 27px;
  height: 30px;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-color: white;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const PopupContainer = styled.div`
  margin-top: 50px;
  width: 95%;
  max-width: 500px;
  max-height: 90%;

  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;
