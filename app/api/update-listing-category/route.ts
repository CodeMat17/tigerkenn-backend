import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { id, category } = await req.json();

  // validate
  if (!id || !category) {
    return NextResponse.json(
      { error: "ID and category are required." },
      { status: 400 }
    );
  }

  // update record in Supabase
  const { data, error } = await supabaseService
    .from("listings")
    .update({ category })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/listings", "layout");

  return NextResponse.json({ data }, { status: 200 });
}
