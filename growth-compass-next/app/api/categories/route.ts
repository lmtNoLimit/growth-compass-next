import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import { Category } from "@/lib/models";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userCategories = await Category.findOne({ userId: session.user.id });

    if (!userCategories) {
      return NextResponse.json({ categories: [] });
    }

    return NextResponse.json({ categories: userCategories.categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { categories } = await req.json();

    if (!Array.isArray(categories)) {
      return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
    }

    await connectDB();

    const updated = await Category.findOneAndUpdate(
      { userId: session.user.id },
      { categories },
      { new: true, upsert: true }
    );

    return NextResponse.json({ categories: updated.categories });
  } catch (error) {
    console.error("Error updating categories:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
