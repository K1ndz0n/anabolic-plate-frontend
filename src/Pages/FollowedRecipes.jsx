import RecipesList from "../Modules/RecipesList";
import ApiService from "../ApiService";

function FollowedRecipes() {
    const token = localStorage.getItem("token");

    return(
        <div>
            <div className="userTopSection">
                <p style={{margin: "20px 5px 0 0", fontSize: "25px", textAlign: "center"}}>Przepisy od obserwowanych twórców</p>
            </div>
            
            <RecipesList 
                fetchFunction={(params) => ApiService.getFollowedRecipes(params, token)}
                isUserPage={false} 
                />
        </div>
    );
}

export default FollowedRecipes