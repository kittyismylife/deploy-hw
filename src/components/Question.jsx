import React from "react";
import styled from "styled-components";

const Question = ({ q, a, onOptionClick }) => (
  <Container>
    <Qbox>
      <Q dangerouslySetInnerHTML={{ __html: q }} />
    </Qbox>
    <ButtonBox>
      {a.map((option, index) => (
        <Button
          key={index}
          onClick={() => onOptionClick(option.type, index)} // 클릭 시 type과 index 전달
          dangerouslySetInnerHTML={{ __html: option.text }}
        />
      ))}
    </ButtonBox>
  </Container>
);

export default Question;

//
// 스타일
//

const Container = styled.div`
  text-align: center;
  justify-content: center;
`;

const Qbox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 170px;
`;

const Q = styled.p`
  font-family: "Noto Sans KR";
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 1px;
  text-align: center;
  color: #311505;
`;

const Button = styled.button`
  margin: 15px auto;
  width: 310px;
  height: 60px;
  border: 1px solid var(--brown);
  background-color: white;
  border-radius: 50px;
  white-space: pre-wrap;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: var(--brown);
  font-size: 11px;
  font-family: "Noto Sans KR";
  font-weight: medium;
  letter-spacing: -0.5px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);

  cursor: pointer;

  &:hover {
    background-color: var(--yellow);
    border: 1px solid var(--yellow);
  }
`;

const ButtonBox = styled.div`
  margin-bottom: 100px;
`;
