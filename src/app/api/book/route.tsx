import { desc, eq, and, gte, lte, asc } from "drizzle-orm";
import { bookTable } from "@/db";
import cloudinary from "@/lib/CloudinaryConfig";
import db from "@/lib/ConnectToDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const writer = formData.get("writer") as string;
    const rating = formData.get("rating") as string;

    // Validate required fields
    if (!name || !category || !price || !writer || !rating) {
      return NextResponse.json(
        { message: "All fields are required and must be valid" },
        { status: 400 }
      );
    }

    if (!image || !(image instanceof File)) {
      throw new Error("Invalid image file");
    }

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
        name,
        category,
        price: Number(price),
        writer,
        rating: Number(rating),
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
    const category = searchParams.get("category");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const rating = searchParams.get("rating")
      ? parseFloat(searchParams.get("rating")!)
      : undefined;
    const sort = searchParams.get("sort");

    // Base query
    let query: any = db.select().from(bookTable);

    const whereConditions = [];

    if (category) whereConditions.push(eq(bookTable.category, category));
    if (rating !== undefined)
      whereConditions.push(gte(bookTable.rating, rating));

    if (maxPrice !== undefined) {
      whereConditions.push(
        and(gte(bookTable.price, minPrice), lte(bookTable.price, maxPrice))
      );
    } else {
      whereConditions.push(gte(bookTable.price, minPrice));
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

    // Explicitly type the query result
    const books: any[] = await query.execute();

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
