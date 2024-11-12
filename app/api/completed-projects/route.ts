import { supabaseService } from "@/utils/supabase/service";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const img = formData.get("img") as File | null;

    if (!id || !title || !desc) {
      return NextResponse.json(
        { error: "All the fields are required" },
        { status: 400 }
      );
    }

    let newImgUrl: string | null = null;

    // Check if a new image file is provided
    if (img) {
      // Upload new image to Cloudinary
      const bytes = await img.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "tigerkenn-homes",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as CloudinaryUploadResult);
              }
            }
          );
          uploadStream.end(buffer);
        }
      );

      newImgUrl = uploadResult.secure_url; // Set the new image URL
    }

    if (img) {
      // Update Supabase with img
      const { error: updateError } = await supabaseService
        .from("completed")
        .update({
          title,
          desc,
          imgUrl: newImgUrl,
        })
        .eq("id", id)
        .select();

      if (updateError) {
        return NextResponse.json(updateError);
      }
    } else {
      // Update Supabase without img
      const { error } = await supabaseService
        .from("completed")
        .update({
          title,
          desc,
        })
        .eq("id", id)
        .select();

      if (error) {
        return NextResponse.json(error);
      }
    }

    revalidatePath(`/completed-projects`, "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading project:", error);
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 }
    );
  }
}
