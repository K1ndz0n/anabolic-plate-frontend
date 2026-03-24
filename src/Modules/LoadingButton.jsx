import { BeatLoader } from "react-spinners";
import { useState } from "react";

function LoadingButton({ ref, className, text, disabled, onClick }) {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = async () => {
        setIsClicked(true);

        if (onClick) {
            await onClick(); 
        }

        setIsClicked(false);
    };

    return(
        <button
            ref={ref}
            className={className} 
            disabled={disabled || isClicked} 
            onClick={handleClick}>
            {isClicked ? <BeatLoader color="white" size={8}/> : text}
        </button>
    )
}

export default LoadingButton;