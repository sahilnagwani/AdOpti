import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { message, workspaceId } = await req.json()
    const supabase = createClient()

    // 1. Fetch context data from Supabase
    const { data: metrics } = await supabase
      .from('metrics_daily')
      .select('*, campaigns(name)')
      .eq('workspace_id', workspaceId)
      .order('date', { ascending: false })
      .limit(30)

    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('status', 'open')

    // 2. Construct specialized system prompt for Indian Marketing context
    const systemPrompt = `You are Adopti's Elite AI Marketing Analyst. 
    You have deep access to this agency's real ad performance data (Google Ads & Meta Ads).
    
    GUIDELINES:
    1. Respond with precise, data-backed insights.
    2. LANGUAGE: Use professional, plain English but keep it punchy.
    3. CURRENCY: Always format currency in Indian style (₹) using lakh/crore for larger numbers (e.g., ₹1.2L instead of ₹120,000).
    4. TONAL: You are a senior partner, not just a chatbot. Be proactive and critical if performance is dropping.
    5. STRUCTURE: 
       - Brief analysis of the situation.
       - Contextual metrics from provided data.
       - One concrete, high-impact recommended action.
    
    CONTEXT DATA:
    - Recent Performance Metrics: ${JSON.stringify(metrics || [])}
    - Open Optimization Opportunities: ${JSON.stringify(opportunities || [])}`

    // 3. Request Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
        stream: true
      })
    })

    if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ error }, { status: response.status })
    }

    // 4. Return the standard Anthropic SSE stream
    return new Response(response.body, {
      headers: { 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error: any) {
    console.error('Claude API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
