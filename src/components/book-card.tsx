import Image from "next/image";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";

type product = {
  product: {
    name: string;
    price: number;
    description: string;
    image: string;
    rating: number;
    _id: string;
  };
};

function BookCard({ product }: product) {
  const { name, price, image, rating, _id } = product;

  return (
    <Link href={`/product/${_id}`}>
      <div
        className={`border border-[#e2e8f0] group hover:border-orange-500 transition duration-300 bg-white rounded-lg p-3 cursor-pointer`}
      >
        <Image
          src={image}
          alt={`book-image`}
          width={300}
          height={300}
          priority
          className="h-[255px] w-full lg:h-[210px] object-cover rounded-md"
        />
        <h3 className="text-white text-2xl tracking-wide font-bold mt-2">
          {name}
        </h3>
        <div className=" bottom-2 space-y-1">
          <div className="inline-flex">
            <i className=" text-[#facc15] mt-1 mr-1">
              <IoIosStar className="" />
            </i>
            <p className="text-black">{rating}</p>
          </div>

          <p className="text-amber-500 text-2xl font-medium">${price}</p>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
