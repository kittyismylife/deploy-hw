import React, { useState } from "react";
import styled from "styled-components";
import SearchIcon from "../assets/search.svg";

const Search = ({ onSearch }) => {
  const [keywords, setKeywords] = useState("");

  const handleInputChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleSearchClick = () => {
    const tagsArray = keywords
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace("#", "")) // # 제거
      .filter((tag) => tag.length > 0);
    onSearch(tagsArray);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <SearchWrap>
      <SearchBox>
        <InputBox
          type="text"
          placeholder="#프로틴 #저당 등 웰니스 키워드를 검색해 주세요."
          value={keywords}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={handleSearchClick}>
          <SearchImg src={SearchIcon} alt="Search Icon" />
        </SearchButton>
      </SearchBox>
    </SearchWrap>
  );
};

export default Search;

//
// 스타일
//
const SearchWrap = styled.div`
  justify-content: center;
  width: 100%;
  display: flex;
  margin-top: 25px;
  margin-bottom: 25px;
`;

const SearchImg = styled.img`
  width: 20px;
  height: 20px;
  margin-left: -45px;
`;

const SearchBox = styled.div`
  background-color: #f8f8f8;
  border-radius: 10px;
  margin: 0px;
  display: flex;
  align-items: center;
  box-shadow: 0px 1px 2px 0px #00000040;
  width: 90%;
  justify-content: center;
`;

const InputBox = styled.input`
  outline: none;
  border: none;
  width: 80%;
  background-color: #f8f8f8;
  font-size: 13px;
  height: 35px;
`;

const SearchButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  margin-left: 50px;
`;
