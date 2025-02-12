import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Book name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price must be a positive number"),
  writer: z.string().min(1, "Writer's name is required"),
  rating: z.string().min(1, "Rating is required"),
  image: z.any().refine((file) => file?.length > 0, "Image is required"),
});

export const bookSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  writer: z.string().min(1, "Writer is required"),
  rating: z
    .string()
    .regex(/^[0-5](\.\d{1,2})?$/, "Rating must be between 0 and 5"),
});

export const bookQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid minPrice")
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid maxPrice")
    .optional(),
  rating: z
    .string()
    .regex(/^[0-5](\.\d{1,2})?$/, "Rating must be between 0 and 5")
    .optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});
