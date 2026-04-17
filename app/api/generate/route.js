export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";

function fallback(prompt) {
  return {
    headline: `حوّل ${prompt} إلى رسالة تسويقية أقوى`,
    subheadline: "هذه نسخة احتياطية سريعة لتبدأ بها فورًا حتى لو لم يكن المفتاح مضافًا بعد.",
    cta: "ابدأ الآن",
    benefits: [
      "صياغة أوضح للفكرة",
      "بداية سريعة لصفحة الهبوط",
      "مناسبة للتعديل والتحسين لاحقًا"
    ]
  };
}

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ result: fallback(prompt) });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const res = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a marketing AI. Return valid JSON only with keys: headline, subheadline, cta, benefits. benefits must be an array of exactly 3 Arabic strings."
        },
        {
          role: "user",
          content: `Create strong Arabic landing page copy for this prompt: ${prompt}`
        }
      ],
    });

    const text = res.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(text);

    return NextResponse.json({
      result: {
        headline: parsed.headline || `حل أقوى لـ ${prompt}`,
        subheadline: parsed.subheadline || "رسالة تسويقية مرتبة وجاهزة للعرض",
        cta: parsed.cta || "ابدأ الآن",
        benefits: Array.isArray(parsed.benefits) && parsed.benefits.length
          ? parsed.benefits.slice(0, 3)
          : ["نتيجة أسرع", "عرض أوضح", "تحويل أعلى"]
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
