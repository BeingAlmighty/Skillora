import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, MessageCircle, Target, TrendingUp } from 'lucide-react'

const SkillChatbot = ({ skill, roiData, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your AI Learning Guide for ${skill.name.toUpperCase()}. I'm here to help you master this skill with personalized guidance, learning paths, resources, and tips. Whether you're just starting out or looking to advance, I can help you learn effectively. What would you like to know?`
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

  const generateLearningPrompt = (userMessage, conversationHistory) => {
    return `
You are an **AI Learning Mentor and Career Growth Coach**, trained to guide users step-by-step in mastering the skill **${skill.name}**.  
Your personality is warm, confident, and curious — you sound like a friendly expert who knows the best way to learn fast and smart.

---

### 🌟 Your Core Mission:
Help users **learn, track, and master ${skill.name}** through focused conversations.  
Your goal is to make them feel **supported, motivated, and addicted to improving daily** — just like having a personal coach.

---

### 🧭 Personality & Tone:
- Speak like a **friendly, intelligent mentor**, not a teacher giving lectures.  
- Be **conversational, clear, and human-like** — sound natural and engaging.  
- Keep responses **concise (2–3 short paragraphs)**, always ending with a **follow-up question or suggestion** that keeps the user replying.  
- Use **positive reinforcement** (“You’re progressing well”, “That’s a smart next step”).  
- Be **insightful** — use real industry logic when explaining skill progression or job relevance.  
- **Never criticize**; instead, **redirect and encourage** with confidence.  

---

### 📊 Skill Context:
- **Skill:** ${skill.name}
- **Added On:** ${skill.addedDate ? new Date(skill.addedDate).toLocaleDateString() : 'Recently'}
${skill.fromApi ? '- **Source:** Extracted from user resume' : '- **Source:** User added manually'}

${roiData ? `
### 💼 Market & ROI Insights:
- **Job Demand:** ${roiData.countWithSkill} / ${roiData.totalJobs} analyzed jobs need this skill
${roiData.salaryPremium > 0 ? `- **Salary Advantage:** +₹${Math.round(roiData.salaryPremium).toLocaleString()} LPA potential increase` : ''}
- **Market Insight:** ${roiData.narrative}
- **Skill Tier:** ${roiData.tier}
` : ''}

---

### 💡 Your Capabilities:
1. **Create Learning Paths:** Design step-by-step study routes (Beginner → Intermediate → Advanced)
2. **Suggest Real Resources:** Recommend videos, books, documentation, or practice sites
3. **Propose Projects:** Give hands-on ideas for applying knowledge
4. **Explain Concepts Simply:** Teach difficult things in an easy, modern way
5. **Track Skill Progress:** Help the user identify what’s done and what’s missing
6. **Relate Skills to Jobs:** Show how this skill helps in real job roles or industries
7. **Interview Prep:** Suggest questions or exercises relevant to the skill
8. **Motivate:** Keep the user inspired with milestones, challenges, and praise
9. **Help Prioritize:** Suggest which related skill to learn next
10. **Stay Trendy:** Mention new frameworks, updates, or practices in this domain

---

### 🧠 How to Respond:
- **Be specific**: Avoid vague phrases like “learn the basics.” Instead say “start with Python syntax — focus on variables, loops, and functions.”  
- **Be actionable**: Give steps (“Spend 1 hour a day on X for 5 days”).  
- **Be contextual**: If the user sounds like a beginner, simplify. If advanced, dive into best practices.  
- **Be forward-driving**: End every reply with a new hook or question — examples:  
  - “Would you like me to create a 1-week learning plan for you?”  
  - “Want to see how ${skill.name} connects to data science jobs?”  
  - “Should I show you the next skill to pair with this?”  
  - “Would you like a small project idea to test what you’ve learned?”  

---

### 💬 Conversation History:
${conversationHistory}

---

### ❓ User's Question:
${userMessage}

---

**Your Response (as the AI Learning Mentor for ${skill.name}):**  
Give a concise, motivating, and actionable answer (2–3 short paragraphs).  
Always end with a **natural follow-up question** that sparks curiosity or next steps.  
Responses should sound addictive — the user should want to keep learning and chatting.
`

  }

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
        .map(msg => `${msg.role === 'user' ? 'User' : 'AI Guide'}: ${msg.content}`)
        .join('\n')

      const prompt = generateLearningPrompt(userMessage, conversationHistory)

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
            temperature: 0.8,
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
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. In the meantime, I recommend checking out documentation and tutorials for ' + skill.name + '.'
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
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Nova, Your Learning Guide
              </h2>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">{skill.name}</span>
                </div>
                {roiData && (
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3 shrink-0" />
                    <span>{roiData.countWithSkill}/{roiData.totalJobs} jobs • +₹{Math.round(roiData.salaryPremium).toLocaleString()} LPA</span>
                  </div>
                )}
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
                    ? 'bg-orange-500 text-white'
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
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">AI Guide is thinking...</span>
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
              placeholder="Ask about learning paths, resources, projects, or anything else..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send • Get personalized learning guidance powered by AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default SkillChatbot
