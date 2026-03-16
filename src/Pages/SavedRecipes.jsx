import RecipesList from "../Modules/RecipesList";
import ApiService from "../ApiService";

function SavedRecipes() {
    const token = localStorage.getItem("token");

    return(
        <div>
            <div className="userTopSection">
                <p style={{margin: "20px 5px 0 0", fontSize: "25px"}}>Zapisane przepisy</p>
            </div>
            
            <RecipesList 
                fetchFunction={(params) => ApiService.getSavedRecipes(params, token)}
                isUserPage={false} 
                />
        </div>
    );
}

export default SavedRecipes