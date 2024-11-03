import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, title, slug } = await req.json();

  // validate
  if (!id || !title || !slug) {
    return NextResponse.json(
      { error: "ID and title are required." },
      { status: 400 }
    );
  }

  // update record in Supabase
  const { data, error } = await supabaseService
    .from("listings")
    .update({ title, slug })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating title:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/listings");
  // redirect('/listings')

  return NextResponse.json({ data }, { status: 200 });
}
