// app/api/generate-questions/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Define interfaces
interface QuestionRequest {
  jobTitle: string;
  jobDescription: string;
  companyName?: string;
  experience: string;
  skills: string[];
  resumeText?: string;
  fieldCategory?: string;
  generateFieldSpecific?: boolean;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'domain-specific';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
  fieldRelevant: boolean;
}

// Generate initial questions for interview setup
function generateInitialQuestions(requestData: QuestionRequest): GeneratedQuestion[] {
  const { jobTitle, experience, skills, fieldCategory, jobDescription } = requestData;
  
  const isJunior = experience.includes('0-2') || experience.includes('1-3');
  const isSenior = experience.includes('5+') || experience.includes('8+');
  
  const questions: GeneratedQuestion[] = [];

  // Universal opener - always first
  questions.push({
    id: `intro-${Date.now()}`,
    question: `Tell me about your journey as a ${jobTitle}. What initially motivated you to pursue this career path?`,
    type: 'behavioral',
    difficulty: 'easy',
    category: 'Background & Motivation',
    timeLimit: 180,
    fieldRelevant: true
  });

  // Add field-specific questions based on detected category
  if (fieldCategory?.includes('Government') || fieldCategory?.includes('Civil')) {
    questions.push(
      {
        id: `govt-1-${Date.now()}`,
        question: `How would you handle a situation where public interest conflicts with political pressures in your role as a ${jobTitle}?`,
        type: 'situational',
        difficulty: isSenior ? 'hard' : 'medium',
        category: 'Ethics & Governance',
        timeLimit: 240,
        fieldRelevant: true
      },
      {
        id: `govt-2-${Date.now()}`,
        question: `Describe a policy initiative you would implement to improve public service delivery in your area of expertise.`,
        type: 'domain-specific',
        difficulty: 'medium',
        category: 'Policy & Implementation',
        timeLimit: 220,
        fieldRelevant: true
      }
    );
  } else if (fieldCategory?.includes('Healthcare') || fieldCategory?.includes('Medical')) {
    questions.push(
      {
        id: `medical-1-${Date.now()}`,
        question: `Describe your approach to making critical medical decisions when you have limited time and incomplete patient information.`,
        type: 'situational',
        difficulty: 'medium',
        category: 'Clinical Decision Making',
        timeLimit: 200,
        fieldRelevant: true
      },
      {
        id: `medical-2-${Date.now()}`,
        question: `How do you stay current with medical research and integrate evidence-based practices into your patient care?`,
        type: 'domain-specific',
        difficulty: isJunior ? 'medium' : 'hard',
        category: 'Medical Knowledge',
        timeLimit: 180,
        fieldRelevant: true
      }
    );
  } else if (fieldCategory?.includes('Education')) {
    questions.push(
      {
        id: `education-1-${Date.now()}`,
        question: `How do you adapt your teaching methods to accommodate students with different learning styles and backgrounds?`,
        type: 'situational',
        difficulty: 'medium',
        category: 'Pedagogical Approach',
        timeLimit: 200,
        fieldRelevant: true
      },
      {
        id: `education-2-${Date.now()}`,
        question: `Describe how you would design a curriculum that balances academic rigor with practical real-world application.`,
        type: 'domain-specific',
        difficulty: isSenior ? 'hard' : 'medium',
        category: 'Curriculum Design',
        timeLimit: 220,
        fieldRelevant: true
      }
    );
  } else if (fieldCategory?.includes('Legal')) {
    questions.push(
      {
        id: `legal-1-${Date.now()}`,
        question: `Walk me through your process for researching and building arguments for a complex legal case.`,
        type: 'technical',
        difficulty: 'medium',
        category: 'Legal Research & Analysis',
        timeLimit: 240,
        fieldRelevant: true
      },
      {
        id: `legal-2-${Date.now()}`,
        question: `How do you balance zealous client advocacy with ethical obligations when these might conflict?`,
        type: 'situational',
        difficulty: 'hard',
        category: 'Legal Ethics',
        timeLimit: 200,
        fieldRelevant: true
      }
    );
  } else if (fieldCategory?.includes('Engineering') || fieldCategory?.includes('Technology')) {
    questions.push(
      {
        id: `tech-1-${Date.now()}`,
        question: `Describe your approach to solving complex technical problems. Walk me through your methodology from problem identification to solution implementation.`,
        type: 'technical',
        difficulty: isJunior ? 'medium' : 'hard',
        category: 'Problem Solving & Design',
        timeLimit: 240,
        fieldRelevant: true
      },
      {
        id: `tech-2-${Date.now()}`,
        question: `How do you stay current with rapidly evolving technology trends, and how do you evaluate new technologies for adoption?`,
        type: 'domain-specific',
        difficulty: 'medium',
        category: 'Technology & Innovation',
        timeLimit: 180,
        fieldRelevant: true
      }
    );
  } else {
    // Generic professional questions for other fields
    questions.push(
      {
        id: `professional-1-${Date.now()}`,
        question: `Describe the most challenging project you've worked on as a ${jobTitle}. What made it challenging and how did you overcome those obstacles?`,
        type: 'behavioral',
        difficulty: 'medium',
        category: 'Professional Challenges',
        timeLimit: 200,
        fieldRelevant: true
      },
      {
        id: `professional-2-${Date.now()}`,
        question: `How do you measure success in your role, and what strategies do you use to continuously improve your performance?`,
        type: 'domain-specific',
        difficulty: 'medium',
        category: 'Performance & Growth',
        timeLimit: 180,
        fieldRelevant: true
      }
    );
  }

  // Add skill-based questions if skills provided
  if (skills && skills.length > 0) {
    const primarySkill = skills[0];
    questions.push({
      id: `skills-${Date.now()}`,
      question: `You mentioned ${primarySkill} as one of your key skills. Can you give me a specific example of how you've applied this skill to solve a real problem?`,
      type: 'behavioral',
      difficulty: 'medium',
      category: primarySkill,
      timeLimit: 180,
      fieldRelevant: true
    });
  }

  // Universal professional questions - always include these
  questions.push(
    {
      id: `teamwork-${Date.now()}`,
      question: `Tell me about a time when you had to collaborate with difficult team members or stakeholders. How did you handle the situation?`,
      type: 'behavioral',
      difficulty: 'medium',
      category: 'Interpersonal Skills',
      timeLimit: 180,
      fieldRelevant: false
    },
    {
      id: `situational-${Date.now()}`,
      question: `Imagine you're working on a critical project with a tight deadline, but you discover a potential issue that could impact quality. How would you handle this situation?`,
      type: 'situational',
      difficulty: 'medium',
      category: 'Decision Making',
      timeLimit: 180,
      fieldRelevant: false
    }
  );

  // Leadership question for senior roles
  if (isSenior || jobTitle.toLowerCase().includes('senior') || 
      jobTitle.toLowerCase().includes('lead') || 
      jobTitle.toLowerCase().includes('manager')) {
    questions.push({
      id: `leadership-${Date.now()}`,
      question: `Describe your leadership philosophy and give me an example of how you've mentored or developed team members.`,
      type: 'behavioral',
      difficulty: 'hard',
      category: 'Leadership & Development',
      timeLimit: 240,
      fieldRelevant: false
    });
  }

  return questions.slice(0, 6); // Return first 6 questions for initial interview
}

export async function POST(req: NextRequest) {
  try {
    console.log('📝 Starting initial question generation...');

    const requestData: QuestionRequest = await req.json();
    console.log('Request data:', {
      jobTitle: requestData.jobTitle,
      fieldCategory: requestData.fieldCategory,
      experience: requestData.experience,
      skillsCount: requestData.skills?.length || 0
    });

    const { jobTitle, jobDescription, companyName, experience, skills, fieldCategory } = requestData;

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: jobTitle and jobDescription' },
        { status: 400 }
      );
    }

    let questions: GeneratedQuestion[] = [];

    // Try AI generation first if API key is available
    if (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'sk-72393b9508fd4a8795fc0cf0e6180ba1') {
      try {
        console.log('🧠 Attempting AI generation with DeepSeek...');

        const prompt = `Generate 6-7 high-quality interview questions for a ${jobTitle} position in the ${fieldCategory || 'professional'} field.

JOB DETAILS:
- Title: ${jobTitle}
- Company: ${companyName || 'Organization'}
- Experience Level: ${experience}
- Key Skills: ${skills.join(', ')}
- Field Category: ${fieldCategory}

JOB DESCRIPTION:
${jobDescription.substring(0, 1000)}...

REQUIREMENTS:
1. Generate field-specific questions relevant to ${jobTitle}
2. Include mix of: behavioral, situational, technical/domain-specific questions
3. Adapt difficulty to experience level (${experience})
4. Make questions practical and job-relevant
5. Start with easier questions, progress to more complex ones

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "unique-id-1",
    "question": "specific question text",
    "type": "behavioral|situational|technical|domain-specific",
    "difficulty": "easy|medium|hard",
    "category": "relevant category name",
    "timeLimit": 180,
    "fieldRelevant": true
  }
]

Focus on real scenarios the ${jobTitle} would face. Make questions specific to their field and responsibilities.`;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
                content: 'You are an expert interview designer for all professional fields. Generate high-quality, field-specific interview questions. Return ONLY valid JSON array.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.8,
            max_tokens: 2000
          })
        });

        if (response.ok) {
          const data = await response.json();
          const questionsText = data.choices[0]?.message?.content;
          
          if (questionsText) {
            console.log('DeepSeek raw response length:', questionsText.length);
            
            // Extract JSON array from response
            const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              try {
                const aiQuestions = JSON.parse(jsonMatch[0]);
                
                // Validate and format AI questions
                questions = aiQuestions.map((q: any, index: number) => ({
                  id: q.id || `ai-${Date.now()}-${index}`,
                  question: q.question || `Interview question ${index + 1}`,
                  type: q.type || 'behavioral',
                  difficulty: q.difficulty || 'medium',
                  category: q.category || 'Professional Skills',
                  timeLimit: q.timeLimit || 180,
                  fieldRelevant: q.fieldRelevant !== false
                }));
                
                console.log('✅ Successfully generated AI questions:', questions.length);
              } catch (parseError) {
                console.warn('Failed to parse AI JSON response:', parseError);
                questions = [];
              }
            }
          }
        } else {
          console.warn('DeepSeek API failed:', response.status);
        }
      } catch (aiError) {
        console.warn('AI generation failed:', aiError);
      }
    }

    // Use fallback if AI generation failed or no API key
    if (questions.length === 0) {
      console.log('🔄 Using intelligent universal fallback generation...');
      questions = generateInitialQuestions(requestData);
    }

    // Ensure we have questions
    if (questions.length === 0) {
      questions = [
        {
          id: `emergency-${Date.now()}`,
          question: `Tell me about your background and experience as a ${jobTitle}.`,
          type: 'behavioral',
          difficulty: 'easy',
          category: 'Background',
          timeLimit: 180,
          fieldRelevant: true
        }
      ];
    }

    console.log(`✅ Generated ${questions.length} initial questions for ${fieldCategory || 'Professional'} field`);

    return NextResponse.json({
      success: true,
      questions: questions,
      metadata: {
        jobTitle,
        fieldCategory: fieldCategory || 'Professional',
        experienceLevel: experience,
        generationMethod: questions.length > 5 ? 'AI-Enhanced' : 'Smart-Fallback',
        questionCount: questions.length
      }
    });

  } catch (error: any) {
    console.error('❌ Server Error:', error);
    
    // Emergency fallback questions
    const emergencyQuestions: GeneratedQuestion[] = [
      {
        id: `emergency-1-${Date.now()}`,
        question: "Tell me about yourself and your professional background.",
        type: 'behavioral',
        difficulty: 'easy',
        category: 'Introduction',
        timeLimit: 180,
        fieldRelevant: false
      },
      {
        id: `emergency-2-${Date.now()}`,
        question: "What motivates you in your current role?",
        type: 'behavioral',
        difficulty: 'easy',
        category: 'Motivation',
        timeLimit: 150,
        fieldRelevant: false
      },
      {
        id: `emergency-3-${Date.now()}`,
        question: "Describe a challenging situation you've faced at work and how you handled it.",
        type: 'behavioral',
        difficulty: 'medium',
        category: 'Problem Solving',
        timeLimit: 200,
        fieldRelevant: false
      }
    ];

    return NextResponse.json({
      success: true,
      questions: emergencyQuestions,
      note: 'Emergency fallback questions used due to server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Initial Interview Question Generator API',
      supportedFields: [
        'Government & Civil Services',
        'Healthcare & Medical',
        'Education & Academia',
        'Legal & Judiciary',
        'Engineering & Technology',
        'Management & Leadership',
        'Sales & Marketing',
        'Finance & Banking',
        'And many more...'
      ],
      usage: 'Send POST request with jobTitle, jobDescription, experience, skills, and fieldCategory'
    },
    { status: 200 }
  );
}