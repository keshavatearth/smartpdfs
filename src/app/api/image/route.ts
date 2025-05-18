import dedent from "dedent";
import { geminiModel } from "@/lib/ai";
import { ImageGenerationResponse } from "@/lib/summarize";
import { awsS3Client } from "@/lib/s3client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  const json = await req.json();
  const text = "text" in json ? json.text : "";

  const start = new Date();

  const prompt = dedent`
    I'm going to give you a short summary of what is in a PDF. I need you to create an image that captures the essence of the content.
    
    The image should be one that looks good as a hero image on a blog post or website. It should not include any text.

    Here is the summary:

    ${text}
  `;

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const imageDescription = response.text();

  // Note: Since Gemini doesn't generate images directly, we'll need to implement
  // a different image generation service or use a placeholder image
  const placeholderImageUrl = "https://placehold.co/1280x720";

  const end = new Date();
  console.log(
    `Image generation took ${end.getTime() - start.getTime()}ms`,
  );

  return Response.json({
    url: placeholderImageUrl,
  } as ImageGenerationResponse);
}

export const runtime = "edge";