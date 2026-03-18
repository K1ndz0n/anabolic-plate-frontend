import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom"
import ApiService from "../ApiService";
import RecipesList from "../Modules/RecipesList";
import UserOpinion from "../Modules/UserOpinion";
import PageManager from "../Modules/PageManager";
import LoaderComponent from "../Modules/LoaderComponent";


function UserPage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [userDetails, setUserDetails] = useState();
    const [activeTab, setActiveTab] = useState("recipes");

    const [opinions, setOpinions] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isFollowed, setIsFollowed] = useState(false);
    const [isLoggedUsersPage, setIsLoggedUsersPage] = useState(false);
    const token = localStorage.getItem("token");
    const [followAmount, setFollowAmount] = useState(0);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            const [userData, opinionsData] = await Promise.all([
                ApiService.getUserByUsername(username),
                ApiService.getUserOpinions(username, page, pageSize), 
            ]);

            if (!userData) {
                navigate("/404");
            }

            if (token) {
                const [loggedUserData, isFollowedData] = await Promise.all([
                    ApiService.getLoggedUser(token),
                    ApiService.isFollowed(username, token)
                ])

                setIsFollowed(isFollowedData);

                if (loggedUserData.username === username) {
                    setIsLoggedUsersPage(true);
                }
            }  

            setUserDetails(userData);
            setFollowAmount(userData.followAmount);
            setOpinions(opinionsData);
            
            setIsLoaded(true);
        }

        fetchAll();
    }, [username]);

    var opinionComponent = 
        <div className="opinions">
            {opinions.totalCount > 0 
            ? <>
                {opinions.items?.map(o => (
                    <UserOpinion key={o.recipeId} opinion={o} />
                ))}

                <PageManager 
                    page={page} 
                    setPage={setPage} 
                    pageSize={pageSize} 
                    setPageSize={setPageSize} 
                    hasNext={opinions.hasNext} 
                    totalPages={opinions.totalPages}/>
            </>
            : <p className="noContentInfo">Brak opinii</p>}     
        </div>

    const handleFollowAction = async () => {
        try {
            if (isFollowed) {
                await ApiService.deleteFollow(username, token);
                setIsFollowed(false);
                setFollowAmount(followAmount - 1);
            } else {
                await ApiService.addFollow(username, token);
                setIsFollowed(true);
                setFollowAmount(followAmount + 1)
            }
        } catch (err) {}
    }

    const fetchRecipes = useCallback((params) => {
        return ApiService.getUserRecipeThumbnails(params, username);
    }, [username]);

    if (!isLoaded) {
        return (<LoaderComponent />)
    }

    return(
        <div className="userPage">
            <div className="userTopSection">
                
                <div className="upperRow">
                    <p>Profil użytkownika {userDetails?.username}</p>
                    {token && !isLoggedUsersPage &&
                        <button className="likeButton"
                            onClick={() => handleFollowAction()} 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            {isFollowed ? (
                                // Serce wypełnione
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                </svg>
                            ) : (
                                // Serce puste
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                </svg>
                            )}
                            {isFollowed ? "Obserwujesz" : "Obserwuj"}
                        </button>}
                </div>
                
                <p style={{color: "#666", marginTop: "10px"}}>{followAmount} obserwujących</p>

                <div className="switchButtons">
                    <button
                        className={activeTab === "recipes" ? "active" : ""}
                        onClick={() => setActiveTab("recipes")}
                        >Przepisy</button>
                    <button
                        className={activeTab === "opinions" ? "active" : ""}
                        onClick={() => setActiveTab("opinions")}
                        >Opinie</button>
                </div>
            </div>

            {activeTab === "recipes"
            ? <RecipesList
                key={username}
                fetchFunction={fetchRecipes}
                isUserPage={true} 
                /> : opinionComponent}
        </div>
    );
}

export default UserPage
