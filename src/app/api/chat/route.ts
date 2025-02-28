import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with error handling
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// System prompt to define the eco-chatbot's behavior
const SYSTEM_PROMPT = `
You are EcoBot, an AI assistant specialized in sustainability and environmental topics.
Your purpose is to help students understand environmental issues, provide eco-friendly tips,
and suggest sustainable actions they can take in their daily lives.

When responding:
1. Be informative but concise
2. Provide practical, actionable advice for students
3. Focus on positive impact and encouragement
4. Include specific facts about environmental impact when relevant
5. Suggest small, achievable actions that students can take
6. Relate answers to the sustainability metrics tracked in the app: water saved, energy saved, waste reduced, and CO₂ avoided

Always maintain a friendly, encouraging tone and avoid being judgmental.
`;

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json({
        message: "I'm currently unable to provide a response as my connection to OpenAI is not configured. Please add a valid OpenAI API key to your .env.local file.",
      });
    }

    // Check if the API key is valid (it should start with 'sk-')
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      return NextResponse.json({
        message: "The OpenAI API key appears to be invalid. It should start with 'sk-'. Please check your .env.local file and add a valid API key.",
      });
    }

    const { messages } = await request.json();

    // Add system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Return the response
    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    // Provide a more helpful error message
    let errorMessage = 'Sorry, I encountered an error. Please try again later.';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'The OpenAI API key is invalid or missing. Please check your .env.local file and add a valid API key.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'The OpenAI API rate limit has been reached. Please try again in a few moments.';
    } else if (error.message?.includes('insufficient_quota')) {
      errorMessage = 'Your OpenAI API quota has been exceeded. Please check your OpenAI account or use a different API key.';
    } else if (error.message?.includes('invalid_request_error')) {
      errorMessage = 'There was an issue with the request to OpenAI. Please check your API key and try again.';
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 200 } // Return 200 so the frontend can display the error message
    );
  }
} 