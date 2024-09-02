import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import profile from "./bread.png";
import axios from "axios";

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch orders
    axios
      .get("http://52.78.180.44:8080/users/orders", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        console.log("Received orders:", response.data);

        // Sort orders by date in descending order (most recent first)
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setOrders(sortedOrders);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Fetch reviews
    axios
      .get("http://52.78.180.44:8080/users/reviews", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        console.log("Received reviews:", response.data);
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const handleReviewClick = (item) => {
    navigate(`/users/reviews/${item.product.id}`, {
      state: { product: item.product, item },
    });
  };

  const handleAddToCartClick = (id) => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `http://52.78.180.44:8080/bakery/${id}/add-to-cart/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then(() => {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 4000);

        const cartEvent = new CustomEvent("cartUpdated", { detail: 1 });
        window.dispatchEvent(cartEvent);
      })
      .catch((error) => {
        console.error("Failed to add product to cart", error);
      });
  };

  let lastOrderDate = "";

  return (
    <OrderListContainer>
      <OrderListTitle>주문목록</OrderListTitle>
      {orders.length === 0 ? (
        <NoOrdersMessage>주문이 없습니다.</NoOrdersMessage>
      ) : (
        orders.map((order) => {
          const orderDate = new Date(order.created_at).toLocaleDateString();
          const showDate = lastOrderDate !== orderDate;
          lastOrderDate = orderDate;

          return (
            <OrderCard key={order.id}>
              {showDate && <OrderDate>{orderDate}</OrderDate>}
              <OrderItems>
                {(order.items || []).map((item) => {
                  const product = item.product;
                  // Review 존재 확인
                  const hasReview = reviews.some(
                    (review) => review.order_item.id === item.id
                  );

                  // 디버깅 로그
                  console.log("Processing item:", item);
                  console.log("Order Item ID:", item.id);
                  console.log("Review exists:", hasReview);

                  return (
                    <ProductCard key={item.id}>
                      <ProductShow>
                        <ProductImage
                          src={product.img_src || profile}
                          alt={product.name || "Product"}
                        />
                        <ProductInfo>
                          <ProductName>
                            {product.name || "Unknown Product"}
                          </ProductName>
                          <ProductTags>
                            {product.tags
                              ? product.tags.split(",").join(" ")
                              : "No Tags"}
                          </ProductTags>
                          <QuantityPrice>
                            <ProductQuantity>{item.quantity}개</ProductQuantity>
                            <ProductLine>&#124;</ProductLine>
                            <ProductPrice>
                              {(
                                parseFloat(item.price) * item.quantity
                              ).toLocaleString()}
                              원
                            </ProductPrice>
                          </QuantityPrice>
                        </ProductInfo>
                      </ProductShow>
                      <ProductActions>
                        {!hasReview && (
                          <WriteReviewButton
                            onClick={() => handleReviewClick(item)}
                          >
                            리뷰쓰기
                          </WriteReviewButton>
                        )}
                        <AddButton
                          onClick={() => handleAddToCartClick(product.id)}
                        >
                          같은 빵 담기
                        </AddButton>
                      </ProductActions>
                    </ProductCard>
                  );
                })}
              </OrderItems>
            </OrderCard>
          );
        })
      )}

      {showPopup && (
        <PopWrap showPopup={showPopup}>
          <CartPop>
            <PopText>장바구니에 상품을 담았어요</PopText>
            <GoBtn onClick={() => navigate("/cart")}>바로가기 &gt;</GoBtn>
          </CartPop>
        </PopWrap>
      )}
    </OrderListContainer>
  );
};

export default OrderList;

// Styled Components 정의

const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 150px;
`;

const OrderListTitle = styled.div`
  width: 80%;
  font-weight: 700;
  font-size: 20px;
  margin-top: 20px;
`;

const NoOrdersMessage = styled.div`
  font-size: 16px;
  color: #555;
`;

const OrderCard = styled.div`
  display: flex;
  width: 80%;
  flex-direction: column;
`;

const OrderDate = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 13px;
  font-weight: 900;
  margin: 22px 0 15px 0;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductCard = styled.div`
  padding: 20px 15px 0 15px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
`;

const ProductShow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProductImage = styled.img`
  border-radius: 10px;
  width: 89px;
  height: 89px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.25);
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 15px;
`;

const ProductName = styled.div`
  color: #471d06;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 5px;
`;

const ProductTags = styled.div`
  color: #ffb415;
  font-weight: 700;
  font-size: 11px;
`;

const QuantityPrice = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

const ProductPrice = styled.div`
  color: #471d06;
  font-size: 16px;
  letter-spacing: -0.5px;
  line-height: 22px;
  font-weight: 800;
  margin-bottom: 2px;
`;

const ProductLine = styled.div`
  color: #471d06;
  margin-right: 10px;
  margin-top: -2px;
  font-weight: 400;
  opacity: 30%;
`;

const ProductQuantity = styled.div`
  color: #471d06;
  font-size: 16px;
  font-weight: 800;
  margin-right: 10px;
  letter-spacing: -0.5px;
`;

const ProductActions = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
`;

const WriteReviewButton = styled.button`
  margin: 20px 10px;
  height: 40px;
  flex: 1;
  color: #471d06;
  font-size: 14px;
  letter-spacing: -0.5px;
  font-weight: 800;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.5s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  background-color: white;
  border: 1.5px solid #471d06;

  &:hover {
    color: #ffc851;
    background-color: #471d06;
  }
`;

const AddButton = styled.button`
  margin: 20px 10px;
  height: 40px;
  flex: 1;
  color: #471d06;
  font-size: 14px;
  letter-spacing: -0.5px;
  font-weight: 800;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.5s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: none;
  background-color: #ffc851;

  &:hover {
    color: #ffc851;
    background-color: #773d1e;
  }
`;

// Popup styles

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const PopWrap = styled.div`
  justify-content: center;
  display: flex;
  position: fixed;
  bottom: 5%;
  z-index: 4;
  width: 330px;
  animation: ${(props) =>
    props.showPopup
      ? css`
          ${fadeOut} 4.5s forwards
        `
      : "none"};
`;

const CartPop = styled.div`
  background-color: var(--yellow);
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 46px;
  display: flex;
  padding: 0px 19px;
`;

const PopText = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: var(--brown);
`;

const GoBtn = styled.button`
  font-size: 15px;
  font-weight: 800;
  color: var(--brown);
  border: none;
  background-color: var(--yellow);
  cursor: pointer;
`;
