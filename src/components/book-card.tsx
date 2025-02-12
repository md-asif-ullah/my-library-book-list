import Image from "next/image";
import ReviewCard from "./review-card";

type book = {
  book: BookType;
};

function BookCard({ book }: book) {
  const { name, price, image, rating, writer } = book;

  return (
    <div
      className={`border border-[#e2e8f0] group hover:border-[#f8a927] transition duration-300 bg-white rounded-lg p-3 cursor-pointer`}
    >
      <Image
        src={image}
        alt={`book-image`}
        width={300}
        height={300}
        priority
        className="h-[255px] w-full lg:h-[210px] object-cover rounded-md"
      />
      <h3 className="text-black text-xl tracking-wide font-bold mt-3">
        {name}
      </h3>
      <div className=" bottom-2 space-y-1">
        <h3 className="text-[#747272] mt-2">{writer}</h3>
        <ReviewCard rating={rating} />

        <p className="text-black text-2xl font-medium">${price}</p>
      </div>
    </div>
  );
}

export default BookCard;
