import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Cancel from "../../assets/cancel.svg";
import SignForm from "../../components/SignForm.jsx";

const Signup = () => {
  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate("/accounts/login");
  };

  return (
    <div>
      <Bar>
        <Title>회원가입</Title>
        <CancelIcon src={Cancel} onClick={handleCancelClick} />
      </Bar>
      <ContentWrap>
        <SignForm />
      </ContentWrap>
    </div>
  );
};

export default Signup;

//
// 스타일
//

// 상단 배너
const Bar = styled.div`
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  width: 393px;
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

// 회원가입 폼 감싸기
const ContentWrap = styled.div`
  justify-content: center;
  align-items: center;
  background-color: white;
  padding-top: 90px;
`;
