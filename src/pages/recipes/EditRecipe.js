import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/WriteRecipe.css";
import representPicture from "./represent_picture.png";
import init_image from "./init_recipe_image.png";

const EditRecipe = () => {
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [image, setImage] = useState(representPicture);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [equipment, setEquipment] = useState("");
  const [ingredients, setIngredients] = useState([{ item: "", quantity: "" }]);
  const [steps, setSteps] = useState(
    Array(10).fill({ description: "", imageFile: null, imageUrl: "" })
  );

  const fileInputRef = useRef(null);
  const stepFileInputRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://52.78.180.44:8080/recipes/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          const recipeData = response.data;

          setImage(recipeData.image || representPicture);
          setImageFile(null);
          setTitle(recipeData.title || "");
          setTags(recipeData.tags || "");
          setCookingTime(recipeData.cookingTime || "");
          setEquipment(recipeData.equipment || "");
          setIngredients(recipeData.ingredients || [{ name: "", amount: "" }]);
          setSteps(
            Array.from({ length: 10 }).map((_, index) => ({
              description: recipeData[`step${index + 1}_description`] || "",
              imageFile: null,
              imageUrl: recipeData[`step${index + 1}_image`] || "",
            }))
          );
        })
        .catch((error) => {
          console.error("레시피 정보를 불러오는 데 실패했습니다:", error);
          alert("레시피 정보를 불러오는 데 실패했습니다.");
        });
    }

    return () => {
      // Clean up URL.createObjectURL references for only blob URLs
      steps.forEach((step) => {
        if (step.imageFile && step.imageFile instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(step.imageFile));
        }
      });
    };
  }, [id, token]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const handleStepImageChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedSteps = [...steps];
      updatedSteps[index] = {
        ...updatedSteps[index],
        imageFile: file,
        imageUrl: "",
      };
      setSteps(updatedSteps);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { item: "", quantity: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !tags || !cookingTime || !equipment) {
      alert("모든 필드를 작성해 주세요.");
      return;
    }

    // 최소 1단계의 설명 또는 이미지 확인
    const hasValidStep = steps.some(
      (step) => step.description.trim() || step.imageFile || step.imageUrl
    );

    if (!hasValidStep) {
      alert("조리 방법의 최소 1단계는 사진이나 설명이 필요합니다.");
      return;
    }

    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (image && image !== representPicture) {
      formData.append("image_url", image);
    }

    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("cookingTime", cookingTime);
    formData.append("equipment", equipment);
    formData.append("ingredients", JSON.stringify(ingredients));

    steps.forEach((step, index) => {
      if (step.imageFile) {
        formData.append(`step${index + 1}_image`, step.imageFile);
      } else if (step.imageUrl) {
        formData.append(`step${index + 1}_image_url`, step.imageUrl);
      }
      formData.append(`step${index + 1}_description`, step.description);
    });

    const authorUsername = localStorage.getItem("username");
    formData.append("author", authorUsername);

    try {
      const response = await axios.put(
        `http://52.78.180.44:8080/recipes/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("서버 응답 데이터:", response.data);
      alert("레시피가 수정되었습니다!");
      navigate("/recipes");
    } catch (error) {
      if (error.response) {
        console.error("서버 응답 데이터:", error.response.data);
        console.error("서버 응답 상태:", error.response.status);
        console.error("서버 응답 헤더:", error.response.headers);
        alert(
          `서버 오류: ${
            error.response.data.author || "알 수 없는 오류가 발생했습니다."
          }`
        );
      } else if (error.request) {
        console.error("서버에 요청을 보냈지만 응답이 없습니다:", error.request);
        alert("서버에 요청을 보냈지만 응답이 없습니다.");
      } else {
        console.error("요청 설정 중 오류 발생:", error.message);
        alert("요청 설정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div
          className="picture_re_input"
          onClick={handleImageClick}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <img src={image} alt="대표사진" className="image-preview" />
        </div>
        <input
          className="input-recipe-data"
          type="text"
          value={title}
          placeholder="레시피명을 작성해 주세요."
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input-recipe-data"
          type="text"
          value={tags}
          placeholder="#웰니스 키워드를 작성해 주세요."
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          className="input-recipe-data"
          type="text"
          value={cookingTime}
          placeholder="조리시간을 작성해 주세요."
          onChange={(e) => setCookingTime(e.target.value)}
        />
        <input
          className="input-recipe-data"
          type="text"
          value={equipment}
          placeholder="조리기구를 하나만 작성해 주세요. (전자레인지/오븐/에어프라이어 등)"
          onChange={(e) => setEquipment(e.target.value)}
        />

        <div className="style2">
          <div>
            <div className="writerecipe-title">재료</div>
            {ingredients.map((ingredient, index) => (
              <div className="ingredient-div" key={index}>
                <input
                  type="text"
                  placeholder="재료명"
                  value={ingredient.item}
                  onChange={(e) =>
                    setIngredients((prevIngredients) =>
                      prevIngredients.map((ing, i) =>
                        i === index ? { ...ing, item: e.target.value } : ing
                      )
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="수량"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    setIngredients((prevIngredients) =>
                      prevIngredients.map((ing, i) =>
                        i === index ? { ...ing, quantity: e.target.value } : ing
                      )
                    )
                  }
                />
              </div>
            ))}
            <button
              className="add-gredient-btn"
              type="button"
              onClick={addIngredient}
            >
              ➕ 항목 추가
            </button>
          </div>
          <div className="recipe-step-header">
            <div className="writerecipe-title2">조리방법</div>
          </div>
          <div className="recipe-step-container">
            {steps.map((step, index) => (
              <div className="recipe-step" key={index}>
                <input
                  type="file"
                  ref={(el) => (stepFileInputRefs.current[index] = el)}
                  style={{ display: "none" }}
                  onChange={(e) => handleStepImageChange(index, e)}
                />
                <div
                  className="image-container"
                  onClick={() => stepFileInputRefs.current[index]?.click()}
                >
                  <img
                    src={
                      step.imageFile
                        ? URL.createObjectURL(step.imageFile)
                        : step.imageUrl || init_image
                    }
                    alt={`조리 단계 ${index + 1} 사진`}
                    className="image-preview"
                  />
                </div>
                <textarea
                  rows="9"
                  className="text-explain"
                  placeholder="조리방법"
                  value={step.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <button className="recipe-save-button" type="submit">
          레시피 수정하기
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
