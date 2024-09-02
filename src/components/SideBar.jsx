import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Cansle from "../assets/cancel.svg";
import ToggleOn from "../assets/toggledown.png";
import ToggleOff from "../assets/toggleup.png";
import LogoutImg from "../assets/logout.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const handleLogout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm("로그아웃하시겠습니까?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      localStorage.removeItem("username");
      navigate("/accounts/login");
    }
  };

  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const outside = useRef();
  const navigate = useNavigate();

  const handlerOutside = (e) => {
    if (outside.current && !outside.current.contains(e.target)) {
      toggleSide();
    }
  };

  const toggleSide = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handlerOutside);
    } else {
      document.removeEventListener("mousedown", handlerOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handlerOutside);
    };
  }, [isOpen]);

  const toggleRecipe = (e) => {
    e.stopPropagation();
    setIsRecipeOpen(!isRecipeOpen);
  };

  const toggleMyPage = (e) => {
    e.stopPropagation();
    setIsMyPageOpen(!isMyPageOpen);
  };

  return (
    <>
      {isOpen && <Overlay onClick={toggleSide} />}
      <SideBarWrap ref={outside} className={isOpen ? "open" : ""}>
        <Title>오늘도 건강한 빵 되세요 :)</Title>
        <CloseImg
          src={Cansle}
          alt="close"
          onClick={toggleSide}
          onKeyDown={toggleSide}
          role="button"
          tabIndex={0}
        />
        <HrDiv />
        <ul>
          <Menu>
            <StyledLink to="/bakery" onClick={toggleSide}>
              웰니스빵
            </StyledLink>
          </Menu>
          <Menu>
            <StyledLink to="/diary" onClick={toggleSide}>
              빵기록
            </StyledLink>
          </Menu>
          <Menu onClick={toggleRecipe}>
            빵레시피
            <ToggleImg src={isRecipeOpen ? ToggleOff : ToggleOn} />
          </Menu>
          {isRecipeOpen && (
            <SubMenu>
              <SubMenuItem>
                <StyledLink to="/recipes" onClick={toggleSide}>
                  빵레시피
                </StyledLink>
              </SubMenuItem>
              <SubMenuItem>
                <StyledLink to="/recipes/write" onClick={toggleSide}>
                  레시피 등록
                </StyledLink>
              </SubMenuItem>
            </SubMenu>
          )}
          <Menu onClick={toggleMyPage}>
            마이페이지
            <ToggleImg src={isMyPageOpen ? ToggleOff : ToggleOn} />
          </Menu>
          {isMyPageOpen && (
            <SubMenu>
              <SubMenuItem>
                <StyledLink to="/users/orders" onClick={toggleSide}>
                  주문목록
                </StyledLink>
              </SubMenuItem>
              <SubMenuItem>
                <StyledLink to="/users/reviews" onClick={toggleSide}>
                  MY 리뷰
                </StyledLink>
              </SubMenuItem>
              <SubMenuItem>
                <StyledLink to="/users/saved-recipes" onClick={toggleSide}>
                  저장한 레시피
                </StyledLink>
              </SubMenuItem>
              <SubMenuItem>
                <StyledLink to="/users/my-recipes" onClick={toggleSide}>
                  MY 레시피
                </StyledLink>
              </SubMenuItem>
              <SubMenuItem>
                <StyledLink to="/test/result/1" onClick={toggleSide}>
                  빵 유형 테스트
                </StyledLink>
              </SubMenuItem>
              <SubMenuItem>
                <StyledLink to="/of-use" onClick={toggleSide}>
                  서비스 이용약관
                </StyledLink>
              </SubMenuItem>
            </SubMenu>
          )}
        </ul>
        <HrDiv />
        <LogoutBtn onClick={handleLogout}>
          로그아웃
          <LogoutIcon src={LogoutImg} />
        </LogoutBtn>
      </SideBarWrap>
    </>
  );
};

export default Sidebar;

//
// 스타일
//

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 4;
`;

const SideBarWrap = styled.div`
  z-index: 5;
  padding: 12px 25px;
  border-radius: 5px 0 0 5px;
  background-color: #ffffff;
  height: 98%;
  width: 80%;
  right: -100%;
  top: 5px;
  position: fixed;
  transition: 0.5s ease;
  cursor: pointer;
  &.open {
    right: 0;
    transition: 0.5s ease;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-family: "Noto Sans KR";
  font-weight: medium;
  letter-spacing: -0.5px;
  line-height: 22px;
  margin-left: 14px;
  margin-top: 3px;
`;

const CloseImg = styled.img`
  position: absolute;
  right: 15px;
  top: 13px;
`;

const HrDiv = styled.div`
  border-bottom: 1px solid #ccc;
  height: 20px;
`;

const Menu = styled.li`
  margin: 30px 8px 15px 8px;
  font-size: 18px;
  font-family: "Noto Sans KR";
  font-weight: Bold;
  line-height: 22px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const ToggleImg = styled.img`
  height: 9px;
  width: 15px;
  padding-top: 5px;
`;

const SubMenu = styled.ul`
  padding-left: 16px;
`;

const SubMenuItem = styled.li`
  margin: 23px 0;
  font-size: 18px;
  font-family: "Noto Sans KR";
  font-weight: medium;
  line-height: 23px;
  border: none;
  background-color: white;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const LogoutBtn = styled.div`
  margin: 30px 8px 15px 8px;
  font-size: 18px;
  font-family: "Noto Sans KR";
  font-weight: Bold;
  line-height: 22px;
  color: #979797;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const LogoutIcon = styled.img`
  width: 17px;
  height: 18px;
`;
