import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Recipes.css";
import editIcon from "../../assets/edit-icon.png";
import deleteIcon from "../../assets/delete-icon.png";
import altIcon from "../../assets/alt.png";
import toolIcon from "../../assets/tool2.png";

// 에러 핸들링 함수
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

// 검색 바 컴포넌트
const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <input
    type="text"
    className="search2"
    value={searchTerm}
    placeholder="레시피 제목 또는 태그를 검색하세요."
    onChange={(e) => setSearchTerm(e.target.value)}
  />
);

// 레시피 항목 컴포넌트
const RecipeItem = ({
  recipe,
  onEditRecipe,
  onDeleteRecipe,
  onDetailRecipe,
}) => {
  return (
    <div className="recipe-item2" onClick={() => onDetailRecipe(recipe.id)}>
      <img
        src={recipe.image || altIcon}
        alt={recipe.title}
        className="recipe-image"
      />
      <div className="recipe-header">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-container">
          <img src={toolIcon} alt="Equipment" className="tool-icon" />
          <p className="recipe-equipment">{recipe.equipment.join(", ")}</p>
        </div>
      </div>
      <div className="recipe-footer">
        <p className="recipe-tags">{recipe.tags.join(", ")}</p>
        <div className="recipe-buttons">
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEditRecipe(recipe.id);
            }}
          >
            <img src={editIcon} alt="Edit" />
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRecipe(recipe.id);
            }}
          >
            <img src={deleteIcon} alt="Delete" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 레시피 목록 및 레시피 항목을 포함하는 컴포넌트
const MyRecipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");

    const fetchRecipes = () => {
      if (!storedToken) return;

      axios
        .get("http://52.78.180.44:8080/users/my-recipes", {
          headers: {
            Authorization: `Token ${storedToken}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            if (Array.isArray(data)) {
              setRecipes(
                data.map((recipe) => ({
                  ...recipe,
                  tags: recipe.tags ? recipe.tags.split(",") : [],
                  equipment: recipe.equipment
                    ? recipe.equipment.split(",")
                    : [],
                }))
              );
            } else {
              console.error("Data is not an array", data);
            }
          } else {
            console.error("Unexpected response status:", response.status);
          }
        })
        .catch(handleError);
    };

    fetchRecipes();
  }, [token]);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      recipe.equipment.some((equip) =>
        equip.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== recipeId)
        );
        console.log(`Recipe ${recipeId} deleted.`);
      })
      .catch(handleError);
  };

  const handleDetailRecipe = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/recipes/edit/${recipeId}`);
  };

  return (
    <>
      <div className="orderlist-title2">MY 레시피</div>
      <div className="show-container">
        <div className="search-container">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              onDetailRecipe={handleDetailRecipe}
            />
          ))
        ) : (
          <div className="no-recipes-message">
            <img src={altIcon} alt="No Recipes" />
            <p>저장된 레시피가 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyRecipes;
