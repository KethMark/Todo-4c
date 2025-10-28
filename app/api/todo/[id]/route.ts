import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    await db
      .delete(usersTable)
      .where(eq(usersTable.id, id));

    return NextResponse.json({ text: "Todo has been deleted", id });
  } catch (error) {
    console.error("Unable to delete Todo", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const { name, age, email, gender, completed } = await req.json();

    await db
      .update(usersTable)
      .set({
        name,
        age,
        email,
        gender,
        completed
      })
      .where(eq(usersTable.id, id))

    return NextResponse.json({text: "Student has been Updated.", id});
    
  } catch (error) {
    console.error("Unable to update Student:", error);
    return NextResponse.json({ error: "Failed to update Student." },{ status: 500 });
  }
}