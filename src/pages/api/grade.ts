import type { NextApiRequest, NextApiResponse } from "next";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import fs from "node:fs";
import path from "node:path";
import pdf from "pdf-parse";
import formidable from "formidable"; // 🚨 important
import {
  messages,
  ResponseData,
  ResponseSchema,
  sanitizeCompletion,
} from "@/prompts/grade";

export const config = {
  api: {
    bodyParser: false, // 🚨 important
  },
  maxDuration: 60,
};

function isMultipartFormData(req: NextApiRequest) {
  return (
    req.method === "POST" &&
    req.headers["content-type"]?.includes("multipart/form-data")
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>,
) {
  try {
    if (!["POST", "GET"].includes(req.method || "")) {
      res.status(404).json({ error: "Not Found" });
      return;
    }

    let pdfBuffer: Buffer;

    if (isMultipartFormData(req)) {
      const form = formidable({ multiples: false });

      // 🔥 Parse form data properly
      const [, files] = await form.parse(req);

      const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;
      if (!file || typeof file === 'string') {
        throw new Error("No resume file uploaded");
      }

      // Read the uploaded file
      pdfBuffer = await fs.promises.readFile(file.filepath);
    } else {
      const { url } = req.query;
      if (!url || typeof url !== "string") {
        throw new Error("You must provide a PDF file or URL");
      }

      if (url.startsWith("public")) {
        pdfBuffer = fs.readFileSync(path.join(process.cwd(), url));
        res.setHeader("Content-Location", url);
        res.setHeader(
          "Cache-Control",
          "public, max-age=604800, stale-while-revalidate=604800"
        );
      } else {
        pdfBuffer = Buffer.from(
          await fetch(url).then((response) => response.arrayBuffer())
        );
      }
    }

    const parsed = await pdf(pdfBuffer);

    const completion = await generateObject({
      model: google("gemini-1.5-pro"),
      temperature: 0,
      messages: messages(parsed, pdfBuffer),
      schema: ResponseSchema,
    });

    if (!completion) {
      throw new Error(
        "Could not complete the call to the artificial intelligence"
      );
    }

    const sanitized = sanitizeCompletion(completion);

    res.status(200).json(sanitized);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "Unexpected error" });
  }
}
