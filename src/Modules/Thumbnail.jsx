import Icon from "./Icon";
import ApiService from "../ApiService";
import StarRating from "./StarRating";
import { useNavigate, Link } from "react-router-dom";

function Thumbnail({ thumbnail, isUserPage }) {
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
            className="thumbnail"
            onClick={() => navigate(`/recipes/${thumbnail.recipeId}`)}
            >
            {photo}
            <div className="thumbnailText"> 
                <p className="thumbnailTitle">{thumbnail.name}</p>        
                <StarRating rating={thumbnail.rating} /> ({thumbnail.opinionAmount})
                <p style={{wordBreak: 'break-word'}}>{thumbnail.description}</p>
                <Link
                    to={`/user/${thumbnail.author?.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="authorLink">    
                    {!isUserPage && <p style={{color: "#666"}}>Autor: {thumbnail.author.username}</p>} 
                </Link> 
            </div>
        </div>               
    );
}

export default Thumbnail