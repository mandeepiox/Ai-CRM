import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    let hfToken = process.env.HF_TOKEN;

    // Fallback: Read directly from .env.local on disk if process.env.HF_TOKEN is not loaded (e.g. server needs restart)
    if (!hfToken) {
      try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8');
          const match = envContent.match(/HF_TOKEN=["']?([^"'\r\n]+)["']?/);
          if (match) {
            hfToken = match[1];
            console.log('Loaded HF_TOKEN directly from .env.local fallback.');
          }
        }
      } catch (err) {
        console.error('Error loading .env.local fallback:', err);
      }
    }

    if (!hfToken) {
      return NextResponse.json(
        { error: 'Hugging Face API token not found. Please set HF_TOKEN in your .env.local file and restart the server.' },
        { status: 500 }
      );
    }

    const hf = new HfInference(hfToken);
    
    // Using a reliable conversational model from Hugging Face
    // mistralai/Mistral-7B-Instruct-v0.2 or meta-llama/Meta-Llama-3-8B-Instruct
    const model = 'meta-llama/Meta-Llama-3-8B-Instruct'; 

    const systemPrompt = `You are an AI sales assistant inside a CRM called Orb CRM. Be concise and helpful. 
Answer questions about contacts, deals, and sales strategy. Keep answers short (2–4 sentences max).`;

    // Hugging Face inference API format
    let out = '';
    for await (const chunk of hf.chatCompletionStream({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 400,
    })) {
      if (chunk.choices && chunk.choices.length > 0) {
        out += chunk.choices[0].delta.content || '';
      }
    }

    return NextResponse.json({ reply: out });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
