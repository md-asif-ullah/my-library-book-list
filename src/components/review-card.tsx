import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    if (rating >= i) {
      stars.push(<IoIosStar key={i} className="text-[#facc15] text-xl" />);
    } else if (rating >= i - 0.5) {
      stars.push(<IoIosStarHalf key={i} className="text-[#facc15] text-xl" />);
    } else {
      stars.push(
        <IoIosStarOutline key={i} className="text-[#facc15] text-xl" />
      );
    }
  }

  return <div className="flex">{stars}</div>;
};

const ReviewCard = ({ rating }: { rating: number }) => {
  return <StarRating rating={rating} />;
};

export default ReviewCard;
