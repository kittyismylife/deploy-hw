import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Product = ({ id, imgSrc, tags, name, price, description }) => {
  const location = useLocation();
  const isCartPage = location.pathname.startsWith("/cart");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  // tags 문자열을 배열로 변환 (쉼표로 구분된 경우)
  const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

  return (
    <ProductBox>
      <ProductImgBox>
        <ProductImg src={imgSrc} />
      </ProductImgBox>
      <ProductText>
        <Keywords>
          {tagsArray.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Keywords>
        <Titles>{name}</Titles> {/* title을 name으로 변경 */}
        {!isCartPage && <Prices>{formatPrice(price)}원</Prices>}{" "}
        {/* /cart 경로가 아닐 때만 가격 표시 */}
      </ProductText>
    </ProductBox>
  );
};

export default Product;

const ProductBox = styled.div`
  margin-bottom: 20px;
  overflow: hidden;
`;

const ProductImgBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ProductImg = styled.img`
  width: 100%;
  align-items: center;
  margin: 0;
  border-radius: 10px;
  box-shadow: 0px 1px 3px 0px rgba(0217, 217, 217, 0.25);
`;

const ProductText = styled.div`
  align-items: center;
  margin: 0;
  padding-left: 5px;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  margin: 5px 0px;
`;

const Tag = styled.span`
  color: var(--yellow);
  font-weight: 800;
  font-size: 9px;
  letter-spacing: -0.5px;
`;

const Titles = styled.p`
  color: var(--brown);
  font-size: 12px;
  font-weight: 800;
  margin: 0;
  margin-top: 4px;
  letter-spacing: -0.5px;
`;

const Prices = styled.p`
  font-size: 14px;
  font-weight: 800;
  color: var(--brown);
  margin: 0;
  margin-top: 5px;
  letter-spacing: -0.5px;
`;
