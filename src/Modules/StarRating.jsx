

function StarRating({ rating, max = 5 }) {
  const percentage = (rating / max) * 100;

  return (
    <div className="stars">
      <div className="stars-back">★★★★★</div>
      <div
        className="stars-front"
        style={{ width: `${percentage}%` }}
      >
        ★★★★★
      </div>
    </div>
  );
}

export default StarRating;