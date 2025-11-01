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
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, age, email, gender, completed } = await req.json();

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== id) {
      return NextResponse.json({ error: "Email already exists." },{ status: 409 } );
    }

    await db
      .update(usersTable)
      .set({
        name,
        age,
        email,
        gender,
        completed
      })
      .where(eq(usersTable.id, id));

    return NextResponse.json({ text: "Todo has been Updated.", id });
    
  } catch (error) {
    console.error("Unable to update Todo:", error);
    return NextResponse.json({ error: "Failed to update Todo." },{ status: 400 });
  }
}
