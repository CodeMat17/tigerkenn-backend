import { supabaseService } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { id, gate } = await req.json();

  // validate
  if (!id ) {
    return NextResponse.json(
      { error: "ERROR!" },
      { status: 400 }
    );
  }

  // update record in Supabase
  const { data, error } = await supabaseService
    .from("listings")
    .update({ gate })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating gate record:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/listings", "layout");

  return NextResponse.json({ data }, { status: 200 });
}
