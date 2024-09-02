import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import YellowBtn from "./YellowBtn";
import LogoIcon from "../assets/logoIcon.svg";

const Result = ({ resetTest }) => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchResultData = () => {
      axios
        .get(`http://52.78.180.44:8080/test/result/${resultId}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setResult(response.data);

          const localResultId = localStorage.getItem("result_id");
          if (localResultId !== resultId) {
            localStorage.setItem("result_id", resultId);
          }

          const breads = response.data.breads;

          let firstRecommendation = null;
          let secondRecommendation = null;

          if (resultId === "1") {
            const randomBreads = breads
              .sort(() => 0.5 - Math.random())
              .slice(0, 2);
            firstRecommendation = randomBreads[0];
            secondRecommendation = randomBreads[1];
          } else if (resultId === "2") {
            const mandatoryBread = breads.find((bread) =>
              bread.name.includes("바게트")
            );

            if (mandatoryBread) {
              const otherBreads = breads.filter(
                (bread) => bread.name !== mandatoryBread.name
              );

              const randomBread =
                otherBreads[Math.floor(Math.random() * otherBreads.length)];

              firstRecommendation = mandatoryBread;
              secondRecommendation = randomBread;
            }
          } else if (resultId === "3") {
            const mandatoryBreads = breads.filter(
              (bread) =>
                bread.name.includes("초콜렛") || bread.name.includes("케이크")
            );

            if (mandatoryBreads.length > 0) {
              firstRecommendation =
                mandatoryBreads[
                  Math.floor(Math.random() * mandatoryBreads.length)
                ];

              const remainingMandatoryBread = mandatoryBreads.find(
                (bread) => bread.name !== firstRecommendation.name
              );

              const otherBreads = breads.filter(
                (bread) =>
                  !(
                    bread.name.includes("초콜렛") ||
                    bread.name.includes("케이크")
                  )
              );

              const candidates = [
                ...otherBreads,
                remainingMandatoryBread,
              ].filter(Boolean); // Filter out undefined

              if (candidates.length > 0) {
                secondRecommendation =
                  candidates[Math.floor(Math.random() * candidates.length)];
              }
            }
          } else if (resultId === "4") {
            const mandatoryBreads = breads.filter((bread) =>
              bread.name.includes("베이글")
            );

            if (mandatoryBreads.length > 0) {
              firstRecommendation =
                mandatoryBreads[
                  Math.floor(Math.random() * mandatoryBreads.length)
                ];

              const remainingMandatoryBread = mandatoryBreads.find(
                (bread) => bread.name !== firstRecommendation.name
              );

              const otherBreads = breads.filter(
                (bread) => !bread.name.includes("베이글")
              );

              const candidates = [
                ...otherBreads,
                remainingMandatoryBread,
              ].filter(Boolean); // Filter out undefined

              if (candidates.length > 0) {
                secondRecommendation =
                  candidates[Math.floor(Math.random() * candidates.length)];
              }
            }
          }

          // Set recommendations only if both are defined
          if (firstRecommendation && secondRecommendation) {
            setRecommendedProducts([firstRecommendation, secondRecommendation]);
          }
        })
        .catch((error) => {
          console.error("결과를 가져오는 중 오류 발생:", error);
        });
    };

    fetchResultData();
  }, [resultId]);

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <ResultWrap>
      <TitleBox>
        <Styledh1>{result.title}</Styledh1>
      </TitleBox>
      <TypeImgBox>
        <TypeImg src={result.image} alt="result" />
      </TypeImgBox>
      <TypeTextBox>
        <Text>
          {result.description1}
          <br /> <br />
          {result.description2}
          <br /> <br />
          {result.description3}
        </Text>
      </TypeTextBox>
      <RecommendTitle>
        <BngImg src={LogoIcon} alt="logo" />
        빵긋빵굿의 추천빵
        <BngImg src={LogoIcon} alt="logo" />
      </RecommendTitle>
      <TypeProductWrap>
        {recommendedProducts.map((item, index) => {
          return (
            item && (
              <StyledLink to={`/bakery/product/${item.id}`} key={index}>
                <ProductBox>
                  <ProductImg src={item.img_src} alt={item.name} />
                  <ProductText>
                    <Titles>{item.name}</Titles>
                    <Keywords>
                      {item.tags.split(",").map((tag, idx) => (
                        <Tag key={idx}>{tag.trim()}</Tag>
                      ))}
                    </Keywords>
                  </ProductText>
                </ProductBox>
              </StyledLink>
            )
          );
        })}
      </TypeProductWrap>
      <ButtonWrap>
        <YellowBtn
          width={"338px"}
          txt="빵 유형 테스트 다시 하기"
          onBtnClick={resetTest}
        />
        <YellowBtn
          width={"338px"}
          txt="메인화면으로 이동하기"
          backgroundColor={"white"}
          border={"1px solid #471D06"}
          onBtnClick={() => navigate("/bakery")}
        />
      </ButtonWrap>
    </ResultWrap>
  );
};

export default Result;

// 스타일 정의

// 스타일 정의
const ResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const Styledh1 = styled.p`
  font-family: "Noto Sans KR";
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #311505;
  margin: 0px;
`;

const TypeImgBox = styled.div`
  padding: 45px;
  display: flex;
  justify-content: center;
`;

const TypeImg = styled.img`
  width: 181px;
  height: auto;
`;

const TypeTextBox = styled.div`
  background-color: #ffecc4;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 80%;
  height: auto;
  border-radius: 10px;
  margin: 0;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.25);
  padding: 20px 10px;
`;

const Text = styled.div`
  font-size: 17px;
  letter-spacing: -0.41px;
  font-family: "Noto Sans KR";
  font-weight: regular;
  width: 80%;
  height: auto;
  box-sizing: border-box;
  word-break: keep-all;
  margin: auto;
  color: #311505;
`;

const RecommendTitle = styled.div`
  font-size: 19px;
  letter-spacing: 1px;
  font-family: "Noto Sans KR";
  font-weight: Bold;
  width: 100%;
  display: flex;
  justify-content: center;
  color: #311505;
  margin-top: 54px;
  margin-bottom: 30px;
`;

const BngImg = styled.img`
  width: 28px;
  height: 25px;
  margin: 0px 5px;
`;

const TypeProductWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 85%;
  margin-bottom: 50px;
`;

const ProductBox = styled.div`
  display: flex;
  align-items: center;
`;

const ProductImg = styled.img`
  width: 96px;
  height: auto;
  margin-right: 20px;
  border-radius: 10px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.25);
`;

const ProductText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Titles = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: var(--brown);
  margin: 0;
  letter-spacing: -0.5px;
`;

const Keywords = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: flex-start;
`;

const Tag = styled.span`
  font-size: 12px;
  color: #ffb415;
  font-weight: bold;
  letter-spacing: -0.5px;
  margin-left: 3px;
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  align-items: center;
  margin-bottom: 100px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;
