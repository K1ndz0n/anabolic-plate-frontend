import ApiService from "../ApiService";
import AddRecipePanel from "../Modules/AddRecipePanel";


function AddRecipe() {
    return(<AddRecipePanel 
                fetchFunction={(data, token) => ApiService.addRecipe(data, token)}/>);
}

export default AddRecipe;