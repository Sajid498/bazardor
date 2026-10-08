
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("API Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
      },
      { status: 502 }
    );
  }
}
