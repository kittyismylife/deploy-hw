import React from "react";
import styled from "styled-components";

const ProgressBar = ({ current, total }) => (
  <ProWrap>
    <BarBox>
      <Bar
        style={{
          width: `${(current / total) * 100}%`,
        }}
      ></Bar>
      <Numb>{`${current}/${total}`}</Numb>
    </BarBox>
  </ProWrap>
);

export default ProgressBar;

const ProWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 40px 0;
`;

const Numb = styled.span`
  position: absolute;
  right: 5px;
  top: -20px;
  font-size: 12px;
  color: var(--brown);
  font-family: "Noto Sans KR";
  font-weight: medium;
  letter-spacing: -0.5px;
`;

const BarBox = styled.div`
  width: 80%;
  position: relative;
  background-color: #ffecc4;
  border-radius: 5px;
  height: 10px;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.25);
`;

const Bar = styled.div`
  height: 100%;
  background-color: var(--yellow);
  border-radius: 5px;
`;
