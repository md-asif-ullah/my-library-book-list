import db from "../../../../lib/ConnectToDB";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { userSchema } from "../../../../db/userSchema";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const hashPassword = bcrypt.hashSync(data.password, 10);

    const user = await db
      .insert(userSchema)
      .values({
        name: data.name,
        email: data.email,
        password: hashPassword,
      })
      .returning({
        id: userSchema.id,
        name: userSchema.name,
        email: userSchema.email,
      })
      .execute();

    return NextResponse.json(
      { message: "User registered successfully!", payload: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
