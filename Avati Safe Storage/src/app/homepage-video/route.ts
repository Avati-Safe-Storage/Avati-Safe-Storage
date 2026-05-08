import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const videoPath = path.join(process.cwd(), "Public", "Homepage video.mp4");
  const video = await readFile(videoPath);

  return new Response(video, {
    headers: {
      "Content-Type": "video/mp4",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
