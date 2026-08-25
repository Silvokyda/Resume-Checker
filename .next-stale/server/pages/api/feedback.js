"use strict";(()=>{var e={};e.id=240,e.ids=[240],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},4193:e=>{e.exports=require("pdf-parse")},3358:e=>{e.exports=import("@ai-sdk/google")},958:e=>{e.exports=import("ai")},9926:e=>{e.exports=import("zod")},7561:e=>{e.exports=require("node:fs")},9411:e=>{e.exports=require("node:path")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},9130:(e,t,a)=>{a.a(e,async(e,i)=>{try{a.r(t),a.d(t,{config:()=>c,default:()=>d,routeModule:()=>u});var o=a(1802),n=a(7153),s=a(6249),r=a(114),l=e([r]);r=(l.then?(await l)():l)[0];let d=(0,s.l)(r,"default"),c=(0,s.l)(r,"config"),u=new o.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/feedback",pathname:"/api/feedback",bundlePath:"",filename:""},userland:r});i()}catch(e){i(e)}})},114:(e,t,a)=>{a.a(e,async(e,i)=>{try{a.r(t),a.d(t,{api:()=>f,config:()=>g,default:()=>h});var o=a(958),n=a(3358),s=a(7561),r=a.n(s),l=a(9411),d=a.n(l),c=a(4193),u=a.n(c),p=a(5662),m=e([o,n,p]);async function h(e,t){try{let a;if(!["POST","GET"].includes(e.method||"")){t.status(404).json({error:"Not Found"});return}if("POST"===e.method&&e.headers["content-type"]?.includes("multipart/form-data")){let t=[];for await(let a of e)t.push(a);a=Buffer.concat(t)}else{let{url:i}=e.query;if(!i||"string"!=typeof i)throw Error("You must provide a PDF file or URL");i.startsWith("public")?(a=r().readFileSync(d().join(process.cwd(),i)),t.setHeader("Content-Location",i),t.setHeader("Cache-Control","public, max-age=604800, stale-while-revalidate=604800")):a=Buffer.from(await fetch(i).then(e=>e.arrayBuffer()))}let i=await u()(a),s=await (0,o.generateObject)({model:(0,n.google)("gemini-3.1-pro-preview"),temperature:0,messages:(0,p.sY)(i,a),schema:p.yX});if(!s)throw Error("Could not complete the call to the artificial intelligence");let l=(0,p.Ao)(s);t.status(200).json(l)}catch(e){console.error(e),t.status(500).json({error:e instanceof Error?e.message:"Unexpected error"})}}[o,n,p]=m.then?(await m)():m;let g={maxDuration:60},f={bodyParser:!1};i()}catch(e){i(e)}})},5662:(e,t,a)=>{a.a(e,async(e,i)=>{try{a.d(t,{Ao:()=>g,sY:()=>p,yX:()=>f});var o=a(9411),n=a.n(o),s=a(7561),r=a.n(s),l=a(9926),d=a(4364),c=e([l]);let f=(l=(c.then?(await c)():c)[0]).z.object({grade:l.z.enum(["S","A","B","C"]),red_flags:l.z.array(l.z.string()),yellow_flags:l.z.array(l.z.string()),key_skills:l.z.array(l.z.string()).min(3).max(10),suitable_job_areas:l.z.array(l.z.string()).length(3),skills_gaps:l.z.array(l.z.string()).length(3),next_steps:l.z.array(l.z.string()).length(3)}),y={grade:"S",yellow_flags:[],red_flags:[],key_skills:["Software engineering","System design","Technical leadership"],suitable_job_areas:["Backend engineering","Platform engineering","Technical leadership"],skills_gaps:["Cloud certifications are not shown","Testing expertise could be clearer","Recent measurable outcomes could be expanded"],next_steps:["Add measurable outcomes to recent roles","Highlight testing and quality practices","Tailor the summary to the target role"]},b={grade:"A",yellow_flags:["Including technologies in the CV title or subtitle makes it look like filler content.","Using a Hotmail email address projects an outdated image.","Including full address in the CV; just city and country if relevant is enough.",`Format and design: The CV doesn't seem to follow the recommended style for the US (like Latex or similar generator). Use the [silver.dev template](${d.h}).`],red_flags:["Including birth date is unnecessary and can lead to bias.","Including irrelevant details ('fluff') in the Mercado Libre section makes the CV less concise and direct."],key_skills:["Software development","Cloud technologies","Problem solving"],suitable_job_areas:["Full-stack engineering","Cloud engineering","Backend engineering"],skills_gaps:["Impact metrics are limited","Testing experience is unclear","The skills section needs stronger prioritisation"],next_steps:["Quantify achievements","Prioritise skills for the target role","Add evidence of testing practices"]},_={grade:"B",yellow_flags:["The skills section is extensive and not specific enough. Adjust it to the job description you're applying for, including the most relevant skills and omitting less important or redundant ones.","'AWS' is mentioned twice in the skills section, which can be perceived as careless or disorganized.","You mention your university studies are incomplete. While not a deal-breaker, I recommend omitting this.","The 'MercadoCat' project could use more detail. Describe the technologies used, the impact it had, and other relevant details that demonstrate your skills and experience."],red_flags:["In the 'About' section, you could mention your achievements and how they align with the company's needs. Words like 'proactive', 'smart' and 'opportunities to grow' don't demonstrate anything - you need to show you're the candidate the company wants.","The experiences listed don't specify concrete achievements, metrics or results obtained in projects. Include metrics that reflect impact, like 'improved loading time by X%' or 'increased backend efficiency by Y%'.","Inconsistent English usage: In the 'EXPERIENCE' section there are minor English errors like 'Particpated' instead of 'Participated'. This can affect professional impression and show lack of attention to detail."],key_skills:["Web development","AWS","Team collaboration"],suitable_job_areas:["Junior full-stack development","Frontend development","Cloud support engineering"],skills_gaps:["Achievements lack metrics","Project detail is limited","Written English needs proofreading"],next_steps:["Add measurable achievements","Expand the strongest project case study","Proofread and tailor the CV"]},w={grade:"C",red_flags:[`Format and design: The CV doesn't seem to follow the recommended style for the US (like Latex or similar generator). Use the [silver.dev template](${d.h}).`,"Possible use of Word or other outdated processor: If the CV was made in Word or with an unprofessional format, it could be grounds for rejection in some cases.","Use of images: US companies consider including images in the CV inappropriate as it's not standard and can create negative perception.","Representing skills with percentages: Showing skills with percentages is discouraged as it doesn't clearly communicate actual competence level and can lead to misinterpretation. A descriptive format is preferred."],yellow_flags:[],key_skills:["Software development","Digital tools","Communication"],suitable_job_areas:["Junior software development","Technical support","Web content operations"],skills_gaps:["Skills lack evidence","Achievements are not quantified","The format is not recruiter-friendly"],next_steps:["Replace skill percentages with evidence","Add quantified accomplishments","Rebuild the CV in a simple one-page format"]},v=`
  Examples of things that are NOT "red_flags" or "yellow_flags" and shouldn't be included in your response:
   - While you mention start and end dates for each experience, you don't specify if the positions were full-time or part-time. If they were full-time, I recommend clarifying to avoid confusion.
   - Including information about your online community in your resume isn't relevant for most US companies. It's recommended to remove it to maintain focus on your professional experience and skills relevant to the position.
   - There's no reverse chronological order in work experience. Always list your work experiences from most recent to oldest to make it easier for recruiters to read. (sometimes candidates have multiple simultaneous experiences)
   - There are some minor formatting and style errors that should be corrected for better presentation. For example, the use of "/" in dates and lack of consistency in punctuation.
   - No mention of experience with agile methodologies or teamwork, which is highly valued in today's market. If you have experience in these areas, include them in your CV.
   - The email uses a public domain like Gmail. It's preferable to use your own domain or a more professional one for better image.
   - The CV filename doesn't follow a professional format. It's recommended to use a format like 'FirstNameLastName-CV.pdf'.
   - Having dates like '2019 - 2021' and '2021 - current' is redundant. You can simplify it to '2019-2021' and '2021-Present'.
`,k=`
  - Format
    - Use a template
      - Google Docs has a good template to start with that's easy to use and aesthetically pleasing
      - US companies prefer CVs in Latex style, you can use a Latex-style builder like Typst and use the [silver.dev template](${d.h}).
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
`,x=e=>`
You are a professional advisor and expert recruiter with extensive experience reviewing and analyzing resumes.
Your goal is to evaluate the content, format and impact of resumes submitted by job applicants.
You provide constructive feedback, a grade from C to A, and S for exceptionally good resumes, along with specific suggestions for improvement.

Don't comment on things you're not 100% sure about, don't assume anything about the resume that isn't in it.
Don't use your own opinion, use the provided guide.
The location of the candidate's past jobs doesn't matter, don't mention it as a flaw or "flag".

Follow this guide:
--- Start of guide ---
${k}
--- End of guide ---

--- Clarifications about the guide ---
- Never say that using Gmail is wrong.
- If the author mentioned in parentheses is "silver" don't mention anything about the template (author: ${e})
--- End of clarifications about the guide ---

You'll also provide two arrays in the response: "red_flags" and "yellow_flags".
"red_flags" are very bad signs and "yellow_flags" are slightly less serious.
Each "red_flag" or "yellow_flag" must be maximum 280 characters, cannot exceed this in any way.

You must also identify the candidate's strongest evidenced skills, recommend exactly three suitable job areas, identify exactly three meaningful skills gaps, and recommend exactly three practical next steps. Base every item only on evidence in the CV. A skills gap may describe missing evidence or an area to develop, but must not claim the candidate lacks a skill unless the CV supports that conclusion.

${v}

The response will be in this EXACT format, replacing the text inside the #, avoid any line breaks and wrap sentences in quotes like this "",
The response must be in English:

{
  "grade": #GRADE#,
  "red_flags": [#red_flag_1#, #red_flag_2#],
  "yellow_flags": [#yellow_flag_1#, #yellow_flag_2#],
  "key_skills": [#skill_1#, #skill_2#, #skill_3#],
  "suitable_job_areas": [#job_area_1#, #job_area_2#, #job_area_3#],
  "skills_gaps": [#gap_1#, #gap_2#, #gap_3#],
  "next_steps": [#next_step_1#, #next_step_2#, #next_step_3#]
}
`,A=`
Please evaluate this resume and provide a grade ranging from C to A, with S for exceptionally good resumes.
Also, offer detailed comments on how the resume can be improved.
Identify the candidate's key skills, exactly three suitable job areas, exactly three potential skills gaps, and exactly three recommended next steps.

The response should be addressed to me, so instead of talking "about the candidate", communicate directly with me to give me advice and must be in English.

Follow this guide:
--- Start of guide ---
${k}
--- End of guide ---

${v}
`;function u(e){return{role:"user",content:[{type:"text",text:A},{type:"file",data:e,mimeType:"application/pdf"}]}}function p(e,t){let a=[{data:r().readFileSync(n().join(process.cwd(),"public/s_resume.pdf")),response:y},{data:r().readFileSync(n().join(process.cwd(),"public/a_resume.pdf")),response:b},{data:r().readFileSync(n().join(process.cwd(),"public/b_resume.pdf")),response:_},{data:r().readFileSync(n().join(process.cwd(),"public/c_resume.pdf")),response:w}].flatMap(({data:e,response:t})=>[u(e),{role:"assistant",content:JSON.stringify(t)}]);return[{role:"system",content:x(e?.info?.Author)},...a,u(t)]}function m(e){return new RegExp(/gmail/i).test(e)}function h(e){return new RegExp(/hotmail/i).test(e)}function g(e){let t={...e.object};return function(e){let t=e.red_flags.findIndex(e=>!h(e)&&m(e)),a=e.yellow_flags.findIndex(e=>!h(e)&&m(e));-1!==t&&(e.red_flags=e.red_flags.splice(t,1)),-1!==a&&(e.yellow_flags=e.yellow_flags.splice(a,1))}(t),t}i()}catch(e){i(e)}})},4364:(e,t,a)=>{a.d(t,{h:()=>i});let i="https://typst.app/app?template=silver-dev-cv&version=1.0.2"},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=9130);module.exports=a})();