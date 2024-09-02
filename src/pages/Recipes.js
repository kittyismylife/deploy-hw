import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Recipes.css";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import savedIcon from "../assets/saved-icon.png";
import unsavedIcon from "../assets/unsaved-icon.png";
import altIcon from "../assets/alt.png";
import toolIcon from "../assets/tool2.png";

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

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <input
    type="text"
    className="search"
    value={searchTerm}
    placeholder="조리도구 및 웰니스 키워드를 검색해주세요."
    onChange={(e) => setSearchTerm(e.target.value)}
  />
);

const RecipeItem = ({
  recipe,
  onToggleSave,
  isScrapped,
  onDelete,
  onDetailRecipe,
  onEditRecipe,
}) => {
  const isAuthor = recipe.is_owner;

  return (
    <div className="recipe-item" onClick={() => onDetailRecipe(recipe.id)}>
      <img
        src={recipe.image || altIcon}
        alt={recipe.title}
        className="recipe-image"
      />
      <div className="recipe-header">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-container">
          <img src={toolIcon} alt="수정하기" className="tool-icon" />
          <p className="recipe-equipment">{recipe.equipment.join(", ")}</p>
        </div>
      </div>
      <div className="recipe-footer">
        <p className="recipe-tags">{recipe.tags.join(", ")}</p>
        <div className="recipe-buttons">
          {isAuthor ? (
            <>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRecipe(recipe.id);
                }}
              >
                <img src={editIcon} alt="수정하기" />
              </button>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(recipe.id);
                }}
              >
                <img src={deleteIcon} alt="삭제하기" />
              </button>
            </>
          ) : (
            <button
              className="save-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(recipe.id);
              }}
            >
              <img
                src={isScrapped ? savedIcon : unsavedIcon}
                alt={isScrapped ? "저장됨" : "저장되지 않음"}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = localStorage.getItem("nickname");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");

    const storedSavedRecipes = localStorage.getItem("savedRecipes");
    if (storedSavedRecipes) {
      setSavedRecipes(JSON.parse(storedSavedRecipes));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://52.78.180.44:8080/users/saved-recipes/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSavedRecipes(response.data);
          localStorage.setItem("savedRecipes", JSON.stringify(response.data));
        }
      })
      .catch((error) => handleError(error));

    axios
      .get("http://52.78.180.44:8080/recipes/", {
        headers: {
          Authorization: `Token ${token}`,
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
                equipment: recipe.equipment ? recipe.equipment.split(",") : [],
                isScrapped: recipe.is_scrapped || false,
              }))
            );
          } else {
            console.error("Data is not an array", data);
          }
        } else {
          console.error("Unexpected response status:", response.status);
        }
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, location]);

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

  const handleToggleSave = (recipeId) => {
    axios
      .post(
        `http://52.78.180.44:8080/users/saved-recipes/${recipeId}`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then(() => {
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, isScrapped: !recipe.isScrapped }
              : recipe
          )
        );
        setSavedRecipes((prevSaved) => {
          const updatedSaved = prevSaved.includes(recipeId)
            ? prevSaved.filter((id) => id !== recipeId)
            : [...prevSaved, recipeId];
          localStorage.setItem("savedRecipes", JSON.stringify(updatedSaved));
          return updatedSaved;
        });
      })
      .catch((error) => handleError(error));
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
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== recipeId)
        );
      })
      .catch((error) => handleError(error));
  };

  const handleAddRecipe = () => {
    navigate("/recipes/write");
  };

  const handleDetailRecipe = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/recipes/edit/${recipeId}`);
  };

  return (
    <div className="recipe-container1">
      <div className="search-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : error ? (
        <div className="error-message">
          Error loading recipes: {error.message}
        </div>
      ) : filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <RecipeItem
            key={recipe.id}
            recipe={recipe}
            currentUser={currentUser}
            onToggleSave={handleToggleSave}
            isScrapped={recipe.isScrapped}
            onDelete={handleDeleteRecipe}
            onDetailRecipe={handleDetailRecipe}
            onEditRecipe={handleEditRecipe}
          />
        ))
      ) : (
        <div className="no-recipes-message">
          <img src={altIcon} alt="No Recipes" />
          <p>레시피가 없습니다. 검색어를 변경해 보세요.</p>
        </div>
      )}
      <button className="add-recipe-btn" onClick={handleAddRecipe}>
        ✏️ 등록하기
      </button>
    </div>
  );
};

export default Recipes;
