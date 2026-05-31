import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { error: 'Hugging Face API token not found. Please set HF_TOKEN in your .env.local file.' },
        { status: 500 }
      );
    }

    const hf = new HfInference(process.env.HF_TOKEN);
    
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
