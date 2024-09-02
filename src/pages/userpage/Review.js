import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import profile from "./bread.png";
import altIcon from "../../assets/alt.png";

const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://52.78.180.44:8080/users/reviews", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) =>
        console.error("데이터를 가져오는 중 오류 발생:", error)
      );
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("정말로 이 리뷰를 삭제하시겠습니까?");

    if (confirmed) {
      axios
        .delete(`http://52.78.180.44:8080/users/reviews/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== id)
          );
        })
        .catch((error) => {
          console.error("데이터 삭제 중 오류:", error.message);
          if (error.response) {
            console.error("응답 데이터:", error.response.data);
            console.error("응답 상태:", error.response.status);
            console.error("응답 헤더:", error.response.headers);
          }
        });
    }
  };

  return (
    <OrderList>
      <OrderListTitle>MY 리뷰</OrderListTitle>
      {reviews.length > 0 ? (
        reviews.map((review, index) => {
          const product = review.order_item.product;

          return (
            <div key={review.id}>
              <ProductCard>
                <ProductShow>
                  <ProductImage
                    src={product?.img_src || profile} // product 객체를 사용
                    alt={product?.name || "Product"}
                  />
                  <ProductInfo>
                    <ProductName>
                      {product?.name || "Unknown Product"}
                    </ProductName>
                    <ProductTags>
                      {product?.tags
                        ? product.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .join(" ")
                        : "No Tags"}
                    </ProductTags>
                  </ProductInfo>
                  <DeleteButton
                    onClick={() => handleDelete(review.id)}
                    aria-label="Delete review"
                  >
                    <FaTrash />
                  </DeleteButton>
                </ProductShow>
                <InfoContainer>
                  <ProductLikeShow>
                    {review.satisfaction === "S" ? "만족해요" : "별로예요"}
                  </ProductLikeShow>
                  <ProductDateShow>
                    {new Date(review.created_at).toLocaleDateString()}
                  </ProductDateShow>
                </InfoContainer>
                <ReviewText>{review.content}</ReviewText>
              </ProductCard>
              {index < reviews.length - 1 && <Divider />}
            </div>
          );
        })
      ) : (
        <NoRecipesMessage>
          <img src={altIcon} alt="No reviews icon" />
          <p>작성된 리뷰가 존재하지 않습니다.</p>
        </NoRecipesMessage>
      )}
    </OrderList>
  );
};

export default Review;

// Styled Components 정의

const OrderList = styled.div``;

const OrderListTitle = styled.div`
  width: auto;
  font-weight: 700;
  font-size: 20px;
  margin: 20px 0 0 20px;
`;

const ProductCard = styled.div`
  margin: 25px 25px;
  display: flex;
  width: auto;
  flex-direction: column;
`;

const ProductShow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const ProductImage = styled.img`
  border-radius: 10px;
  width: 65px;
  height: 65px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
`;

const ProductTags = styled.div`
  color: #ffb415;
  font-weight: 700;
  font-size: 10px;
  margin-top: 4px;
  margin-bottom: 6px;
`;

const ProductInfo = styled.div`
  padding: 0;
  margin: 0 13px;
  flex: 1;
  margin-left: 15px;
`;

const DeleteButton = styled.button`
  font-size: 15px;
  color: #8a8888;
  background-color: white;
  border: 0;
  height: 35px;
  cursor: pointer;
`;

const ReviewText = styled.div`
  font-size: 11px;
  letter-spacing: 1%;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const ProductLikeShow = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1%;
`;

const ProductDateShow = styled.div`
  color: #979797;
  font-family: Inter;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1%;
`;

const Divider = styled.div`
  width: 100vw;
  border-bottom: 1px solid #d9d9d9;
  height: 1px;
  box-shadow: 0px 2px 4px 0px rgba(217, 217, 217, 0.5);
`;

const NoRecipesMessage = styled.div`
  text-align: center;
  margin-top: 100px;

  img {
    width: 40px;
    height: 40px;
  }

  p {
    margin-top: 10px;
    font-size: 14px;
    opacity: 50%;
  }
`;

const ProductName = styled.div`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 5px;
  letter-spacing: -0.5px;
  color: #471d06;
`;
