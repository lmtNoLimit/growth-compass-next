import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import { Assessment } from "@/lib/models";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const assessments = await Assessment.find({ userId: session.user.id }).sort({ date: -1 });

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, scores, date } = await req.json();

    if (!name || !scores) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newAssessment = await Assessment.create({
      userId: session.user.id,
      name,
      scores,
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json({ assessment: newAssessment }, { status: 201 });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ message: "Missing assessment ID" }, { status: 400 });
    }

    await connectDB();

    const deleted = await Assessment.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deleted) {
      return NextResponse.json({ message: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Assessment deleted" });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
