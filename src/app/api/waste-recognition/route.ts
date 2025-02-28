import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with error handling
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json({
        error: 'OpenAI API key is not configured. Please add a valid API key to your .env.local file.',
      }, { status: 500 });
    }

    // Check if the API key is valid (it should start with 'sk-')
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      return NextResponse.json({
        error: "The OpenAI API key appears to be invalid. It should start with 'sk-'. Please check your .env.local file.",
      }, { status: 500 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: `You are an AI waste classification assistant. Analyze the image and:
          1. Identify the type of waste item
          2. Classify it into one of these categories: Recyclable, Compostable, Electronic Waste, Hazardous Waste, or General Waste
          3. Provide specific disposal instructions
          4. Suggest sustainable alternatives if applicable
          5. Include an interesting fact about the environmental impact of this type of waste
          
          Format your response as JSON with the following structure:
          {
            "itemName": "Name of the identified item",
            "category": "Waste category",
            "disposalInstructions": "How to properly dispose of this item",
            "sustainableAlternatives": "Suggestions for more sustainable alternatives",
            "environmentalImpact": "An interesting fact about environmental impact",
            "confidenceLevel": "High/Medium/Low based on your confidence in the identification"
          }
          
          Return ONLY the JSON object with no additional text.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What type of waste is this and how should it be disposed of?' },
            {
              type: 'image_url',
              image_url: {
                detail: 'high',
                url: `data:${imageFile.type};base64,${buffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Extract the response content
    const content = response.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const jsonResponse = JSON.parse(content || '{}');
      return NextResponse.json(jsonResponse);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return NextResponse.json(
        { error: 'Failed to parse waste recognition results' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in waste recognition:', error);
    
    // Provide a more helpful error message
    let errorMessage = 'Failed to analyze waste image';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'The OpenAI API key is invalid or missing. Please add a valid API key to your .env.local file.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'The OpenAI API rate limit has been reached. Please try again in a few moments.';
    } else if (error.message?.includes('insufficient_quota')) {
      errorMessage = 'Your OpenAI API quota has been exceeded. Please check your OpenAI account or use a different API key.';
    } else if (error.message?.includes('invalid_request_error')) {
      errorMessage = 'There was an issue with the request to OpenAI. Please check your API key and try again.';
    } else if (error.message?.includes('model')) {
      errorMessage = 'The GPT-4 Vision model is not available with your current API key. This feature requires access to GPT-4 Vision.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 