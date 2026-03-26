import Icon from "./Icon";
import ApiService from "../ApiService";
import StarRating from "./StarRating";
import { useNavigate, Link } from "react-router-dom";

function MiniThumbnail({ thumbnail }) {
    const navigate = useNavigate();
    const photo = thumbnail.thumbnailPhotoUrl == null
        ? <Icon />
        : <img
            className="thumbnailImage" 
            src={ApiService.API_URL + thumbnail.thumbnailPhotoUrl} 
            alt="błąd przy pobieraniu zdjęcia" 
            />

    return(  
        <div
            className="miniThumbnail"
            onClick={() => navigate(`/recipes/${thumbnail.recipeId}`)}
            >
            {photo}
            <div className="thumbnailText"> 
                <p style={{fontSize: 20, margin: 0, wordBreak: 'break-word'}}>{thumbnail.name}</p>       
                <StarRating rating={thumbnail.rating} /> ({thumbnail.opinionAmount})
                <Link
                    to={`/user/${thumbnail.author?.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="authorLink">    
                    <p>Autor: {thumbnail.author.username}</p>   
                </Link>
            </div>
        </div>            
    );
}

export default MiniThumbnail