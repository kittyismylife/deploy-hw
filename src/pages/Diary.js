import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "../styles/Diary.css";
import Bread from "../assets/bread_stamp.png";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";

// 요일을 한글로 변환하는 함수
const getWeekday = (day) => {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `(${weekdays[day]})`;
};

// 날짜를 '년 월 일 (요일)' 형식으로 포맷팅하는 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = getWeekday(date.getDay());
  return `${year}년 ${month}월 ${day}일 ${weekday}`;
};

// 날짜를 'YYYY-MM-DD' 형식으로 포맷팅하는 함수
const formatDateForSave = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 달력 타일의 클래스 이름을 설정하는 함수
const tileClassName = ({ date, view, activeStartDate, reviews }) => {
  if (view === "month") {
    const currentMonth = activeStartDate.getMonth();
    const currentYear = activeStartDate.getFullYear();
    const isCurrentMonth =
      date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    const isSaturday = date.getDay() === 6;
    const isSunday = date.getDay() === 0;

    const dateKey = formatDateForSave(date);
    const hasReview = reviews[dateKey] && reviews[dateKey].length > 0;

    if (!isCurrentMonth) {
      return "not-current-month-tile";
    }

    if (isSaturday) {
      return hasReview ? "saturday-tile with-review" : "saturday-tile";
    }

    if (isSunday) {
      return hasReview ? "sunday-tile with-review" : "sunday-tile";
    }

    return hasReview ? "calendar-tile with-review" : "calendar-tile";
  }
  return null;
};

// 달력 타일의 내용을 설정하는 함수
const tileContent = ({ date, view, reviews }) => {
  if (view === "month") {
    const dateKey = formatDateForSave(date);

    if (reviews[dateKey] && reviews[dateKey].length > 0) {
      return (
        <div className="calendar-date">
          <img src={Bread} alt="Bread" className="bread-icon" />
        </div>
      );
    } else {
      return <div className="calendar-date">{date.getDate()}</div>;
    }
  }
  return null;
};

// 연도와 월을 선택할 수 있는 컴포넌트
const YearMonthPicker = ({ selectedDate, updateDate }) => {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  return (
    <div className="year-month-picker">
      <select
        className="select-date"
        value={currentYear}
        onChange={(e) => updateDate(parseInt(e.target.value), currentMonth)}
      >
        {[...Array(10)].map((_, i) => (
          <option key={2022 + i} value={2022 + i}>
            {2022 + i}
          </option>
        ))}
      </select>
      <select
        className="select-date"
        value={currentMonth}
        onChange={(e) => updateDate(currentYear, parseInt(e.target.value))}
      >
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i}>
            {i + 1}월
          </option>
        ))}
      </select>
    </div>
  );
};

const Diary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [reviews, setReviews] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 모든 리뷰를 가져오는 함수
  const fetchAllReviews = () => {
    setIsLoading(true);
    setError(null);

    axios
      .get("http://52.78.180.44:8080/diary/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        if (typeof data === "object" && data !== null) {
          const reviewsMap = data.reduce((acc, review) => {
            const dateKey = formatDateForSave(new Date(review.date));
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(review);
            return acc;
          }, {});
          setReviews(reviewsMap);
        } else {
          console.error(
            "Fetched data is not in the expected object format:",
            data
          );
        }
      })
      .catch((error) => {
        setError("Error fetching reviews.");
        console.error("Error fetching reviews:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAllReviews();
  }, [token]);

  // 날짜를 변경하는 함수
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setActiveStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
    console.log("선택된 날짜:", formatDate(date));
  };

  // '오늘' 버튼 클릭 시 오늘 날짜로 설정하는 함수
  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // 새 기록 추가 버튼 클릭 시 기록 추가 페이지로 이동하는 함수
  const handleAddRecord = () => {
    const formattedDate = formatDateForSave(selectedDate);
    navigate(`/record/write/${formattedDate}`);
  };

  // 연도와 월을 업데이트하는 함수
  const updateDate = (year, month) => {
    const newDate = new Date(year, month, 1);
    setActiveStartDate(newDate);
    setSelectedDate(newDate);
  };

  // 선택된 날짜의 리뷰 목록
  const selectedDateKey = formatDateForSave(selectedDate);
  const reviewList = reviews[selectedDateKey] || [];

  // 리뷰 삭제 함수
  const handleDeleteReview = (id) => {
    setIsLoading(true);
    setError(null);

    axios
      .delete(`http://52.78.180.44:8080/diary/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          fetchAllReviews(); // 리뷰 삭제 후 전체 리뷰를 다시 가져오기
        } else {
          console.error(
            "Failed to delete review. Status code:",
            response.status
          );
        }
      })
      .catch((error) => {
        setError("Error deleting review.");
        console.error("Error deleting review:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEditReview = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <>
      <div className="selection-container">
        <YearMonthPicker selectedDate={selectedDate} updateDate={updateDate} />
        <button onClick={handleTodayClick} className="today-button">
          오늘
        </button>
      </div>
      <div className="diary-container">
        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={(props) =>
            tileClassName({ ...props, activeStartDate, reviews })
          }
          tileContent={(props) => tileContent({ ...props, reviews })}
          activeStartDate={activeStartDate}
        />
        {selectedDate && (
          <div className="date-container">
            <div className="selected-date">{formatDate(selectedDate)}</div>
            <button onClick={handleAddRecord} className="add-record-button">
              ➕ &nbsp;먹은 빵 추가하기
            </button>
            {reviewList.length > 0 && (
              <div className="review-container">
                {reviewList.map((review) => {
                  const tags = Array.isArray(review.tags) ? review.tags : [];
                  const tagsString = tags.join(", ");

                  return (
                    <div key={review.id} className="review-item">
                      <img src={Bread} className="review-stamp-image" />
                      <hr className="vertical-line" />
                      <div className="review-content">
                        <div className="bread-title">
                          [{review.bakery_name}] {review.bread_name}
                        </div>
                        <div className="review-tag">{tagsString}</div>
                        <div className="review-text">{review.review}</div>
                        <div className="show-images">
                          {[
                            review.img_src1,
                            review.img_src2,
                            review.img_src3,
                          ].map((src, index) =>
                            src ? (
                              <img
                                key={index}
                                src={src}
                                className="review-show-image"
                                alt={`Review image ${index + 1}`}
                              />
                            ) : null
                          )}
                        </div>
                      </div>
                      {/* 버튼 관련 */}
                      <div className="button-div">
                        <button
                          onClick={() => handleEditReview(review.id)}
                          className="diary-edit-button"
                        >
                          <img src={editIcon} alt="Edit" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="diary-delete-button"
                        >
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Diary;
