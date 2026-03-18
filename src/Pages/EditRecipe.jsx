import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import ApiService from "../ApiService";
import AddRecipePanel from "../Modules/AddRecipePanel";
import LoaderComponent from "../Modules/LoaderComponent";

function EditRecipe() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipeDetails, setRecipeDetails] = useState(null);
    const token = localStorage.getItem("token");

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        ApiService.getRecipeDetails(id).then(recipe => {
            if (!recipe) {
                navigate("/404");
                return;
            }

            ApiService.getLoggedUser(token).then(user => {
                if (user?.id !== recipe.author?.id) {
                    navigate("/");
                    return;
                }

                setRecipeDetails(recipe);
                setIsLoaded(true);
            });
        });
    }, [id, token, navigate]);

    if (!isLoaded) {
        return (
            <LoaderComponent />
        );
    }

    return (
        <AddRecipePanel 
            recipeDetails={recipeDetails}
            fetchFunction={(data, tkn) => ApiService.editRecipe(data, tkn, id)} 
        />
    );
}

export default EditRecipe