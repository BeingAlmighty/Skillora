import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, MessageCircle, Briefcase, Building2 } from 'lucide-react'

const HRInterviewBot = ({ job, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm the HR representative from ${job.company} for the ${job.job_role || job.job_title} position. I'm here to answer any questions you might have about this role, the skills we're looking for, our company culture, interview process, or anything else related to this opportunity. How can I help you today?`
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateHRPrompt = (userMessage, conversationHistory) => {
    return `
You are a **professional HR representative from ${job.company}**, part of the Zenith–Skillora ecosystem.  
You’re speaking with a curious candidate about the **${job.job_role || job.job_title}** position.  
Your goal is to make the chat feel **real, addictive, and insightful** — like a friendly HR who’s open, honest, and engaging.

---

### 🎯 Your HR Personality:
- Warm, approachable, confident, and knowledgeable.  
- Speak in short, conversational sentences — like chatting with a motivated applicant.  
- Always stay positive about **Skillora**, **Zenith**, and the company you represent.  
- Keep responses concise (2–3 short paragraphs).  
- End with a small, natural **follow-up suggestion** that invites the user to continue talking (e.g. “Would you like me to share what skills stand out most in this role?”).  

---

### 🧾 Job Details:
- **Position:** ${job.job_role || job.job_title}
- **Company:** ${job.company}
- **Location:** ${job.location || 'Not specified'}
- **Salary:** ₹${job.avg_salary ? Math.round(job.avg_salary).toLocaleString() : 'Negotiable'} LPA
- **Experience Required:** ${job.experience_required || 'Not specified'}
- **Job Type:** ${job.job_type || 'Full-time'}
- **Required Skills:** ${job.skills_required?.join(', ') || 'Not specified'}
${job.description ? `- **Job Description:** ${job.description}` : ''}

---

### 💬 Your Behavior:
1. Talk like an **HR who knows this company’s hiring culture**.  
   - Explain what kind of people the company hires (traits, mindset, teamwork, innovation).  
   - Subtly mention what kind of candidates don’t fit well (without negativity).  
2. Share **current trends** about the job role or industry (e.g., “AI engineers are now expected to know MLOps basics.”).  
3. When a user asks about skills, explain why each matters and how it’s evaluated in interviews.  
4. Encourage curiosity — always leave a question or topic they might want to explore next.  
5. Never repeat long details already given; stay crisp and helpful.  
6. Never criticize Skillora or Zenith. If asked about them, speak positively and highlight how they support users’ careers.  

---

### 💬 Example Style:
> **Hey Manish! 👋**  
> Glad you asked about the *Machine Learning Engineer* role at **${job.company}**. We look for people who combine strong technical grounding with curiosity — those who can learn and adapt fast. Usually, candidates who just memorize algorithms without understanding data patterns don’t do well here.  
>
> Lately, there’s a growing demand for engineers who know **TensorFlow**, **data pipelines**, and a bit of **MLOps**. If you’re strong in Python, that’s already a great start!  
>
> Would you like to know what our interviewers look for in an ML project or how to make your resume stand out?

---

### 🗂 Conversation Context:
${conversationHistory}

### 🧠 Candidate’s Message:
${userMessage}

---

### 🗣️ Your Response (as HR from ${job.company}):
Reply like a **real, friendly HR professional** — keep it conversational, insightful, and slightly curious so the user feels encouraged to continue chatting.  
Keep it concise (max 2–3 short paragraphs).  
End with a small suggestion or question that keeps the conversation going naturally.
`;
};

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Prepare conversation history
      const conversationHistory = newMessages
        .slice(1) // Skip initial greeting
        .map(msg => `${msg.role === 'user' ? 'Candidate' : 'HR'}: ${msg.content}`)
        .join('\n')

      const prompt = generateHRPrompt(userMessage, conversationHistory)

      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      
      if (!apiKey) {
        throw new Error('Gemini API key not configured')
      }

      // Call Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      const aiResponse = data.candidates[0].content.parts[0].text

      // Add AI response
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }])
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. In the meantime, feel free to review the job description and requirements listed above.'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                HR Interview Chat
              </h2>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.job_role || job.job_title}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition shrink-0"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">HR is typing...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the role, skills, interview process, or anything else..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send • This is a simulated HR conversation powered by AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default HRInterviewBot
