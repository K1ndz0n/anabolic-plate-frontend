import MiniThumbnail from "./MiniThumbnail"

function MiniThumbnailPanel ({ data, labelText}) {
    const thumbnails = data.items?.map(d => <MiniThumbnail key={d.recipeId} thumbnail={d} />)

    return (
        <div className="miniThumbnailsPanel">
            <h2>{labelText}</h2>
            <div className="miniThumbnails">   
                {thumbnails}
            </div>
        </div>

    );
}

export default MiniThumbnailPanel