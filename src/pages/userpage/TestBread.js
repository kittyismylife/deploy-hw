import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Question from "../../components/Question.jsx";
import Result from "../../components/Result.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import axios from "axios";

const TestBread = () => {
  // 점수, 질문, 현재 페이지 관리
  const [scores, setScores] = useState({ F: 0, T: 0, P: 0, J: 0 });
  const [questions, setQuestions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // 주어진 페이지에 대한 질문을 로드하는 함수
  const loadQuestions = (page) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 존재하지 않습니다.");
      return;
    }

    console.log(`Fetching questions for page: ${page}`);

    axios
      .get(`http://52.78.180.44:8080/test/questions/${page}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        console.log("서버로부터 받은 데이터:", response.data);
        // 질문 상태를 현재 페이지 번호에 맞게 업데이트
        setQuestions((prevQuestions) => ({
          ...prevQuestions,
          [page]: {
            q: response.data.question,
            a: response.data.choices,
          },
        }));
      })
      .catch((error) => {
        console.error(
          "질문을 가져오는 중 오류 발생:",
          error.response ? error.response.data : error.message
        );
      });
  };

  // currentPage가 변경될 때마다 질문 로드
  useEffect(() => {
    console.log(`Current page: ${currentPage}`);
    loadQuestions(currentPage);
  }, [currentPage]);

  // 점수를 바탕으로 결과 문자열을 생성
  const getResultString = (scores) => {
    const resultArray = [];
    if (scores.F >= scores.T) resultArray.push("F");
    else resultArray.push("T");
    if (scores.P >= scores.J) resultArray.push("P");
    else resultArray.push("J");
    return resultArray.join("");
  };

  // 선택된 옵션에 따라 점수를 업데이트하고 다음 페이지로 이동하는 함수
  const handleOptionClick = (type, page) => {
    console.log(`Option clicked: ${type}`);

    setScores((prevScores) => {
      const updatedScores = { ...prevScores, [type]: prevScores[type] + 1 };
      const nextPage = page + 1; // 다음 페이지 번호 계산

      console.log("Updated Scores:", updatedScores);
      console.log("Total Scores:");
      console.log(`F: ${updatedScores.F}`);
      console.log(`T: ${updatedScores.T}`);
      console.log(`P: ${updatedScores.P}`);
      console.log(`J: ${updatedScores.J}`);

      if (nextPage <= 6) {
        setCurrentPage(nextPage);
        navigate(`/test/questions/${nextPage}`);
      } else {
        // 결과 페이지로 이동하기 전에 결과를 제출
        const resultString = getResultString(updatedScores);
        submitResult(resultString);
      }
      return updatedScores;
    });
  };

  // 테스트 결과를 서버에 제출하고 결과 페이지로 이동하는 함수
  const submitResult = (resultString) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://52.78.180.44:8080/test/submit",
        { result: resultString },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("테스트 결과 전송 완료:", response.data);
        navigate(`/test/result/${response.data.result_id}`); // 결과 페이지로 이동
      })
      .catch((error) => {
        console.error(
          "테스트 결과 전송 중 오류 발생:",
          error.response ? error.response.data : error.message
        );
      });
  };

  // 테스트를 초기화하고 첫 번째 페이지로 이동하는 함수
  const resetTest = () => {
    setScores({ F: 0, T: 0, P: 0, J: 0 });
    setCurrentPage(1);
    navigate(`/test/questions/1`);
  };

  return (
    <Routes>
      <Route
        path="questions/:page"
        element={
          <QuestionPage
            questions={questions}
            handleOptionClick={handleOptionClick}
          />
        }
      />
      <Route
        path="result/:resultId"
        element={<Result resetTest={resetTest} />}
      />
      <Route path="/" element={<Navigate to="/test/questions/1" />} />
    </Routes>
  );
};

// QuestionPage 컴포넌트 정의
const QuestionPage = ({ questions, handleOptionClick }) => {
  const { page } = useParams();
  const navigate = useNavigate();
  const pageNumber = parseInt(page, 10);

  useEffect(() => {
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 6) {
      console.warn(`Invalid pageNumber: ${pageNumber}`);
      navigate("/test/questions/1");
    }
  }, [pageNumber, navigate]);

  const currentQuestion = questions[pageNumber];
  if (!currentQuestion) {
    console.warn("질문 데이터가 비어 있습니다.");
    return null;
  }

  return (
    <div>
      <ProgressBar current={pageNumber} total={6} />
      <Question
        q={currentQuestion.q}
        a={currentQuestion.a}
        onOptionClick={(type) => handleOptionClick(type, pageNumber)}
      />
    </div>
  );
};

export default TestBread;
