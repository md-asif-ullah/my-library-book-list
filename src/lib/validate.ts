import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Book name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price must be a positive number"),
  writer: z.string().min(1, "Writer's name is required"),
  rating: z.string().min(1, "Rating is required"),
  image: z.any().refine((file) => file?.length > 0, "Image is required"),
});
