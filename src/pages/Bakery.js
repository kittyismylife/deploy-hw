import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import Footer from "../components/Footer";
import styled from "styled-components";
import Search from "../components/Search";
import Category from "../components/Category";
import CategoryPage from "./CategoryPage";
import SearchPage from "./SearchPage";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import axios from "axios";

// 이미지
import bbangSlide from "../assets/bbangSlide.png";
import bbangSlide2 from "../assets/bbangSlide2.png";
import Morning from "../assets/CT-morning.png";
import Bagle from "../assets/CT-bagle.png";
import Baguette from "../assets/CT-baugette.png";
import Cake from "../assets/CT-cake.png";
import Donut from "../assets/CT-donut.png";
import Cream from "../assets/CT-cream.png";
import Harverst from "../assets/CT-harvest.png";
import Event from "../assets/CT-event.png";

function Bakery() {
  const navigate = useNavigate();
  const location = useLocation();
  const [randomProducts, setRandomProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // State for controlling the banner slideshow
  const [currentBanner, setCurrentBanner] = useState(0);
  const [startX, setStartX] = useState(0);
  const banners = [bbangSlide, bbangSlide2];

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://52.78.180.44:8080/bakery/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        const shuffledProducts = response.data.sort(() => 0.5 - Math.random());
        setRandomProducts(shuffledProducts);
        setStatus("success");
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    if (location.pathname === "/bakery") {
      setSelectedCategory(null);
    }
  }, [location.pathname]);

  // Automatically switch banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (name) => {
    setSelectedCategory(name);
    navigate(`/bakery/category/${name}`);
  };

  const handleSearch = (tagsArray) => {
    navigate(`/bakery/search/${tagsArray.join(",")}`);
  };

  // Handle manual image switch
  const toggleBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  // Handle drag start
  const handleDragStart = (e) => {
    setStartX(e.type.includes("mouse") ? e.pageX : e.touches[0].pageX);
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    const endX = e.type.includes("mouse") ? e.pageX : e.changedTouches[0].pageX;
    if (startX - endX > 50) {
      toggleBanner();
    } else if (startX - endX < -50) {
      toggleBanner();
    }
  };

  if (status === "loading") {
    return (
      <MsgBox>
        <Message>Loading...</Message>
      </MsgBox>
    );
  }

  if (status === "error") {
    return (
      <MsgBox>
        <Message>제품을 못불러와버렸다...</Message>
      </MsgBox>
    );
  }

  return (
    <div>
      <div>
        <BannerBox
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onClick={toggleBanner}
        >
          <BannerImg src={banners[currentBanner]} alt="Banner" />
          <DDots>
            {banners.map((_, index) => (
              <Dot key={index} active={index === currentBanner} />
            ))}
          </DDots>
        </BannerBox>
      </div>
      <Search onSearch={handleSearch} />
      <CategoryWrap>
        {categories.map((category) => (
          <Category
            key={category.name}
            name={category.name}
            uiName={category.uiName}
            imgSrc={category.imgSrc}
            isSelected={selectedCategory === category.name}
            onClick={handleCategoryClick}
          />
        ))}
      </CategoryWrap>
      {location.pathname === "/bakery" && (
        <ProductBox>
          {randomProducts.map((product) => (
            <StyledLink to={`/bakery/product/${product.id}`} key={product.id}>
              <Product
                key={product.id}
                imgSrc={product.img_src}
                tags={product.tags}
                name={product.name}
                price={product.price}
              />
            </StyledLink>
          ))}
        </ProductBox>
      )}
      <Routes>
        <Route path="category/:categoryName" element={<CategoryPage />} />
        <Route path="search/:tags" element={<SearchPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

//
// 카테고리 데이터
//

const categories = [
  { name: "bread", uiName: "식빵", imgSrc: Morning },
  { name: "baguette", uiName: "바게트/치아바타", imgSrc: Baguette },
  { name: "bagel", uiName: "베이글", imgSrc: Bagle },
  { name: "cake", uiName: "케이크", imgSrc: Cake },
  { name: "donut", uiName: "도넛", imgSrc: Donut },
  { name: "cream", uiName: "크림빵", imgSrc: Cream },
  { name: "root_vegetable", uiName: "구황작물빵", imgSrc: Harverst },
  { name: "special", uiName: "기획전", imgSrc: Event },
];

//
// 스타일
//

// 배너
const BannerBox = styled.div`
  position: relative;
  padding-top: 56.25%;
  width: 100%;
  box-shadow: 0px 2px 4px 0 rgba(217, 217, 217, 0.5);
  cursor: pointer;
`;

const BannerImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// DDots for indicator
const DDots = styled.div`
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  display: flex;
`;

const Dot = styled.span`
  height: 10px;
  width: 10px;
  margin: 0 5px;
  background-color: ${({ active }) => (active ? "#fff" : "#bbb")};
  opacity: 50%;
  border-radius: 50%;
  transition: background-color 0.3s;
`;

// 상품
const ProductBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
`;

// 링크 가리기
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

// 카테고리
const CategoryWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px 0px;
  padding-bottom: 25px;
  margin: 10px;
`;

// 제품 없음 & 서버 오류
const MsgBox = styled.div`
  width: 100%;
  margin: 100px 0px;
`;

const Message = styled.div`
  text-align: center;
  font-size: 18px;
  color: #999;
`;

export default Bakery;
