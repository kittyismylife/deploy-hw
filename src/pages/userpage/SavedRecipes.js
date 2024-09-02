import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import timerIcon2 from "../../assets/timer2.png";
import toolIcon2 from "../../assets/tool2.png";
import "../../styles/SavedRecipes.css";
import savedIcon from "../../assets/saved-icon.png";
import unsavedIcon from "../../assets/unsaved-icon.png";
import altIcon from "../../assets/alt.png";

const RecipeCard = React.memo(({ recipe, onDetail, onToggleSave }) => (
  <div
    key={recipe.id}
    className="product-card2"
    onClick={() => onDetail(recipe.id)}
  >
    <div className="product-show3">
      <img src={recipe.image} alt={recipe.title} className="product-image3" />
      <div className="product-info2">
        <h3 className="product-name">{recipe.title}</h3>
        <div className="product-tags2">{recipe.tags.join(", ")}</div>
        <div className="info-container2">
          <img className="tool_img_saved" src={toolIcon2} alt="Equipment" />
          <div className="saved-recipe-sub-show">
            {recipe.equipment.join(", ")}
          </div>
          <img className="time_img_saved" src={timerIcon2} alt="Cooking Time" />
          <div className="saved-recipe-sub-show">
            {recipe.cookingTime || "시간 미정"}
          </div>
        </div>
      </div>
      <button
        className="save-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(recipe.id);
        }}
      >
        <img src={recipe.isSaved ? savedIcon : unsavedIcon} alt="Save" />
      </button>
    </div>
    <hr className="divider" />
  </div>
));

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch saved recipes when component mounts
  const fetchSavedRecipes = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://52.78.180.44:8080/users/saved-recipes",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data)) {
          setRecipes(
            data.map((recipe) => ({
              ...recipe,
              tags: recipe.tags ? recipe.tags.split(",") : [],
              equipment: recipe.equipment ? recipe.equipment.split(",") : [],
              isSaved: true,
            }))
          );
        } else {
          console.error("Data is not an array", data);
        }
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedRecipes();
  }, [fetchSavedRecipes]);

  const handleDetailRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  const onToggleSave = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const recipe = recipes.find((recipe) => recipe.id === id);
      if (!recipe) return;

      if (recipe.isSaved) {
        // Ensure the URL ends with a trailing slash
        await axios.delete(
          `http://52.78.180.44:8080/users/saved-recipes/${id}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
      } else {
        // Ensure the URL ends with a trailing slash
        await axios.put(
          `http://52.78.180.44:8080/users/saved-recipes/${id}/`,
          {},
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
      }

      setRecipes((prevRecipes) =>
        prevRecipes.map((rec) =>
          rec.id === id ? { ...rec, isSaved: !rec.isSaved } : rec
        )
      );
    } catch (error) {
      console.error("Failed to toggle save status:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading saved recipes: {error.message}</div>;

  return (
    <div className="order-list">
      <div className="orderlist-title2">저장한 레시피</div>
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDetail={handleDetailRecipe}
            onToggleSave={onToggleSave}
          />
        ))
      ) : (
        <div className="no-recipes-message">
          <img src={altIcon} alt="No recipes icon" />
          <p>저장된 레시피가 존재하지 않습니다.</p>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
