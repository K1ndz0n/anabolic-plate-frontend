import MiniThumbnailPanel from '../Modules/MiniThumbnailPanel';
import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ApiService from '../ApiService';
import { ClipLoader } from "react-spinners";

function Home() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const [latestRecipes, setLatestRecipes] = useState([]);
    const [bestRecipes, setBestRecipes] = useState([]);
    const [mostPopularRecipes, setMostPopularRecipes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            const [latest, best, popular] = await Promise.all([
                ApiService.getRecipeThumbnails({ page: 1, pageSize: 3, orderBy: "recipeId" }),
                ApiService.getRecipeThumbnails({ page: 1, pageSize: 3, orderBy: "rating" }),
                ApiService.getRecipeThumbnails({ page: 1, pageSize: 3, orderBy: "opinionAmount" })
            ]);

            setLatestRecipes(latest);
            setBestRecipes(best);
            setMostPopularRecipes(popular);
            setIsLoaded(true);
        };

        fetchAllData();
    }, []);

    if (!isLoaded) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', marginTop: "10px"}}>
                    <ClipLoader color="white" size={50} />
                </div>
                <p className="noContentInfo">Ładowanie zawartości...</p>
            </div>)
    }

    return (
        <div className="homePage">
            <div className='heroSection'>
                <div className='heroSectionLeft'>
                    <p style={{fontSize: "30px"}}>Witaj w Anabolic Plate!</p>
                    <p style={{color: "#666", marginTop: "5px"}}>Czy wiesz, że... na większość przyrostów pracujemy właśnie w kuchni?</p>
                    <p>Znajdziesz tu wysokobiałkowe przepisy, proste składniki i szybkie dania idealne dla osób trenujących.</p>
                    {!token && 
                        <>
                            <p>Chcesz dodawać swoje własne przepisy bądź oceniać inne? Załóż konto!</p>
                            <button style={{marginRight: "10px"}} onClick={() => navigate("/register")}>Zarejestruj się</button>
                            <button onClick={() => navigate("/login")}>Zaloguj się</button>
                        </>}
                </div>
                <div className='heroSectionRight'>
                    <p>Przejdź do pełnej listy przepisów, aby wyszukiwać oraz odkrywać nowe ulubione przepisy!</p>
                    <button onClick={() => navigate("/Recipes")}>Zobacz wszystkie →</button>
                </div>
            </div>

            <MiniThumbnailPanel data={latestRecipes} labelText="Najnowsze"/>
            <MiniThumbnailPanel data={bestRecipes} labelText="Najlepsze"/>
            <MiniThumbnailPanel data={mostPopularRecipes} labelText="Najpopularniejsze"/>
        </div>
    ) 

}

export default Home