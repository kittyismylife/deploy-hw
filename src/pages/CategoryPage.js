import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Product from "../components/Product";
import Warning from "../assets/warning.png";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    console.log(`Fetching products for category: ${categoryName}`);
    const token = localStorage.getItem("token");

    axios
      .get(`http://52.78.180.44:8080/bakery/category/${categoryName}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        console.log("Fetched products:", response.data);
        setProducts(response.data);
        setStatus("success");
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
        setStatus("error");
      });
  }, [categoryName]);

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

  if (products.length === 0) {
    return (
      <MsgBox>
        <WarningImg src={Warning} />
        <Message>
          해당 카테고리의 빵이 없습니다. <br />
          다른 카테고리를 눌러보세요.
        </Message>
      </MsgBox>
    );
  }

  return (
    <ProductWrap>
      {products.map((product) => (
        <StyledLink to={`/bakery/product/${product.id}`} key={product.id}>
          <Product
            imgSrc={product.img_src}
            tags={product.tags}
            name={product.name}
            price={product.price}
          />
        </StyledLink>
      ))}
    </ProductWrap>
  );
};

//
// 스타일
//

// 링크 제거
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

// 카테고리 없음 페이지
const MsgBox = styled.div`
  width: 100%;
  margin: 30px 0px;
  text-align: center;
`;

const Message = styled.div`
  text-align: center;
  font-size: 14px;
  color: #979797;
  font-family: "Noto Sans KR";
  font-weight: medium;
  padding-bottom: 10px;
`;

const WarningImg = styled.img`
  width: 54px;
  height: auto;
  margin-bottom: 15px;
`;

// 제품 스타일
const ProductWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
`;

export default CategoryPage;
