import React from "react";
import styled from "styled-components";
import logoIcon from "../assets/logoIcon.svg";

const Footer = () => {
  return (
    <FooterWrap>
      <FooterBox>
        <FirstLine>
          <BngImg src={logoIcon} />
          빵긋빵굿의 파트너스를 모집합니다
          <BngImg src={logoIcon} />
        </FirstLine>
        <br />
        여러분의 맛있고 행복한 웰니스 빵을 소개하고 싶으시다면?
        <br />
        <Email>smilebbanggood@example.com</Email>로 연락 주세요!
      </FooterBox>
    </FooterWrap>
  );
};

export default Footer;

//
// 스타일
//

const BngImg = styled.img`
  width: 10px;
  height: 9px;
`;

const FirstLine = styled.span`
  color: var(--brown);
`;

const FooterWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  background-color: #f8f8f8;
  margin-bottom: 20px;
`;

const FooterBox = styled.div`
  padding: 13px 10%;
  font-size: 11px;
  color: var(--grey);
`;

const Email = styled.span`
  color: var(--brown);
  font-weight: bold;
`;
