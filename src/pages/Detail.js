import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";
import ShopIcon from "../assets/shoppingcart.svg";
import Footer from "../components/Footer";
import Warning from "../assets/warning.png";

const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productStatus, setProductStatus] = useState("loading");
  const [showPopup, setShowPopup] = useState(false);
  const [currentImg, setCurrentImg] = useState("img_src");
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch product details and reviews
    axios
      .get(`http://52.78.180.44:8080/bakery/product/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setProduct(response.data);
        setProductStatus("success");
      })
      .catch((error) => {
        console.error("Failed to fetch product details", error);
        setProductStatus("error");
      });
  }, [id]);

  const handleDragStart = (e) => {
    setStartX(e.type.includes("mouse") ? e.pageX : e.touches[0].pageX);
  };

  const handleDragEnd = (e) => {
    const endX = e.type.includes("mouse") ? e.pageX : e.changedTouches[0].pageX;
    if (startX - endX > 50) {
      toggleImage();
    } else if (startX - endX < -50) {
      toggleImage();
    }
  };

  const toggleImage = () => {
    setCurrentImg(currentImg === "img_src" ? "img_dtl" : "img_src");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  // Function to add product to cart
  const handleAddToCart = () => {
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

  if (productStatus === "loading") {
    return <div>Loading....</div>;
  }

  if (productStatus === "error" || !product) {
    return <div>제품 정보를 불러오지 못했습니다.</div>;
  }

  const reviews = product.reviews || [];
  const tagsArray = product.tags
    ? product.tags.split(",").map((tag) => tag.trim())
    : [];

  return (
    <>
      <ImgBox
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onClick={toggleImage}
      >
        <BreadImg
          src={product[currentImg]}
          alt={product.name}
          draggable="false"
        />
        <Dots>
          <Dot active={currentImg === "img_src"} />
          <Dot active={currentImg === "img_dtl"} />
        </Dots>
      </ImgBox>
      <TitleInfo>
        <Title>{product.name}</Title>
        <Price>{formatPrice(product.price)}원</Price>
      </TitleInfo>
      <Section>
        <SectionTitle>웰니스정보</SectionTitle>
        <Tags>
          {tagsArray.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Tags>
        <WellnessInfo>{product.description1 || "정보 없음"}</WellnessInfo>
      </Section>
      <Section>
        <SectionTitle>상품정보</SectionTitle>
        <Info>{product.description2 || "정보 없음"}</Info>
      </Section>
      <Section>
        <SectionTitle>상품구성</SectionTitle>
        <Info>{product.description3 || "정보 없음"}</Info>
      </Section>
      <Section>
        <SectionTitle>리뷰</SectionTitle>
        {reviews.length === 0 ? (
          <MsgBox>
            <WarningImg src={Warning} />
            <Message>아직 리뷰를 굽는 중이에요...🍞</Message>
          </MsgBox>
        ) : (
          reviews.map((review, index) => (
            <ReviewBox key={index}>
              <GoodBad>
                {review.satisfaction === "S" ? "만족해요" : "별로예요"}
              </GoodBad>
              <WriterInfo>
                <Writer>{`${review.user.username.slice(0, 3)}****`}</Writer>{" "}
                <ReviewDate>
                  {new Date(review.created_at).toLocaleDateString()}
                </ReviewDate>
              </WriterInfo>
              <ReviewText>{review.content}</ReviewText>
              {index < reviews.length - 1 && <HrDiv />}
            </ReviewBox>
          ))
        )}
      </Section>
      <CartButton onClick={handleAddToCart}>
        <Icon src={ShopIcon} alt="장바구니 아이콘" />
        <ShopText>장바구니</ShopText>
      </CartButton>
      {showPopup && (
        <PopWrap showPopup={showPopup}>
          <CartPop>
            <PopText>장바구니에 상품을 담았어요</PopText>
            <GoBtn onClick={() => navigate("/cart")}>바로가기 &gt;</GoBtn>
          </CartPop>
        </PopWrap>
      )}
      <Footer />
    </>
  );
};

export default Detail;

// 스타일
// 장바구니 버튼
const CartButton = styled.button`
  position: fixed;
  margin-left: 270px;
  bottom: 5%;
  z-index: 1;
  padding: 10px 10px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  border: var(--brown) 1px solid;
  border-radius: 17px;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 17px;
  margin-bottom: -3px;
  margin-right: 2px;
`;

const ShopText = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: var(--brown);
  display: inline-block;
`;

// 가격&빵이름
const TitleInfo = styled.div`
  box-shadow: 0 2px 4px 0 rgba(217, 217, 217, 0.5);
  border-bottom: 1px solid #d9d9d9;
  padding-left: 25px;
  padding-bottom: 20px;
  margin-bottom: 17px;
`;

const Title = styled.div`
  font-size: 16px;
  color: var(--brown);
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
`;
const Price = styled.div`
  font-size: 22px;
  color: var(--brown);
  font-weight: 800;
  letter-spacing: -0.5px;
`;

// 각 섹션 공통 스타일
const Section = styled.div`
  width: 90%;
  margin-bottom: 25px;
  margin-left: 27px;
`;

const SectionTitle = styled.div`
  font-size: 17px;
  letter-spacing: -0.5px;
  line-height: 22px;
  font-weight: 800;
  margin-bottom: 3px;
  border-bottom: 1.5px solid var(--yellow);
  width: auto;
  color: var(--brown);
  display: inline-block;
`;

//태그 관련
const Tags = styled.div`
  margin-bottom: 4px;
`;

const Tag = styled.div`
  display: inline-block;
  margin-right: 5px;
  color: var(--yellow);
  font-weight: 800;
  letter-spacing: -0.5px;
  font-size: 12px;
`;

//설명칸
const WellnessInfo = styled.div`
  font-size: 14px;
  letter-spacing: -0.5px;
  word-break: keep-all;
`;

const Info = styled.div`
  margin-top: 3px;
  font-size: 14px;
  letter-spacing: -0.5px;
  word-break: keep-all;
`;

//리뷰 섹션
const ReviewBox = styled.div`
  margin-top: 15px;
`;

const GoodBad = styled.div`
  font-size: 15px;
  letter-spacing: 1%;
  font-weight: 800;
`;
const WriterInfo = styled.div`
  color: #979797;
  font-size: 14px;
  letter-spacing: 1%;
  margin-top: 5px;
`;

const Writer = styled.div`
  display: inline-block;
  margin-right: 5px;
`;

const ReviewDate = styled.div`
  display: inline-block;
  margin-left: 5px;
`;

const ReviewText = styled.div`
  font-size: 14px;
  letter-spacing: -0.5px;
  margin-top: 5px;
  word-break: keep-all;
`;

const HrDiv = styled.div`
  margin-top: 15px;
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  box-shadow: 0 2px 4px 0 rgba(217, 217, 217, 0.5);
`;

// 팝업 애니메이션 정의
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

// 팝업
const CartPop = styled.div`
  background-color: var(--yellow);
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  width: 90%; // 모바일 디바이스에 더 나은 반응형 디자인 제공
  max-width: 300px; // 최대 너비 설정으로 큰 화면에서는 고정 너비를 제공
  height: 46px;
  display: flex;
  padding: 0px 19px;
`;

const PopWrap = styled.div`
  position: fixed;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%); // 수평으로 정확히 중앙에 위치
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  width: 330px;
  animation: ${(props) =>
    props.showPopup
      ? css`
          ${fadeOut} 4.5s forwards
        `
      : "none"};
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

const MsgBox = styled.div`
  width: 100%;
  text-align: center;
  margin: 70px 0px;
`;

const Message = styled.div`
  text-align: center;
  font-size: 18px;
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

// 이미지 섹션
const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  margin-bottom: 20px;
  position: relative; // 상위 요소를 relative로 설정
  cursor: pointer;
`;

const BreadImg = styled.img`
  width: 90%;
  border-radius: 30px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.25);
`;

const Dots = styled.div`
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%) translateY(50%); // 중앙 하단 정렬
  display: flex;
`;

const Dot = styled.div`
  height: 9px;
  width: 9px;
  margin: 3px 4px 0px 4px;
  background-color: white;
  opacity: ${({ active }) =>
    active ? "1" : "0.5"}; // active 상태에 따라 투명도 조절
  border-radius: 50%;
  transition: opacity 0.3s;
`;
