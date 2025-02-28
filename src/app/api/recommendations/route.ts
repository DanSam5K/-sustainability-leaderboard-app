import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ImpactMetric, User } from '@/types';

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
      
      // Return fallback recommendations with a note about the missing API key
      return NextResponse.json({
        recommendations: `
- Goal: Reduce water usage
  - Target: Save 20 liters of water per day
  - Impact: Conserve a valuable resource and reduce water bills
  - Points: 100 points for meeting weekly targets

- Goal: Minimize single-use plastics
  - Target: Avoid 5 single-use plastic items per week
  - Impact: Reduce plastic pollution in oceans and landfills
  - Points: 150 points for using reusable alternatives

- Goal: Lower energy consumption
  - Target: Reduce energy usage by 10% this month
  - Impact: Decrease carbon emissions and save on electricity costs
  - Points: 200 points for meeting the monthly goal
        `,
        apiKeyMissing: true,
        message: 'OpenAI API key is not configured. Please add a valid API key to your .env.local file.'
      });
    }

    // Check if the API key is valid (it should start with 'sk-')
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      return NextResponse.json({
        recommendations: `
- Goal: Reduce water usage
  - Target: Save 20 liters of water per day
  - Impact: Conserve a valuable resource and reduce water bills
  - Points: 100 points for meeting weekly targets

- Goal: Minimize single-use plastics
  - Target: Avoid 5 single-use plastic items per week
  - Impact: Reduce plastic pollution in oceans and landfills
  - Points: 150 points for using reusable alternatives

- Goal: Lower energy consumption
  - Target: Reduce energy usage by 10% this month
  - Impact: Decrease carbon emissions and save on electricity costs
  - Points: 200 points for meeting the monthly goal
        `,
        apiKeyInvalid: true,
        message: "The OpenAI API key appears to be invalid. It should start with 'sk-'. Please check your .env.local file."
      });
    }

    const { user, metrics } = await request.json();
    
    if (!user || !metrics) {
      return NextResponse.json(
        { error: 'User and metrics data are required' },
        { status: 400 }
      );
    }

    // Prepare user data for the AI
    const userData = {
      points: user.points || 0,
      metrics: metrics.reduce((acc: Record<string, number>, metric: ImpactMetric) => {
        acc[metric.category] = (acc[metric.category] || 0) + metric.value;
        return acc;
      }, {}),
      recentActivities: metrics
        .sort((a: ImpactMetric, b: ImpactMetric) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5)
        .map((m: ImpactMetric) => ({
          category: m.category,
          value: m.value,
          description: m.description,
        })),
    };

    // Create prompt for OpenAI
    const prompt = `
      Based on this user's sustainability data, suggest 3 personalized goals that would help them improve their environmental impact.
      
      User Data:
      - Total Points: ${userData.points}
      - Impact Metrics:
        ${Object.entries(userData.metrics)
          .map(([category, value]) => `- ${category}: ${value} ${getUnit(category)}`)
          .join('\n        ')}
      
      Recent Activities:
      ${userData.recentActivities
        .map(
          (activity: { category: string; value: number; description?: string }) =>
            `- ${activity.description || `${activity.value} ${getUnit(activity.category)} of ${activity.category}`}`
        )
        .join('\n      ')}
      
      Provide 3 specific, actionable goals that:
      1. Are realistic and achievable
      2. Build on the user's current activities
      3. Address areas where they could improve
      4. Include a measurable target
      
      Format each goal as:
      - Goal: [Short goal title]
      - Target: [Specific measurable target]
      - Impact: [Environmental impact]
      - Points: [Points they would earn]
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI sustainability coach that provides personalized environmental goals based on user activity data.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Parse the response to extract goals
    const goalsText = response.choices[0].message.content;
    
    // Return the recommendations
    return NextResponse.json({
      recommendations: goalsText,
    });
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'An error occurred while generating recommendations.';
    let apiKeyIssue = false;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'The OpenAI API key is invalid or missing. Please check your .env.local file and add a valid API key.';
      apiKeyIssue = true;
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'The OpenAI API rate limit has been reached. Please try again in a few moments.';
      apiKeyIssue = true;
    } else if (error.message?.includes('insufficient_quota')) {
      errorMessage = 'Your OpenAI API quota has been exceeded. Please check your OpenAI account or use a different API key.';
      apiKeyIssue = true;
    } else if (error.message?.includes('invalid_request_error')) {
      errorMessage = 'There was an issue with the request to OpenAI. Please check your API key and try again.';
      apiKeyIssue = true;
    }
    
    // Provide fallback recommendations in case of error
    return NextResponse.json({
      recommendations: `
- Goal: Reduce water usage
  - Target: Save 20 liters of water per day
  - Impact: Conserve a valuable resource and reduce water bills
  - Points: 100 points for meeting weekly targets

- Goal: Minimize single-use plastics
  - Target: Avoid 5 single-use plastic items per week
  - Impact: Reduce plastic pollution in oceans and landfills
  - Points: 150 points for using reusable alternatives

- Goal: Lower energy consumption
  - Target: Reduce energy usage by 10% this month
  - Impact: Decrease carbon emissions and save on electricity costs
  - Points: 200 points for meeting the monthly goal
      `,
      error: errorMessage,
      apiKeyIssue
    });
  }
}

// Helper function to get the unit for a category
function getUnit(category: string): string {
  switch (category) {
    case 'water':
      return 'L';
    case 'energy':
      return 'kWh';
    case 'waste':
      return 'kg';
    case 'transport':
      return 'kg CO₂';
    default:
      return 'units';
  }
} 