import ApiService from "../ApiService";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Opinion from "../Modules/Opinion";
import StarRating from "../Modules/StarRating";
import PageManager from "../Modules/PageManager";
import Units from "../Units";
import LoaderComponent from "../Modules/LoaderComponent";
import LoadingButton from "../Modules/LoadingButton";

function RecipeDetails() {
    const { id } = useParams();
    const [recipeDetails, setRecipeDetails] = useState({});
    const [opinions, setOpinions] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [showAddPhoto, setShowAddPhoto] = useState(false);
    const [photoError, setPhotoError] = useState("");
    const [file, setFile] = useState(null);
    const [currentPhtoto, setCurrentPhoto] = useState(0);
    const [showDeletePhoto, setShowDeletePhoto] = useState(false);

    const token = localStorage.getItem("token");
    const [isUsersRecipe, setIsUsersRecipe] = useState(false);

    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    
    const [nutritionValid, setNutritionValid] = useState(false);
    const [nutritionError, setNutritionError] = useState("");
    const [showEditNutrition, setShowEditNutrition] = useState(false);
    const [showDeleteNutrition, setShowDeleteNutrition] = useState(false);

    const [showDeleteRecipe, setShowDeleteRecipe] = useState(false);

    const [userOpinion, setUserOpinion] = useState(null);
    const [userOpinionRating, setUserOpinionRating] = useState(0);
    const [userOpinionComment, setUserOpinionComment] = useState("");
    const [showEditOpinion, setShowEditOpinion] = useState(false);
    const [showDeleteOpinion, setShowDeleteOpinion] = useState(false);
    const [userOpinionError, setUserOpinionError] = useState("");

    const [isLiked, setIsLiked] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);
    const [reloadTrigger, setReoladTrigger] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoaded(false);
            setShowEditNutrition(false);
            setShowDeleteNutrition(false);
            setShowEditOpinion(false);
            setShowEditOpinion(false);
            setShowDeleteOpinion(false);
            setShowAddPhoto(false);
            setShowDeletePhoto(false);
            setShowEditNutrition(false);
            setProtein(0);
            setCarbs(0);
            setFat(0);

            const recipeData = await ApiService.getRecipeDetails(id);
            if (!recipeData) {
                navigate("/404");
            }

            setRecipeDetails(recipeData);
            if (recipeData.nutrition) {
                setProtein(recipeData.nutrition.protein);
                setCarbs(recipeData.nutrition.carbs);
                setFat(recipeData.nutrition.fat);
            }

            if (token) {
                const [loggedUserData, myOpinionData, isLikedData] = await Promise.all([
                        ApiService.getLoggedUser(token),
                        ApiService.getMyRecipeOpinion(id, token),
                        ApiService.isLiked(id, token),
                        
                ]);

                setIsUsersRecipe(
                    loggedUserData.id === recipeData.author.id
                );

                if (myOpinionData) {
                    setUserOpinion(myOpinionData);
                    setUserOpinionRating(myOpinionData.rating);
                    setUserOpinionComment(myOpinionData.comment);
                }

                setIsLiked(isLikedData);
            }

            setIsLoaded(true);
        }

        fetchAll()
    }, [id, token, reloadTrigger, navigate]);

    useEffect(() => {
        if (token) {
            ApiService.getRecipeOpinionsWhenLogged(id, page, pageSize, token).then(setOpinions);
        } else {
            ApiService.getRecipeOpinions(id, page, pageSize).then(setOpinions);
        }
    }, [page, pageSize, reloadTrigger])

    useEffect(() => {
        setNutritionValid(
            protein >= 0 && protein <= 9999
            && carbs >= 0 && carbs <= 9999
            && fat >= 0 && fat <= 9999
        )
    }, [protein, carbs, fat]);

    var deleteRecipeComponent = 
        <div>
            <p>Czy na pewno chcesz usunąć ten przepis? Efekt będzie nieodwracalny.</p>
            <div className="editRecipeButtons">
                <LoadingButton
                    text={"Tak"}
                    className={"deleteButton"}
                    onClick={() => handleDeleteRecipe()} />
                <button
                    onClick={() => setShowDeleteRecipe(false)}>Nie</button>
            </div>
        </div>

    var deleteNutritionComponent = 
        <div>
            <p>Czy na pewno chcesz usunąć informację żywieniową?</p>
            <div className="editRecipeButtons">
                <LoadingButton
                    text={"Tak"}
                    className={"deleteButton"}
                    onClick={() => handleDeleteNutrition()} />
                <button
                    onClick={() => setShowDeleteNutrition(false)}>Nie</button>
            </div>
        </div>

    var deletePhotoComponent = 
        <div className="deletePhotoComponent">
            <p>Czy na pewno chcesz usunąć to zdjęcie?</p>
            <div className="editRecipeButtons">
                <LoadingButton
                    text={"Tak"}
                    className={"deleteButton"}
                    onClick={() => handleDeletePhoto(photos[currentPhtoto].id)} />
                <button
                    onClick={() => setShowDeletePhoto(false)}>Nie</button>
            </div>
        </div>

    var editNutririonComponent =
        <div className="editNutritionComponent">
            <div className="nutritionInputsRow">
                <div className="formField">
                    <label style={{ color: "#666", fontSize: "14px" }}>Białko (g)</label>
                    <input
                        type="number"
                        min={0}
                        max={9999}
                        value={protein}
                        onChange={e => setProtein(e.target.value)}
                    />
                </div>
                <div className="formField">
                    <label style={{ color: "#666", fontSize: "14px" }}>Tłuszcze (g)</label>
                    <input
                        type="number"
                        min={0}
                        max={9999}
                        value={fat}
                        onChange={e => setFat(e.target.value)}
                    />
                </div>
                <div className="formField">
                    <label style={{ color: "#666", fontSize: "14px" }}>Węglowodany (g)</label>
                    <input
                        type="number"
                        min={0}
                        max={9999}
                        value={carbs}
                        onChange={e => setCarbs(e.target.value)}
                    />
                </div>
            </div>
            {showDeleteNutrition
            ? deleteNutritionComponent
            : <div className="editRecipeButtons">
                <LoadingButton
                    text={recipeDetails.nutrition ? "Zapisz" : "Dodaj"}
                    disabled={!nutritionValid}
                    onClick={() => handleEditNutrition()} />

                <button onClick={() => {
                    setShowEditNutrition(false)
                    setNutritionError("")}}>Anuluj</button>
                <button
                    className="deleteButton"
                    disabled={!recipeDetails.nutrition}
                    onClick={() => setShowDeleteNutrition(true)}>Usuń</button>
            </div>}
            {nutritionError && <p className="errorMessage">{nutritionError}</p>}
        </div>

    var nutrition = <div className="nutrition">
        {!showEditNutrition &&
            <div className="nutritionInfo">
                <p style={{margin: "8px"}}>{recipeDetails.nutrition?.kcal} kcal</p>
                <div className="nutritionInputsRow">
                    <div className="formField">
                        <label style={{ color: "#666", fontSize: "14px", margin: "5px" }}>Białko</label>
                        <p>{recipeDetails.nutrition?.protein}{" "}g</p>
                    </div>
                    <div className="formField">
                        <label style={{ color: "#666", fontSize: "14px", margin: "5px" }}>Tłuszcze</label>
                        <p>{recipeDetails.nutrition?.fat}{" "}g</p>
                    </div>
                    <div className="formField">
                        <label style={{ color: "#666", fontSize: "14px", margin: "5px" }}>Węglowodany</label>
                        <p>{recipeDetails.nutrition?.carbs}{" "}g</p>
                    </div>
                </div>
            </div>
        }
        {isUsersRecipe &&
            <div className="editRecipeButtons">
                {showEditNutrition
                ? editNutririonComponent
                : <button onClick={() => setShowEditNutrition(true)}>
                    Edytuj
                </button>}
            </div>}
    </div>

    var ingredients =
        <ul style={{margin: 0}}>
            {recipeDetails.ingredients?.map(i => (
                <li style={{margin: "5px", wordBreak: 'break-word'}}>{i.name}: {i.amount} {Units.unitIdToPL(i.unit)}</li>
            ))}
        </ul>

    var instructions =
        <ul style={{margin: 0}}>
            {recipeDetails.steps?.split("\n").map((step, index) => (
                <li key={index} style={{margin: "5px", wordBreak: 'break-word'}}>{step}</li>
            ))}
        </ul>

    const photos = recipeDetails?.photoUrls ?? [];

    var addPhotoComponent =
        <div>
            <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) => setFile(e.target.files[0])} />

            <LoadingButton
                text={"Zatwierdź"}
                disabled={file === null}
                onClick={() => handleAddPhoto()} />
            <button onClick={() => {
                setShowAddPhoto(false)
                setPhotoError("")}}>Anuluj</button>
        </div>

    var photoComponent =
        <div className="photoComponent">
            <div className="photoViewer">
                {photos.length > 0 && !showDeletePhoto &&
                    <button 
                        className="nav left"
                        onClick={() => setCurrentPhoto(Math.max(0, currentPhtoto - 1))}>
                        ‹</button>}

                {photos.length > 0 &&
                <img 
                    className="mainPhoto"
                    src={ApiService.API_URL + photos[currentPhtoto]?.path} />}
                
                {photos.length > 0 && !showDeletePhoto &&
                    <button 
                        className="nav right"
                        onClick={() => currentPhtoto < photos.length - 1
                        && setCurrentPhoto(currentPhtoto + 1)}>
                        ›</button>}

                {photos.length > 0 && isUsersRecipe && !showDeletePhoto &&
                <button
                    className="nav deleteButton"
                    onClick={() => setShowDeletePhoto(true)}>&times;</button>}

                {showDeletePhoto && deletePhotoComponent}

                {photos.length === 0 && <p className="nav noPhoto">Brak zdjęć</p>}
            </div>

            <div className="miniPhotos">
                {photos.map((p, index) => (
                    <img src={ApiService.API_URL + p.path}
                        onClick={() => {
                            if (!showDeletePhoto) {
                                setCurrentPhoto(index)
                            }}}
                        className={`miniPhoto ${index === currentPhtoto && !showDeletePhoto ? 
                            "active" : "inactive"
                        }`} />
                ))}
            </div>
            {isUsersRecipe &&
                <div>
                    {(showAddPhoto)
                        ? addPhotoComponent
                        : <button onClick={() => setShowAddPhoto(true)}>+ Nowe zdjęcie</button>}
                    <p className="errorMessage">{photoError}</p>
                </div>}
        </div>

    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        setPercentage((userOpinionRating / 5) * 100)
    }, [userOpinionRating]);

    var editableStarRating = 
        <div className="stars">
            <div className="stars-back">
                <span onClick={() => setUserOpinionRating(1)}>★</span>
                <span onClick={() => setUserOpinionRating(2)}>★</span>
                <span onClick={() => setUserOpinionRating(3)}>★</span>
                <span onClick={() => setUserOpinionRating(4)}>★</span>
                <span onClick={() => setUserOpinionRating(5)}>★</span>
            </div>
            <div
                className="stars-front"
                style={{ width: `${percentage}%` }}>
                <span onClick={() => setUserOpinionRating(1)}>★</span>
                <span onClick={() => setUserOpinionRating(2)}>★</span>
                <span onClick={() => setUserOpinionRating(3)}>★</span>
                <span onClick={() => setUserOpinionRating(4)}>★</span>
                <span onClick={() => setUserOpinionRating(5)}>★</span>
            </div>
        </div>

    var userOpinionComponent = 
        <div className="userOpinionWrapper">
            {userOpinion && !showEditOpinion &&
                <div className="userOpinionComponent">
                    <p style={{fontSize: 20, margin: "5px", color: "#666"}}>Twoja opinia</p>
                    <StarRating rating={userOpinion.rating} />
                    <p style={{wordBreak: 'break-word'}}>{userOpinion.comment}</p>
                    <button onClick={() => setShowEditOpinion(true)}>Edytuj opinię</button>
                    
                </div>}
            {!userOpinion && !showEditOpinion &&
                <div className="editRecipeButtons">
                    <button onClick={() => setShowEditOpinion(true)}>+ Dodaj opinię</button>
                </div>}
            {showEditOpinion &&
                <div className="userOpinionEdit">
                    <div className="formField">
                        <label style={{ color: "#666", fontSize: "14px" }}>Twoja ocena</label>
                        {editableStarRating}
                    </div>
                    <textarea
                        placeholder="Komentarz"
                        value={userOpinionComment}
                        onChange={(e) => setUserOpinionComment(e.target.value)} />
                    
                    {showDeleteOpinion
                    ? <div>
                        <p>Czy na pewno chcesz usunąć swoją opinię?</p>
                        <div className="editRecipeButtons">
                            <LoadingButton
                                text={"Tak"}
                                className={"deleteButton"}
                                onClick={() => handleDeleteOpinion()} />

                            <button onClick={() => setShowDeleteOpinion(false)}>Nie</button>
                        </div>
                    </div>
                    : <div className="editRecipeButtons">
                        <LoadingButton
                            text={userOpinion ? "Zapisz" : "Dodaj"}
                            disabled={userOpinionRating === 0}
                            onClick={() => handleEditOpinion()} />

                        <button onClick={() => {
                            setUserOpinionError("")
                            setShowEditOpinion(false)}}>Anuluj</button>
                        {userOpinion && 
                            <button
                                className="deleteButton"
                                onClick={() => setShowDeleteOpinion(true)}>Usuń</button>}
                    </div>}
                    <p className="errorMessage">{userOpinionError}</p> 
                </div>}
        </div>

    const handleEditOpinion = async () => {
        const userOpinionData = {
            rating: userOpinionRating,
            comment: userOpinionComment
        }

        try {
            setUserOpinionError("");
            if (userOpinion) {
                await ApiService.editOpinion(id, userOpinionData, token);
            } else {
                await ApiService.addOpinion(id, userOpinionData, token);
            }

            setReoladTrigger(reloadTrigger + 1);
        } catch (err) {
            setUserOpinionError(err.message);
        }
    }

    const handleDeleteOpinion = async () => {
        try {
            setUserOpinionError("");
            await ApiService.deleteOpinion(id, token);
            setReoladTrigger(reloadTrigger + 1);
        } catch (err) {
            setUserOpinionError(err.message);
        }
    }

    const handleAddPhoto = async () => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            setPhotoError("");
            await ApiService.addPhoto(id, formData, token);
            setReoladTrigger(reloadTrigger + 1);
        } catch (err) {
            setPhotoError(err.message);
        }
    }

    const handleDeletePhoto = async (photoId) => {
        try {
            setPhotoError("");
            await ApiService.deletePhoto(photoId, token);
            setReoladTrigger(reloadTrigger + 1);
        } catch (err) {
            setPhotoError(err.message);
        }
    }

    const handleEditNutrition = async () => {
        const nutritionData = {
            protein: Number(protein),
            carbs: Number(carbs),
            fat: Number(fat)
        };

        try {
            setNutritionError("");

            if (recipeDetails.nutrition) {
                await ApiService.editNutrition(id, nutritionData, token);
            } else {
                await ApiService.addNutrition(id, nutritionData, token);
            }

            setReoladTrigger(reloadTrigger + 1);
        } catch (err) {
            setNutritionError(err.message);
        }
    };

    const handleDeleteNutrition = async () => {
        try {
            setNutritionError("");
            await ApiService.deleteNutrition(id, token);
            setReoladTrigger(reloadTrigger + 1); 
        } catch (err) {
            setNutritionError(err.message);
        }
    }

    const handleDeleteRecipe = async () => {
        try {
            await ApiService.deleteRecipe(id, token);
            navigate("/");
        } catch (err) {}
    }

    const handleLikeAction = async () => {
        try {
            if (isLiked) {
                await ApiService.deleteLike(id, token);
                setIsLiked(false);
            } else {
                await ApiService.addLike(id, token);
                setIsLiked(true);
            }
        } catch (err) {console.error("ZŁAPAŁEM BŁĄD:", err);}
    }

    if (!isLoaded) {
        return <LoaderComponent />
    }

    return (
        <div className="recipeLayout">
            <div className="topSection">
                {photoComponent}
                <div className="recipeInfoWrapper">
                    <div className="recipeInfo">
                            {token
                            && <button className="likeButton"
                                    onClick={() => handleLikeAction()} 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    {isLiked ? (
                                        // Ikona wypełnionej zakładki
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                                        </svg>
                                    ) : (
                                        // Ikona pustej zakładki
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                        </svg>
                                    )}
                                    {isLiked ? "Zapisano" : "Zapisz"}
                                </button>}
                        <p style={{fontSize: 30, margin: 0, wordBreak: 'break-word'}}>
                                {recipeDetails.name}{" "}
                        </p>
                        <StarRating rating={recipeDetails.rating} /> ({recipeDetails.opinionAmount})
                        
                        <p style={{color: "#666"}}>Od użytkownika{" "} 
                            <Link
                                to={`/user/${recipeDetails.author?.username}`}
                                onClick={(e) => e.stopPropagation()}
                                className="authorLink">    
                                {recipeDetails.author?.username}   
                            </Link> </p>
                        <p style={{wordBreak: 'break-word'}}>{recipeDetails.description}</p>

                        {recipeDetails.nutrition !== null
                        ? nutrition
                        : <p className="noContentInfo">Autor nie dodał informacji żywieniowej</p>}

                        {isUsersRecipe && !recipeDetails.nutrition
                        && <div className="editRecipeButtons">
                                {showEditNutrition
                                ? editNutririonComponent
                                : <button onClick={() => setShowEditNutrition(true)}>
                                        Dodaj
                                    </button>}
                            </div>}   
                    </div>
                    {isUsersRecipe
                        && <div className="editRecipeButtons">
                                {!showDeleteRecipe &&
                                    <button
                                    onClick={() => navigate(`/recipes/${recipeDetails.id}/edit`)}>
                                        Edytuj przepis
                                    </button>}
                                
                                {showDeleteRecipe
                                ? deleteRecipeComponent
                                : <button
                                        className="deleteButton"
                                        onClick={() => setShowDeleteRecipe(true)}>
                                    Usuń przepis
                                </button>}
                                
                            </div>}
                </div>
            </div>

            <div className="bottomSection">
                <div className="ingredients">
                    <p style={{fontSize: 30, margin: "5px"}}>Składniki</p>
                    {ingredients}
                </div>
                <div className="instructions">
                    <p style={{fontSize: 30, margin: 0}}>Przygotowanie</p>
                    {recipeDetails.steps !== null
                    ? instructions
                    : <p className="noContentInfo">Autor nie dodał instrukcji przygotowania</p>}
                </div>
            </div>
            
            <div className="opinions">
                <p style={{fontSize: 30}}>Opinie</p>
                {token && !isUsersRecipe && userOpinionComponent}

                {opinions.totalCount > 0 
                ? <>
                    {opinions.items?.map(o => (
                        <Opinion key={o.recipeId} opinion={o} />
                    ))}

                    <PageManager 
                        page={page} 
                        setPage={setPage} 
                        pageSize={pageSize} 
                        setPageSize={setPageSize} 
                        hasNext={opinions.hasNext} 
                        totalPages={opinions.totalPages}/>
                </>
                : !userOpinion && <p className="noContentInfo">Brak opinii</p>}       
            </div>
        </div>
    );
}

export default RecipeDetails