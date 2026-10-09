import React, { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, Briefcase, Target, TrendingUp } from 'lucide-react'

const HRChatbot = ({ onClose, userSkills, wishlistJobs, zenithApiData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm your HR Career Coach at Zenith. I'm here to help you understand your career path, prepare for interviews, and guide you towards your dream job. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: Briefcase, text: 'Show my job roadmap', color: 'blue' },
    { icon: Target, text: 'What skills should I focus on?', color: 'green' },
    { icon: TrendingUp, text: 'Interview tips for my roles', color: 'purple' },
    { icon: MessageCircle, text: 'Career advice', color: 'orange' }
  ]

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse = generateBotResponse(message)
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('roadmap') || lowerMessage.includes('path')) {
      const topOpportunities = zenithApiData?.top_opportunities || []
      const jobCount = topOpportunities.length
      
      return `Based on your wishlist of ${wishlistJobs?.length || 0} jobs and analysis of ${zenithApiData?.total_jobs_analyzed || 'many'} opportunities, here's your personalized roadmap:\n\n1. **Immediate Focus**: Master the skills that appear most frequently across your target roles.\n2. **Short-term (1-3 months)**: Complete online courses and build 2-3 portfolio projects.\n3. **Mid-term (3-6 months)**: Apply to entry-level positions while continuing to upskill.\n4. **Long-term (6-12 months)**: Target mid-level positions with competitive salaries.\n\n${jobCount > 0 ? `Your top ${jobCount} matched opportunities are: ${topOpportunities.slice(0, 3).map(j => j.job_role || j.job_title).join(', ')}` : ''}\n\nWould you like me to break down specific skills for any particular role?`
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('focus')) {
      const apiSkills = zenithApiData?.user_skills || []
      const skillsList = apiSkills.length > 0 
        ? apiSkills.slice(0, 3).join(', ') 
        : 'Machine Learning, TensorFlow, Statistical analysis'
      
      return `Looking at your current skillset${zenithApiData ? ' from our analysis' : ''} and target jobs, I recommend focusing on:\n\n🎯 **High Priority Skills**:\n• ${skillsList}\n\n💡 **Why?** These skills appear in 80% of your wishlist jobs and can increase your salary potential by ₹3-5 LPA.\n\n${zenithApiData?.total_jobs_analyzed ? `This is based on analysis of ${zenithApiData.total_jobs_analyzed} job opportunities.` : ''}\n\nWould you like specific learning resources for any of these?`
    }

    if (lowerMessage.includes('interview')) {
      return `Here are key interview tips for your target roles:\n\n📋 **Technical Preparation**:\n• Practice coding problems on LeetCode/HackerRank\n• Be ready to explain your projects in detail\n• Review fundamental CS concepts\n\n💬 **Behavioral Questions**:\n• Prepare STAR method responses\n• Show passion for continuous learning\n• Highlight your problem-solving approach\n\n🎯 **Role-Specific**: For Data Science roles, be prepared to discuss your approach to real-world data problems.\n\nWant mock interview questions for a specific role?`
    }

    if (lowerMessage.includes('salary') || lowerMessage.includes('negotiate')) {
      return `Salary negotiation tips based on your profile:\n\n💰 **Your Market Value**:\n• Entry-level: ₹6-10 LPA\n• With additional skills: ₹10-15 LPA\n• Senior level: ₹15+ LPA\n\n📈 **Negotiation Strategy**:\n1. Research company salary ranges\n2. Highlight your unique skills\n3. Be confident but flexible\n4. Consider total compensation package\n\nRemember: Every skill you master increases your negotiating power!`
    }

    // Default response
    return `I understand you're asking about: "${userMessage}"\n\nAs your career coach, I can help you with:\n• Career roadmap planning\n• Skill development strategies\n• Interview preparation\n• Resume optimization\n• Salary negotiation\n• Job market insights\n\nCould you be more specific about what you'd like to explore?`
  }

  const handleQuickAction = (action) => {
    handleSendMessage(action)
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Zenith HR Career Coach
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>
                  📊 Tracking: <strong>{wishlistJobs?.length || 0}</strong> jobs
                </span>
                <span>
                  🎯 Skills: <strong>{userSkills?.length || 0}</strong>
                </span>
                {zenithApiData?.total_jobs_analyzed && (
                  <span>
                    📈 Analyzed: <strong>{zenithApiData.total_jobs_analyzed}</strong> opportunities
                  </span>
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">HR is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-900">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.text)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition"
              >
                <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                <span className="truncate">{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask about career advice, interviews, job roadmaps..."
              className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send • Get personalized career guidance powered by AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default HRChatbot
