"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosStar } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface IFormInput {
  minPrice: string;
  maxPrice: string;
}
interface Props {
  categoryText: string[];
  setMobileFilter: (value: boolean) => void;
  searchParams: {
    category: string;
    minPrice: string;
    maxPrice: string;
    rating: string;
  };
  setSearchParams: Dispatch<
    SetStateAction<{
      category: string;
      minPrice: string;
      maxPrice: string;
      rating: string;
      sort: string;
    }>
  >;
}

function BookSidebar({
  categoryText,
  setSearchParams,
  searchParams,
  setMobileFilter,
}: Props) {
  const router = useRouter();

  // Function to handle category
  const handleCategory = (category: string) => {
    setSearchParams((prevParams) => {
      const currentCategories = prevParams.category
        ? prevParams.category.split(",")
        : [];
      const isCategoryPresent = currentCategories.includes(category);

      const newCategories = isCategoryPresent
        ? currentCategories.filter((cat) => cat !== category)
        : [...currentCategories, category];

      return {
        ...prevParams,
        category: newCategories.join(","),
      };
    });
  };

  // Function to handle price
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
    }));
  };

  // Function to handle rating
  const handleRating = (rating: number) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      rating: rating.toString(),
    }));
  };

  // Update URL when searchParams or sortBy changes
  useEffect(() => {
    const urlParams = new URLSearchParams();
    if (searchParams.category) urlParams.set("category", searchParams.category);
    if (searchParams.minPrice) urlParams.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) urlParams.set("maxPrice", searchParams.maxPrice);
    if (searchParams.rating) urlParams.set("rating", searchParams.rating);

    router.push(`/book?${urlParams.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="fixed left-0 top-0 w-72 bg-white lg:relative xl:border-r-0 border-r border-[#d4dce6] px-10 lg:min-h-screen lg:h-full overflow-auto">
      <div className="flex justify-between items-center border-b pb-3 lg:hidden mt-5">
        <h1 className="text-lg font-semibold">Filter Options</h1>
        <RxCross2
          onClick={() => setMobileFilter(false)}
          className="text-2xl cursor-pointer"
        />
      </div>

      <div className="mt-10">
        <h1 className="text-lg">CATEGORY</h1>

        <div className="mt-5">
          {categoryText.map((text, index) => (
            <div
              onClick={() => handleCategory(text)}
              key={index}
              className="flex items-center mb-4"
            >
              <Checkbox
                className="border-[#94a3b8]"
                checked={searchParams.category.split(",").includes(text)} // Fixed checked state logic
              />
              <label className="ms-2 font-medium text-gray-900">{text}</label>
            </div>
          ))}
        </div>
        <hr className="mt-6 border-[#e2e8f0]" />
        <div className="mt-5">
          <h1 className="text-lg">PRICE</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-between mt-5"
          >
            <input
              type="number"
              {...register("minPrice")}
              placeholder="Min"
              className="max-w-20 text-black pl-2 focus:outline-none border-[#94a3b8] border"
            />
            <input
              type="number"
              {...register("maxPrice")}
              placeholder="Max"
              className="max-w-20 text-black pl-2 focus:outline-none border-[#94a3b8] border"
            />
            <button
              type="submit"
              className="bg-black duration-500 px-4 text-sm py-1 rounded text-white cursor-pointer"
            >
              Apply
            </button>
          </form>
        </div>
        <hr className="mt-6 border-[#94a3b8]" />
        <div className="mt-5">
          <h1 className="text-lg">Rating</h1>
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div
              className="flex space-x-2 items-center mt-5"
              key={index}
              onClick={() => handleRating(rating)}
            >
              <Checkbox
                className="rounded-full mr-2 w-6 h-6 cursor-pointer"
                checked={Number(searchParams.rating) === rating}
              />
              {[...Array(5)].map((_, i) => (
                <IoIosStar
                  key={i}
                  className={`text-xl ${
                    i < rating ? "text-[#facc15]" : "text-[#475569]"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookSidebar;
