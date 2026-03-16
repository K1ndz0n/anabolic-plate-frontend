import { useEffect, useState } from "react";
import StarRating from "../Modules/StarRating";
import { Link } from "react-router-dom";
import ApiService from "../ApiService";

function UserOpinion({ opinion }) {
    const [recipe, setRecipe] = useState({});

    useEffect(() => {
        ApiService.getRecipeDetails(opinion?.recipeId)
            .then(setRecipe)
    }, [opinion.recipeId]);

    return(
        <div className="userOpinion">
            <p style={{color: "#949494", marginTop: "5px", marginBottom: "5px", fontSize: "20px"}}>
                <Link
                    to={`/recipes/${recipe?.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="authorLink">    
                    {recipe.name}   
                </Link>
            </p>
            <p style={{color: "#666", marginTop: "5px"}}>Od użytkownika{" "} 
                <Link
                    to={`/user/${recipe.author?.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="authorLink">    
                    {recipe.author?.username}   
                </Link>
            </p>

            <StarRating rating={opinion.rating} /> {" "} {new Date(opinion.createdAt).toLocaleDateString("pl-PL")}
            <p style={{wordBreak: 'break-word'}}>{opinion.comment}</p>
        </div>
    );
}

export default UserOpinion