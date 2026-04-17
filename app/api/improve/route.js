export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  try {
    const { text, instruction } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `${text}\n\nتحسين سريع: ${instruction || "اجعله أوضح وأكثر إقناعًا"}`,
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const res = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You improve Arabic landing page marketing copy." },
        { role: "user", content: `Text:\n${text}\n\nInstruction:\n${instruction || "اجعله أوضح وأكثر إقناعًا"}` }
      ],
    });

    return NextResponse.json({
      result: res.choices?.[0]?.message?.content || text
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
