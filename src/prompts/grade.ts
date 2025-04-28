import path from "node:path";
import fs from "node:fs";
import { GenerateObjectResult, type CoreMessage } from "ai";
import PdfParse from "pdf-parse";
import { z } from "zod";
import { TYPST_TEMPLATE_URL } from "@/utils";

export type ResponseData = z.infer<typeof ResponseSchema>;

export const ResponseSchema = z.object({
  grade: z.enum(["S", "A", "B", "C"]),
  red_flags: z.array(z.string()),
  yellow_flags: z.array(z.string()),
});

const sResponse: ResponseData = {
  grade: "S",
  yellow_flags: [],
  red_flags: [],
};

const aResponse: ResponseData = {
  grade: "A",
  yellow_flags: [
    "Including technologies in the CV title or subtitle makes it look like filler content.",
    "Using a Hotmail email address projects an outdated image.",
    "Including full address in the CV; just city and country if relevant is enough.",
    `Format and design: The CV doesn't seem to follow the recommended style for the US (like Latex or similar generator). Use the [silver.dev template](${TYPST_TEMPLATE_URL}).`,
  ],
  red_flags: [
    "Including birth date is unnecessary and can lead to bias.",
    "Including irrelevant details ('fluff') in the Mercado Libre section makes the CV less concise and direct.",
  ],
};

const bResponse: ResponseData = {
  grade: "B",
  yellow_flags: [
    "The skills section is extensive and not specific enough. Adjust it to the job description you're applying for, including the most relevant skills and omitting less important or redundant ones.",
    "'AWS' is mentioned twice in the skills section, which can be perceived as careless or disorganized.",
    "You mention your university studies are incomplete. While not a deal-breaker, I recommend omitting this.",
    "The 'MercadoCat' project could use more detail. Describe the technologies used, the impact it had, and other relevant details that demonstrate your skills and experience.",
  ],
  red_flags: [
    "In the 'About' section, you could mention your achievements and how they align with the company's needs. Words like 'proactive', 'smart' and 'opportunities to grow' don't demonstrate anything - you need to show you're the candidate the company wants.",
    "The experiences listed don't specify concrete achievements, metrics or results obtained in projects. Include metrics that reflect impact, like 'improved loading time by X%' or 'increased backend efficiency by Y%'.",
    "Inconsistent English usage: In the 'EXPERIENCE' section there are minor English errors like 'Particpated' instead of 'Participated'. This can affect professional impression and show lack of attention to detail.",
  ],
};

const cResponse: ResponseData = {
  grade: "C",
  red_flags: [
    `Format and design: The CV doesn't seem to follow the recommended style for the US (like Latex or similar generator). Use the [silver.dev template](${TYPST_TEMPLATE_URL}).`,
    "Possible use of Word or other outdated processor: If the CV was made in Word or with an unprofessional format, it could be grounds for rejection in some cases.",
    "Use of images: US companies consider including images in the CV inappropriate as it's not standard and can create negative perception.",
    "Representing skills with percentages: Showing skills with percentages is discouraged as it doesn't clearly communicate actual competence level and can lead to misinterpretation. A descriptive format is preferred.",
  ],
  yellow_flags: [],
};

const NON_FLAGS = `
  Examples of things that are NOT "red_flags" or "yellow_flags" and shouldn't be included in your response:
   - While you mention start and end dates for each experience, you don't specify if the positions were full-time or part-time. If they were full-time, I recommend clarifying to avoid confusion.
   - Including information about your online community in your resume isn't relevant for most US companies. It's recommended to remove it to maintain focus on your professional experience and skills relevant to the position.
   - There's no reverse chronological order in work experience. Always list your work experiences from most recent to oldest to make it easier for recruiters to read. (sometimes candidates have multiple simultaneous experiences)
   - There are some minor formatting and style errors that should be corrected for better presentation. For example, the use of "/" in dates and lack of consistency in punctuation.
   - No mention of experience with agile methodologies or teamwork, which is highly valued in today's market. If you have experience in these areas, include them in your CV.
   - The email uses a public domain like Gmail. It's preferable to use your own domain or a more professional one for better image.
   - The CV filename doesn't follow a professional format. It's recommended to use a format like 'FirstNameLastName-CV.pdf'.
   - Having dates like '2019 - 2021' and '2021 - current' is redundant. You can simplify it to '2019-2021' and '2021-Present'.
`;

const GUIDE = `
  - Format
    - Use a template
      - Google Docs has a good template to start with that's easy to use and aesthetically pleasing
      - US companies prefer CVs in Latex style, you can use a Latex-style builder like Typst and use the [silver.dev template](${TYPST_TEMPLATE_URL}).
    - Creative designs and Word submissions lower your CV's quality and can even be grounds for rejection.
    - Must be one page only.
  - Main content
    - Edit your CV according to the company you're sending it to:
      - Look at LinkedIn profiles of people working at the company and copy them - these are the "winners".
      - Change position names, content, messages and skills to better match what the company is looking for.
      - You want to tell a story that highlights your profile's main strengths.
    - [Recommended] Add an introduction or "about" section that you adapt for each company.
      - This introduction should explicitly or implicitly answer the question "Why should XXX company hire me".
    - Don't include images or profile photos. This is taboo for US companies.
    - Every time you edit the content, run it through Grammarly - typos in the CV are unacceptable.
  - What not to do
    - Create your own templates or use outdated tools like Word.
    - Avoid "spray & pray" strategies (using the same generic CV for all your applications).
    - Add images and photos.
    - Have more than one page.
    - Use a @hotmail email address.
    - Write the CV in Spanish.
    - Have spelling errors.
`;

export const sysPrompt = (author?: string) => `
You are a professional advisor and expert recruiter with extensive experience reviewing and analyzing resumes.
Your goal is to evaluate the content, format and impact of resumes submitted by job applicants.
You provide constructive feedback, a grade from C to A, and S for exceptionally good resumes, along with specific suggestions for improvement.

Don't comment on things you're not 100% sure about, don't assume anything about the resume that isn't in it.
Don't use your own opinion, use the provided guide.
The location of the candidate's past jobs doesn't matter, don't mention it as a flaw or "flag".

Follow this guide:
--- Start of guide ---
${GUIDE}
--- End of guide ---

--- Clarifications about the guide ---
- Never say that using Gmail is wrong.
- If the author mentioned in parentheses is "silver" don't mention anything about the template (author: ${author})
--- End of clarifications about the guide ---

You'll also provide two arrays in the response: "red_flags" and "yellow_flags".
"red_flags" are very bad signs and "yellow_flags" are slightly less serious.
Each "red_flag" or "yellow_flag" must be maximum 280 characters, cannot exceed this in any way.

${NON_FLAGS}

The response will be in this EXACT format, replacing the text inside the #, avoid any line breaks and wrap sentences in quotes like this "",
The response must be in English:

{
  "grade": #GRADE#,
  "red_flags": [#red_flag_1#, #red_flag_2#],
  "yellow_flags": [#yellow_flag_1#, #yellow_flag_2#],
}
`;

export const userPrompt = `
Please evaluate this resume and provide a grade ranging from C to A, with S for exceptionally good resumes.
Also, offer detailed comments on how the resume can be improved.

The response should be addressed to me, so instead of talking "about the candidate", communicate directly with me to give me advice and must be in English.

Follow this guide:
--- Start of guide ---
${GUIDE}
--- End of guide ---

${NON_FLAGS}
`;

function createAssistantResponse(response: ResponseData): CoreMessage {
  return {
    role: "assistant",
    content: JSON.stringify(response),
  };
}

function createInput(data: Buffer): CoreMessage {
  return {
    role: "user",
    content: [
      {
        type: "text",
        text: userPrompt,
      },
      {
        type: "file",
        data,
        mimeType: "application/pdf",
      },
    ],
  };
}

/* Moving the fs.readFileSync call deeper causes an error when reading files */
export function messages(
  parsed: PdfParse.Result,
  pdfBuffer: Buffer,
): CoreMessage[] {
  const trainMessages: CoreMessage[] = [
    {
      data: fs.readFileSync(path.join(process.cwd(), "public/s_resume.pdf")),
      response: sResponse,
    },
    {
      data: fs.readFileSync(path.join(process.cwd(), "public/a_resume.pdf")),
      response: aResponse,
    },
    {
      data: fs.readFileSync(path.join(process.cwd(), "public/b_resume.pdf")),
      response: bResponse,
    },
    {
      data: fs.readFileSync(path.join(process.cwd(), "public/c_resume.pdf")),
      response: cResponse,
    },
  ].flatMap(({ data, response }) => [
    createInput(data),
    createAssistantResponse(response),
  ]);

  return [
    { role: "system", content: sysPrompt(parsed?.info?.Author) },
    ...trainMessages,
    createInput(pdfBuffer),
  ];
}

function hasGmail(flag: string) {
  const r = new RegExp(/gmail/i);
  return r.test(flag);
}

function hasHotmail(flag: string) {
  const r = new RegExp(/hotmail/i);
  return r.test(flag);
}

/**
 * Remove the gmail flag if hotmail is not mentioned to avoid cases like
 * "Don't use hotmail, use gmail"
 */
function removeGmailFlag(data: ResponseData) {
  const idxR = data.red_flags.findIndex((f) => !hasHotmail(f) && hasGmail(f));
  const idxY = data.yellow_flags.findIndex(
    (f) => !hasHotmail(f) && hasGmail(f),
  );

  if (idxR !== -1) {
    data.red_flags = data.red_flags.splice(idxR, 1);
  }

  if (idxY !== -1) {
    data.yellow_flags = data.yellow_flags.splice(idxY, 1);
  }
}

export function sanitizeCompletion(
  completion: GenerateObjectResult<ResponseData>,
): ResponseData {
  const data = { ...completion.object };

  removeGmailFlag(data);

  return data;
}