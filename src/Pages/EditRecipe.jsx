import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import ApiService from "../ApiService";
import AddRecipePanel from "../Modules/AddRecipePanel";


function EditRecipe() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipeDetails, setRecipeDetails] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        ApiService.getRecipeDetails(id).then(recipe => {
            if (!recipe) {
                navigate("/404");
                return;
            }

            ApiService.getLoggedUser(token).then(user => {
                if (user?.id !== recipe.author?.id) {
                    console.log("Wypad! Twoje ID:", user?.id, "Autora:", recipe.author?.id);
                    navigate("/");
                    return;
                }

                setRecipeDetails(recipe);
            });
        });
    }, [id, token, navigate]);

    return (
        <AddRecipePanel 
            recipeDetails={recipeDetails}
            fetchFunction={(data, tkn) => ApiService.editRecipe(data, tkn, id)} 
        />
    );
}

export default EditRecipe