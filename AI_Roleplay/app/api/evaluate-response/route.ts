// app/api/evaluate-response/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface EvaluationRequest {
  question: string;
  answer: string;
  expectedKeywords: string[];
  questionType: string;
  questionLevel: string;
}

interface EvaluationResponse {
  score: number;
  feedback: string;
}

// Type guard function to validate the request body
function isEvaluationRequest(body: any): body is EvaluationRequest {
  return (
    typeof body.question === 'string' &&
    typeof body.answer === 'string' &&
    Array.isArray(body.expectedKeywords) &&
    body.expectedKeywords.every((kw: any) => typeof kw === 'string') &&
    typeof body.questionType === 'string' &&
    typeof body.questionLevel === 'string'
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!isEvaluationRequest(body)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const {
      question,
      answer,
      expectedKeywords,
      questionType,
      questionLevel
    } = body;

    // Check for DeepSeek API key
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('❌ DEEPSEEK_API_KEY not configured');
      throw new Error('DeepSeek API key not configured');
    }

    const prompt = `
      Evaluate this interview response and provide a score (0-100) and constructive feedback.
      
      QUESTION: ${question}
      TYPE: ${questionType}
      EXPECTED LEVEL: ${questionLevel}
      EXPECTED KEYWORDS: ${expectedKeywords.join(', ')}
      
      CANDIDATE'S ANSWER: ${answer}
      
      Evaluation criteria:
      1. Relevance to question (30%)
      2. Depth and detail of response (30%)
      3. Clarity and structure (20%)
      4. Demonstration of skills/experience (20%)
      
      Consider the question type and level when evaluating.
      
      Return ONLY valid JSON in this format:
      {
        "score": number (0-100),
        "feedback": string (constructive feedback)
      }
    `;

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview evaluator. Return ONLY valid JSON, no other text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No evaluation generated');
    }

    // Clean and parse response
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid JSON format in response');
    }

    const parsed: EvaluationResponse = JSON.parse(jsonMatch[0]);
    
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Error evaluating response:', error);
    
    // Fallback evaluation
    try {
      const body = await req.json();
      
      if (!body || typeof body !== 'object') {
        throw new Error('Invalid request body');
      }
      
      const fallbackAnswer = 'answer' in body && typeof body.answer === 'string' 
        ? body.answer 
        : '';
      
      const fallbackKeywords = 'expectedKeywords' in body && Array.isArray(body.expectedKeywords)
        ? body.expectedKeywords.filter((kw: any) => typeof kw === 'string')
        : [];
      
      const keywordMatches = fallbackKeywords.filter((keyword: string) => 
        fallbackAnswer.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      const baseScore = Math.min(100, (keywordMatches / Math.max(1, fallbackKeywords.length)) * 100);
      const lengthBonus = Math.min(20, fallbackAnswer.length / 5); // Up to 20 points for length
      const structureBonus = fallbackAnswer.split('.').length > 2 ? 10 : 0; // Bonus for structured answer
      
      const finalScore = Math.min(100, baseScore + lengthBonus + structureBonus);
      
      return NextResponse.json({
        score: Math.round(finalScore),
        feedback: finalScore > 70 ? 
          "Good answer with relevant details. Consider providing more specific examples from your experience." :
          finalScore > 40 ?
          "Try to be more specific and provide concrete examples from your background. Expand on your thought process." :
          "Please provide a more detailed answer that addresses the question directly with specific examples."
      });
    } catch (parseError) {
      console.error('Fallback evaluation error:', parseError);
      return NextResponse.json({
        score: 50,
        feedback: "We encountered an error evaluating your response. Please try again with a more detailed answer."
      }, { status: 200 });
    }
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  );
}