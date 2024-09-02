import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/RecipeDetail.css";
import init_image from "./init_recipe_image.png";
import timerIcon from "../../assets/timer.png";
import toolIcon from "../../assets/tool.png";
import savedIcon from "../../assets/saved-icon.png";
import unsavedIcon from "../../assets/unsaved-icon.png";
import editIcon from "../../assets/edit-icon.png";
import deleteIcon from "../../assets/delete-icon.png";

const handleError = (error) => {
  if (error.response) {
    console.error(
      "Error:",
      error.response.data,
      "Status:",
      error.response.status
    );
  } else if (error.request) {
    console.error("Error: No response received");
  } else {
    console.error("Error:", error.message);
  }
};

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [isScrapped, setIsScrapped] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // fetchRecipe 함수 정의
    const fetchRecipe = () => {
      axios
        .get(`http://52.78.180.44:8080/recipes/${id}`, {
          headers: {
            Authorization: `Token ${storedToken}`,
          },
        })
        .then((recipeResponse) => {
          const recipeData = recipeResponse.data;
          setRecipe(recipeData);

          return axios.get(
            `http://52.78.180.44:8080/users/saved-recipes/${id}`,
            {
              headers: {
                Authorization: `Token ${storedToken}`,
              },
            }
          );
        })
        .then((savedResponse) => {
          setIsScrapped(savedResponse.data.is_scrapped);
        })
        .catch((fetchError) => {
          handleError(fetchError);
          setError(fetchError);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchRecipe();
  }, [id, token]);

  const handleToggleSave = (recipeId) => {
    const url = `http://52.78.180.44:8080/users/saved-recipes/${recipeId}`;
    const headers = { Authorization: `Token ${token}` };

    if (isScrapped) {
      // 이미 스크랩된 상태에서 삭제 요청
      axios
        .delete(url, { headers })
        .then(() => {
          setIsScrapped(false); // 상태 업데이트
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      // 스크랩되지 않은 상태에서 추가 요청
      axios
        .post(url, {}, { headers })
        .then(() => {
          setIsScrapped(true); // 상태 업데이트
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };

  const handleDeleteRecipe = (recipeId) => {
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    axios
      .delete(`http://52.78.180.44:8080/recipes/${recipeId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        alert("레시피가 삭제되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        handleError(error);
        alert("레시피 삭제에 실패했습니다.");
      });
  };

  const onEditRecipe = (recipeId) => {
    navigate(`/recipes/edit/${recipeId}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return (
      <div>레시피 상세 정보를 불러오는 데 실패했습니다: {error.message}</div>
    );
  }

  if (!recipe) {
    return <div>레시피를 찾을 수 없습니다.</div>;
  }

  const steps = [];
  for (let i = 1; i <= 10; i++) {
    const image = recipe[`step${i}_image`];
    const description = recipe[`step${i}_description`];
    if (image || description) {
      steps.push({ image, description });
    }
  }

  const tags = Array.isArray(recipe.tags)
    ? recipe.tags.join(", ")
    : "태그 정보 없음";
  const equipment = Array.isArray(recipe.equipment)
    ? recipe.equipment.join(", ")
    : "조리도구 정보 없음";

  return (
    <div className="recipe-detail-container">
      <div className="recipe-image-container">
        <img
          src={recipe.image || init_image}
          alt="대표사진"
          className="recipe-re-image"
        />
      </div>

      <div className="header-container">
        <div className="left-content">
          <div className="show_title">{recipe.title}</div>
          <div className="show_tag">{recipe.tags}</div>
        </div>
        <div className="recipe-buttons">
          {recipe.author === username ? (
            <>
              <button
                className="edit-btn"
                onClick={() => onEditRecipe(recipe.id)}
              >
                <img src={editIcon} alt="수정하기" />
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteRecipe(recipe.id)}
              >
                <img src={deleteIcon} alt="삭제하기" />
              </button>
            </>
          ) : (
            <button
              className="save-btn"
              onClick={() => handleToggleSave(recipe.id)}
            >
              <img
                src={isScrapped ? savedIcon : unsavedIcon}
                alt={isScrapped ? "저장됨" : "저장되지 않음"}
              />
            </button>
          )}
        </div>
      </div>

      <hr className="line_show" />

      <div className="section-container">
        <div className="section-left">
          <div className="cate_show">재료</div>
          <div className="li_show">
            <ul>
              {Array.isArray(recipe.ingredients) ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.item}</span>
                    <span className="ingredient-quantity">
                      {ingredient.quantity}
                    </span>
                  </li>
                ))
              ) : (
                <li>재료 정보가 없습니다.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="section-right">
          <div>
            <div className="cate_show">
              <img className="time_img" src={timerIcon} alt="조리시간 아이콘" />
              조리시간
            </div>
            <div className="time_show">{recipe.cookingTime || "시간 미정"}</div>
          </div>
          <div>
            <div className="cate_show">
              <img className="tool_img" src={toolIcon} alt="조리도구 아이콘" />
              조리도구
            </div>
            <div className="equi_show">{recipe.equipment}</div>
          </div>
        </div>
      </div>

      <div className="steps-container">
        <h2>조리 단계</h2>
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <div key={index} className="step">
              <img
                src={step.image || init_image}
                alt={`단계 ${index + 1}`}
                className="step-image"
              />
              <p>{step.description}</p>
            </div>
          ))
        ) : (
          <p>조리 단계 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
