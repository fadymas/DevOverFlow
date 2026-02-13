import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export const POST = async (request: NextRequest) => {
  const { question } = await request.json()
  const ai = new GoogleGenAI({})

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tell me ${question}`,
      config: {
        systemInstruction: 'You are a knowlegeable assistant that provides quality information.'
      }
    })
    const reply = response.text

    return NextResponse.json({ reply }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
