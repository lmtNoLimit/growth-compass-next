import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectDB from "@/lib/db";
import { User, Category } from "@/lib/models";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Create default categories for the new user
    await Category.create({
      userId: newUser._id,
      categories: ["Coding", "Design", "Communication", "Leadership", "Problem Solving"],
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
