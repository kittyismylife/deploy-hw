import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Cancel from "../../assets/cancel.svg";
import Logo from "../../assets/logoIcon.svg";
import LogoLetter from "../../assets/logoLetter.png";
import YellowBtn from "../../components/YellowBtn";

const SignClear = () => {
  const navigate = useNavigate();

  return (
    <>
      <Bar>
        <Title>회원가입</Title>
        <CancelIcon src={Cancel} onClick={() => navigate("/bakery")} />
      </Bar>
      <ContentsWrap>
        <LogoIcon src={Logo} />
        <Welcome>
          <LogoLetterImg src={LogoLetter} />
          에
          <br />
          오신 것을 환영합니다!
        </Welcome>
        <ButtonWrap>
          <YellowBtn
            width={"338px"}
            txt="빵 유형 테스트 하러 가기"
            onBtnClick={() => navigate("/test/questions/1")}
          />
          <YellowBtn
            width={"338px"}
            txt="메인 화면으로 이동하기"
            backgroundColor={"white"}
            border={"1px solid #471D06"}
            onBtnClick={() => navigate("/bakery")}
          />
        </ButtonWrap>
      </ContentsWrap>
    </>
  );
};

export default SignClear;

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
`;

const ContentsWrap = styled.div`
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-top: 184px;
`;

const LogoIcon = styled.img`
  margin-bottom: 35px;
  width: 66px;
  height: auto;
`;

const LogoLetterImg = styled.img`
  width: 116px;
  height: auto;
  margin: 0px 3px;
`;

const Welcome = styled.div`
  font-size: 27px;
  font-weight: 800;
  line-height: 150%;
  padding-bottom: 55px;
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  align-items: center;
`;
