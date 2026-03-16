import { useEffect, useState } from "react";
import Thumbnail from "../Modules/Thumbnail";
import FilterPanel from "../Modules/FIlterPanel";
import { DEFAULT_FILTERS } from "../filters.default";
import PageManager from "../Modules/PageManager";
import ApiService from "../ApiService";
import RecipesList from "../Modules/RecipesList";

function Recipes() {
    return(
        <RecipesList fetchFunction={(params) => ApiService.getRecipeThumbnails(params)} 
            isUserPage={false} />
    );
}

export default Recipes;
