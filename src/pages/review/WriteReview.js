import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const WriteReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (location.state && location.state.product && location.state.item) {
      setProduct(location.state.product);
      setItem(location.state.item);
    } else {
      console.error("No product or item data available");
      navigate("/bakery");
    }
  }, [location.state, navigate]);

  const [selectedButton, setSelectedButton] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    if (!selectedButton || !reviewText) {
      alert("모든 양식을 채워주세요.");
      return;
    }

    if (!item) {
      console.error("No item data available");
      alert("Item data is missing.");
      return;
    }

    const reviewData = {
      content: reviewText,
      satisfaction: selectedButton === "like" ? "S" : "D",
      order_item_id: item.id,
    };

    const token = localStorage.getItem("token");

    axios
      .post("http://52.78.180.44:8080/users/reviews/", reviewData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        alert("리뷰가 작성되었습니다.");
        navigate("/users/orders");
      })
      .catch((error) => {
        console.error("There was an error submitting your review:", error);
        alert("리뷰 제출에 실패했습니다. 다시 시도해 주세요.");
      });
  };

  if (!product || !item) return null;

  const productTags =
    typeof product.tags === "string"
      ? product.tags.split(",").map((tag) => tag.trim())
      : product.tags;

  return (
    <WriteReviewContainer>
      <OrderListTitle>리뷰쓰기</OrderListTitle>
      <ProductInfo>
        <ProductShow>
          <ProductImage src={product.img_src} alt={product.name} />
          <ProductDetails>
            <ProductName>{product.name}</ProductName>
            <ProductTags>{productTags.join(" ")}</ProductTags>
          </ProductDetails>
        </ProductShow>
      </ProductInfo>
      <StyledHr />
      <OrderListLike>구매하신 빵은 만족하셨나요?</OrderListLike>
      <ProductActions>
        <ShowButton
          className={selectedButton === "dislike" ? "selected" : ""}
          onClick={() => setSelectedButton("dislike")}
        >
          별로예요 👎🏻
        </ShowButton>
        <ShowButton
          className={selectedButton === "like" ? "selected" : ""}
          onClick={() => setSelectedButton("like")}
        >
          만족해요 👍🏻
        </ShowButton>
      </ProductActions>
      <OrderListLike>자세한 리뷰를 작성해 주세요</OrderListLike>
      <ReviewTextarea
        rows="9"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <SubmitButtonContainer>
        <SubmitButton onClick={handleSubmit}>리뷰 등록하기</SubmitButton>
      </SubmitButtonContainer>
    </WriteReviewContainer>
  );
};

export default WriteReview;

// Styled Components 정의

const WriteReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  margin: 0px;
`;

const OrderListTitle = styled.div`
  width: 80%;
  font-weight: 700;
  line-height: 22px;
  font-size: 18px;
  margin: 20px 20px 20px 20px;
  letter-spacing: -0.5px;
`;

const ProductInfo = styled.div`
  width: 90%;
  height: auto;
  align-items: center;
`;

const ProductShow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px 25px;
`;

const ProductImage = styled.img`
  border-radius: 10px;
  width: 90px;
  height: 90px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px;
  margin-bottom: px;
  justify-content: center;
`;

const ProductName = styled.h3`
  color: #471d06;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0 0 5px 0;
`;

const ProductTags = styled.div`
  color: #ffb415;
  font-weight: 700;
  font-size: 11px;
`;

const StyledHr = styled.hr`
  margin-top: 25px;
  margin-bottom: 25px;
  border: 0.5px solid #ccc;
  width: 100%;
  background-color: #d9d9d9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const OrderListLike = styled.div`
  color: #471d06;
  width: 80%;
  font-weight: bold;
  font-size: 16px;
  margin: 0px 20px 15px 0;
  font-family: "Noto Sans KR";
`;

const ProductActions = styled.div`
  margin: 0 18px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
`;

const ShowButton = styled.button`
  flex: 1;
  background-color: white;
  border: 1px solid #471d06;
  width: 150px;
  padding: 9px 0;
  margin: 0 15px;
  color: #471d06;
  font-size: 14px;
  font-weight: 700;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;

  &.selected {
    background-color: #ffde97;
    color: #77300a;
  }
`;

const ReviewTextarea = styled.textarea`
  display: block;
  border: 1px solid #471d06;
  border-radius: 8px;
  margin: 0 auto 20px auto;
  width: 80%;
  padding: 10px;
  font-size: 16px;

  &:focus {
    border: 1px solid #ffb415;
    outline: none;
  }
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px 0 40px 0;
`;

const SubmitButton = styled.button`
  width: 85%;
  background-color: #ffc851;
  border: 0;
  padding: 8px 10px;
  margin: 0 10px;
  color: #471d06;
  font-size: 16px;
  font-weight: 800;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffb415;
  }
`;
