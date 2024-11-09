import { supabaseService } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const address = formData.get("address") as string;
    const phone = Number(formData.get("phone")); // Convert phone to a number
    const whatsapp = Number(formData.get("whatsapp")); // Convert WhatsApp to a number
    const hours = formData.get("hours") as string;

    // Validate that phone and WhatsApp are valid numbers
    if (isNaN(phone) || isNaN(whatsapp)) {
      return NextResponse.json(
        { error: "Phone and WhatsApp must be valid numbers" },
        { status: 400 }
      );
    }

    // Validate that no field is missing
    if (
      !id ||
      !title ||
      !subtitle ||
      !address ||
      !phone ||
      !whatsapp ||
      !hours
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update contact information in Supabase
    const { error } = await supabaseService
      .from("contact")
      .update({
        title,
        subtitle,
        address,
        phone,
        whatsapp,
        hours,
      })
      .eq("id", id);

    // Handle any Supabase errors
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Revalidate the contact page to reflect updated information
    revalidatePath(`/contact`, 'layout');

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contact info:", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to update contact information" },
      { status: 500 }
    );
  }
}
