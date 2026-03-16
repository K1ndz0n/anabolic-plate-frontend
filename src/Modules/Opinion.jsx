import StarRating from "../Modules/StarRating";
import { Link } from "react-router-dom";

function Opinion({ opinion }) {
    return(
        <div className="opinion">
            <StarRating rating={opinion.rating} /> {" "} {new Date(opinion.createdAt).toLocaleDateString("pl-PL")}
            <p style={{color: "#666", marginTop: "5px"}}>Od użytkownika{" "} 
                <Link
                    to={`/user/${opinion.author?.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="authorLink">    
                    {opinion.author?.username}   
                </Link>
            </p>
            <p style={{wordBreak: 'break-word'}}>{opinion.comment}</p>
        </div>
    );
}

export default Opinion