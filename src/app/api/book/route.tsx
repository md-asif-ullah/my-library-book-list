import { desc, eq, and, gte, lte, asc } from "drizzle-orm";
import { bookTable } from "@/db";
import cloudinary from "@/lib/CloudinaryConfig";
import db from "@/lib/ConnectToDB";
import { NextRequest, NextResponse } from "next/server";
import { bookQuerySchema, bookSchema } from "@/lib/validate";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    const data = {
      name: formData.get("name"),
      category: formData.get("category"),
      price: formData.get("price"),
      writer: formData.get("writer"),
      rating: formData.get("rating"),
    };

    // Validate input with Zod
    const validatedData = bookSchema.safeParse(data);
    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validatedData.error.format() },
        { status: 400 }
      );
    }

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { message: "Invalid image file" },
        { status: 400 }
      );
    }

    // convert for bufferString and upload in cloudinary
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const uploadedImage = await cloudinary.uploader.upload(
      `data:${image.type};base64,${base64Image}`,
      { folder: "bookLibrary/images" }
    );

    // Insert into database
    const newBook = await db
      .insert(bookTable)
      .values({
        name: validatedData.data.name,
        category: validatedData.data.category,
        price: Number(validatedData.data.price),
        writer: validatedData.data.writer,
        rating: Number(validatedData.data.rating),
        image: uploadedImage.secure_url,
      })
      .returning({ id: bookTable.id, name: bookTable.name })
      .execute();

    return NextResponse.json(
      { message: "Book added successfully!", payload: newBook },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add book", payload: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Convert search params to an object
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query params
    const validatedQuery = bookQuerySchema.safeParse(queryParams);
    if (!validatedQuery.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validatedQuery.error.format() },
        { status: 400 }
      );
    }

    const { category, minPrice, maxPrice, rating, sort } = validatedQuery.data;

    const parsedMinPrice = minPrice ? parseFloat(minPrice) : 0;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;
    const parsedRating = rating ? parseFloat(rating) : undefined;

    // Base query
    let query: any = db.select().from(bookTable);
    const whereConditions = [];

    if (category) whereConditions.push(eq(bookTable.category, category));
    if (parsedRating !== undefined)
      whereConditions.push(gte(bookTable.rating, parsedRating));

    if (parsedMaxPrice !== undefined) {
      whereConditions.push(
        and(
          gte(bookTable.price, parsedMinPrice),
          lte(bookTable.price, parsedMaxPrice)
        )
      );
    } else {
      whereConditions.push(gte(bookTable.price, parsedMinPrice));
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Sorting
    if (sort === "asc") {
      query = query.orderBy(asc(bookTable.price));
    } else if (sort === "desc") {
      query = query.orderBy(desc(bookTable.price));
    }

    // Execute query
    const books = await query.execute();

    return NextResponse.json(
      { message: "Books fetched successfully!", payload: books },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching books", payload: (error as Error).message },
      { status: 500 }
    );
  }
}
