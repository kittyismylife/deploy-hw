import React from "react";
import YellowBtn from "../components/YellowBtn";
import LogoIcon from "../assets/logoIcon.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const OrderClear = () => {
  const navigate = useNavigate();

  return (
    <>
      <Warp>
        <Icon src={LogoIcon} />
        <LargeText>결제가 완료되었어요!</LargeText>
        <SmallText>빵긋빵굿과 함께해주셔서 감사합니다 :)</SmallText>
        <YellowBtn
          onBtnClick={() => navigate("/bakery")}
          txt="메인 화면으로 돌아가기"
          position={"relative"}
        />
      </Warp>
    </>
  );
};

export default OrderClear;

const Warp = styled.div`
  margin-top: 200px;
  text-align: center;
  align-items: center;
`;
const Icon = styled.img`
  width: 66px;
`;
const LargeText = styled.div`
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 50px;
  color: black;
  margin-top: 25px;
`;
const SmallText = styled.div`
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.5px;
  margin-bottom: 30px;
`;
