"use client";

import BookCard from "@/components/book-card";
import BookSidebar from "@/components/Book/bookSidebar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";

const Book = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [books, setBooks] = useState([]);

  const [mobileFilter, setMobileFilter] = useState(false);
  const [searchParams, setSearchParams] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "",
  });

  const [sortBy, setSortBy] = useState("");

  // Use effect for fetching books with searchParams and sortBy
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setIsError(null);

      const queryParams = new URLSearchParams();

      if (searchParams.category)
        queryParams.append("category", searchParams.category);
      if (searchParams.minPrice)
        queryParams.append("minPrice", searchParams.minPrice);
      if (searchParams.maxPrice)
        queryParams.append("maxPrice", searchParams.maxPrice);
      if (searchParams.rating)
        queryParams.append("rating", searchParams.rating);
      if (sortBy) queryParams.append("sort", sortBy);

      try {
        const res = await axios.get(`/api/book?${queryParams.toString()}`);

        if (res.data) {
          setBooks(res.data.payload || []);
        } else {
          throw new Error(res.data.message);
        }
      } catch (err: any) {
        setIsError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams, sortBy]);

  return (
    <div className="flex bg-white h-full min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-full lg:sticky lg:w-1/5 transition-transform lg:transform-none transform ${
          mobileFilter ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <BookSidebar
          setMobileFilter={setMobileFilter}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5">
        {/* Sort & Filter Button */}
        <div className="mt-10 lg:mt-0">
          <button
            onClick={() => setMobileFilter(!mobileFilter)}
            className="inline-flex items-center gap-4 rounded-full border border-default-200 px-4 py-2.5 text-sm text-default-950 transition-all lg:hidden mb-5 xl:px-5"
            type="button"
          >
            Filter
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 7h-9"></path>
              <path d="M14 17H5"></path>
              <circle cx="17" cy="17" r="3"></circle>
              <circle cx="7" cy="7" r="3"></circle>
            </svg>
          </button>
        </div>

        {/* Sorting Section */}
        <section className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:justify-between items-center bg-white md:px-20 mt-10 z-0">
          <p className="text-lg font-semibold text-gray-800">
            {books.length} books found
          </p>
          <div className="flex items-center gap-3">
            <Label className="text-gray-700 text-sm font-medium">Sort By</Label>
            <Select onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-44 border border-gray-300 rounded-md py-2 px-3 text-gray-700 bg-white">
                <SelectValue placeholder="Select Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Price: Low to High</SelectItem>
                <SelectItem value="desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Book List */}
        {isLoading ? (
          "loading ..."
        ) : isError ? (
          "Something went wrong! Please try again."
        ) : (
          <div className="grid xl:grid-cols-4 lg:ml-20 md:grid-cols-2 gap-5 mt-10">
            {books?.map((book: BookType) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;
