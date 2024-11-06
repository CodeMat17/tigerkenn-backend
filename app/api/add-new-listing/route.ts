import { supabaseService } from "@/utils/supabase/service";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Configure Cloudinary
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

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const img = formData.get("img") as Blob;
    const desc = formData.get("desc") as string;
    const beds = parseInt(formData.get("beds") as string);
    const baths = parseInt(formData.get("baths") as string);
    const sqm = parseInt(formData.get("sqm") as string);
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const slug = formData.get("slug") as string;
    const fenced = formData.get("fenced") === "true";
    const gate = formData.get("gate") === "true";
    const files = formData.getAll("files") as File[];

    // validate the required fields
    if (
      !title ||
      !location ||
      !img ||
      !desc ||
      !sqm ||
      !price ||
      !category ||
      !status ||
      !slug
    ) {
      return NextResponse.json(
        { error: "Please enter the required fields." },
        { status: 400 }
      );
    }

    // Upload main image to Cloudinary
    const imgBytes = await img.arrayBuffer();
    const imgBuffer = Buffer.from(imgBytes);

    const imgResult = await new Promise<CloudinaryUploadResult>(
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
        uploadStream.end(imgBuffer);
      }
    );

    // Upload additional images to Cloudinary (up to 4 images)
    let uploadImages: string[] | null = null
    if (files.length > 0) {
    uploadImages =  await Promise.all(
        files.slice(0, 4).map(async (file) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          return new Promise<CloudinaryUploadResult>((resolve, reject) => {
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
          }).then((result) => result.secure_url);
        })
      );
    }


    // Insert data into Supabase
    const { error } = await supabaseService
      .from("listings")
      .insert({
        title,
        location,
        img: imgResult.secure_url,
        other_imgs: uploadImages,
        beds,
        baths,
        sqm,
        price,
        desc,
        category,
        status,
        slug,
        fenced,
        gate,
      })
      .select();

    if (error) {
      throw new Error(error.message);
    }

    // Revalidate paths to reflect new data
    revalidatePath("/admin/listings");
    revalidatePath("/listings");

    return NextResponse.json(
      { message: "Listing added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to upload or insert data" },
      { status: 500 }
    );
  }
}
