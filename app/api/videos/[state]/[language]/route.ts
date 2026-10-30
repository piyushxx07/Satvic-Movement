import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const videoFiles: Record<string, Record<string, string>> = {
  assam: { hindi: "Videos/States/Assam/Hindi/Hinidi-Assamese.mp4", assamese: "Videos/States/Assam/Assamese/Assamese.mp4" },
  gujarat: { hindi: "Videos/States/Gujarat/Hindi/Hindi-Gujarati.mp4", gujarati: "Videos/States/Gujarat/Gujarati/Gujarati.mp4" },
  karnataka: { hindi: "Videos/States/Karnataka/Hindi/Hindi-Kannada.mp4", kannada: "Videos/States/Karnataka/Kannada/Kannada.mp4" },
  kerala: { hindi: "Videos/States/Kerala/Hindi/Hindi-Malayalam.mp4", malayalam: "Videos/States/Kerala/Malayalam/Malayalam.mp4" },
  maharashtra: { hindi: "Videos/States/Maharashtra/Hindi/Hindi-Marathi.mp4", marathi: "Videos/States/Maharashtra/Marathi/Marathi.mp4" },
  odisha: { hindi: "Videos/States/Odisha/Hindi/Hindi-Odia.mp4", odia: "Videos/States/Odisha/Odia/Odia.mp4" },
  punjab: { hindi: "Videos/States/Punjab/Hindi/Hindi-Punjabi.mp4", punjabi: "Videos/States/Punjab/Punjabi/Punjabi.mp4" },
  tamilnadu: { hindi: "Videos/States/Tamil Nadu/Hindi/Hindi-Tamil.mp4", tamil: "Videos/States/Tamil Nadu/Tamil/Tamil.mp4" },
  telangana: { hindi: "Videos/States/Telangana/Hindi/Hindi-Telugu.mp4", telugu: "Videos/States/Telangana/Telugu/Telugu.mp4" },
  westbengal: { hindi: "Videos/States/West Bengal/Hindi/Hindi-Bengali.mp4", bengali: "Videos/States/West Bengal/Bengali/Bengali.mp4" },
};

type RouteContext = { params: Promise<{ state: string; language: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { state, language } = await params;
  const relativePath = videoFiles[state.toLowerCase()]?.[language.toLowerCase()];
  if (!relativePath) return new Response("Video not found", { status: 404 });

  const filePath = path.join(process.cwd(), relativePath);
  let fileSize: number;
  let modifiedAt: Date;
  try {
    const fileInfo = await stat(filePath);
    fileSize = fileInfo.size;
    modifiedAt = fileInfo.mtime;
  } catch {
    return new Response("Video not found", { status: 404 });
  }

  const etag = `W/"${fileSize.toString(16)}-${modifiedAt.getTime().toString(16)}"`;
  const cacheControl = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";
  if (!request.headers.has("range") && request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, "Last-Modified": modifiedAt.toUTCString(), "Cache-Control": cacheControl },
    });
  }

  const headers = new Headers({
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": cacheControl,
    ETag: etag,
    "Last-Modified": modifiedAt.toUTCString(),
  });
  const rangeHeader = request.headers.get("range");

  if (!rangeHeader) {
    headers.set("Content-Length", String(fileSize));
    return new Response(Readable.toWeb(createReadStream(filePath)) as ReadableStream, { headers });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
  if (!match) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${fileSize}` } });

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Math.min(Number(match[2]), fileSize - 1) : fileSize - 1;
  if (start >= fileSize || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${fileSize}` } });
  }

  headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream, {
    status: 206,
    headers,
  });
}
