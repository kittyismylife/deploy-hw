// Menubar.js

import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/SideBar";
import "../styles/Menubar.css";
import logo from "../assets/logo.png";
import styled from "styled-components";
import axios from "axios";

const Menubar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleSide = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchCartItems = () => {
      axios
        .get("http://52.78.180.44:8080/cart-items/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          const totalItems = response.data.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(totalItems);
        })
        .catch((error) => console.log(error));
    };

    fetchCartItems();

    // cartUpdated 이벤트 리스너 추가
    const handleCartUpdate = (event) => {
      setCartCount((prevCount) => prevCount + event.detail);
    };

    // cartReset 이벤트 리스너 추가
    const handleCartReset = () => {
      setCartCount(0); // 장바구니 수량을 0으로 설정
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("cartReset", handleCartReset);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("cartReset", handleCartReset);
    };
  }, []);

  const location = useLocation();
  const isTestPath =
    location.pathname.startsWith("/test") ||
    location.pathname.startsWith("/cart/orderclear");

  const getLinkClass = (path) => {
    return location.pathname.startsWith(path)
      ? "menu-link active"
      : "menu-link";
  };

  const isActiveIcon = (path) => {
    return location.pathname.startsWith(path) ? "icon active" : "icon";
  };

  return (
    <>
      <div className="menubar">
        <div className="menu-row1">
          <div className="logo">
            <Link to="/bakery">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          </div>
          <div className="icons">
            <Link to="/cart" className={isActiveIcon("/cart")}>
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <div className="count-box">
                  <div className="cart-count">{cartCount}</div>
                </div>
              )}
            </Link>
            <Link to="/users" className={isActiveIcon("/users")}>
              <i className="fas fa-user"></i>
            </Link>
            <SidebarBtn onClick={toggleSide} className="icon">
              <i className="fas fa-bars"></i>
            </SidebarBtn>
          </div>
        </div>
        {!isTestPath && (
          <div className="menu-row2">
            <ul className="menu-list">
              <li>
                <Link to="/bakery" className={getLinkClass("/bakery")}>
                  웰니스빵
                </Link>
              </li>
              <li>
                <Link to="/recipes" className={getLinkClass("/recipes")}>
                  빵레시피
                </Link>
              </li>
              <li>
                <Link to="/diary" className={getLinkClass("/diary")}>
                  빵기록
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Outlet />
    </>
  );
};

export default Menubar;

const SidebarBtn = styled.button`
  border: none;
  background-color: white;
  margin-left: -7px;
`;
