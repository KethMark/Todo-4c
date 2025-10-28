import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  const res = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt))

  return NextResponse.json(res)
}

export async function POST(req: Request) {
  try {

    const { name, age, email, gender } = await req.json();

    await db
      .insert(usersTable)
      .values({ name, age, email, gender });
    
    return NextResponse.json({text: "Todo data has been created."});

  } catch (error) {
    console.error("Unable to create a Todo:", error);
    return NextResponse.json({ error: "Failed to create Todo" },{ status: 500 });
  }
}