import React from "react";
import styled from "styled-components";

const Category = ({ imgSrc, name, uiName, isSelected, onClick }) => {
  const handleCategoryClick = () => {
    onClick(name);
  };

  return (
    <CategoryWrap>
      <CategoryBox onClick={handleCategoryClick}>
        <CategoryImg src={imgSrc} alt={uiName} />
        <CategoryName isSelected={isSelected} uiName={uiName}>
          {uiName}
        </CategoryName>
      </CategoryBox>
    </CategoryWrap>
  );
};

export default Category;

//
// 스타일
//

const CategoryWrap = styled.div`
  justify-content: center;
  display: flex;
`;

const CategoryBox = styled.button`
  border: none;
  background-color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CategoryImg = styled.img`
  width: 100%;
  height: auto;
`;

const CategoryName = styled.div`
  color: ${({ isSelected }) => (isSelected ? "#FFB415" : "var(--brown)")};
  font-size: 12px;
  font-weight: 1000;
  letter-spacing: -0.5px;
  margin-top: ${({ uiName }) => (uiName === "바게트/치아바타" ? "8px" : "5px")};
`;
