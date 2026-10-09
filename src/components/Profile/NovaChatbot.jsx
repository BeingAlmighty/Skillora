import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, BookOpen, Lightbulb, Rocket, Star } from 'lucide-react'

const NovaChatbot = ({ onClose, userSkills, zenithApiData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `✨ Hi there! I'm Nova, your friendly skill learning companion! ${zenithApiData?.user_skills ? `I can see you have skills in ${zenithApiData.user_skills.slice(0, 3).join(', ')}${zenithApiData.user_skills.length > 3 ? ' and more' : ''}!` : ''} I'm here to help you master any skill you choose with structured learning paths, resources, and guidance. Which skill would you like to explore today?`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentSkillFocus, setCurrentSkillFocus] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: BookOpen, text: 'Show learning roadmap', color: 'purple' },
    { icon: Lightbulb, text: 'Suggest resources', color: 'yellow' },
    { icon: Rocket, text: 'Practice projects', color: 'green' },
    { icon: Star, text: 'Quiz me on basics', color: 'blue' }
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

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateNovaResponse(message)
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1500)
  }

  const generateNovaResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    // Detect if user mentions a skill
    if (lowerMessage.includes('python') || lowerMessage.includes('machine learning') || 
        lowerMessage.includes('javascript') || lowerMessage.includes('react')) {
      
      let skill = 'Python'
      if (lowerMessage.includes('machine learning')) skill = 'Machine Learning'
      if (lowerMessage.includes('javascript')) skill = 'JavaScript'
      if (lowerMessage.includes('react')) skill = 'React'
      
      setCurrentSkillFocus(skill)
      
      return `🎯 Great choice! Let me help you with **${skill}**.\n\n📚 **Learning Path Overview**:\n\n**Phase 1: Foundations** (2-3 weeks)\n• Core concepts and syntax\n• Basic data structures\n• Problem-solving fundamentals\n\n**Phase 2: Intermediate** (4-6 weeks)\n• Advanced concepts\n• Real-world applications\n• Best practices\n\n**Phase 3: Advanced** (8-12 weeks)\n• Expert-level topics\n• Production-ready code\n• Portfolio projects\n\n💡 Would you like specific resources, project ideas, or should I break down Phase 1 for you?`
    }

    if (lowerMessage.includes('roadmap') || lowerMessage.includes('path')) {
      const skill = currentSkillFocus || 'your chosen skill'
      return `🗺️ Here's your detailed roadmap for **${skill}**:\n\n**Week 1-2: Getting Started**\n✅ Set up development environment\n✅ Learn basic syntax and concepts\n✅ Complete 10-15 beginner exercises\n\n**Week 3-4: Building Foundations**\n✅ Deep dive into core concepts\n✅ Build 2-3 mini projects\n✅ Join online communities\n\n**Week 5-8: Practical Application**\n✅ Work on real-world projects\n✅ Contribute to open source\n✅ Build your portfolio\n\n📌 Remember: Consistency is key! Even 30 minutes daily makes a huge difference.\n\nReady to start with Week 1?`
    }

    if (lowerMessage.includes('resource') || lowerMessage.includes('course') || lowerMessage.includes('learn')) {
      return `📚 **Free Learning Resources**:\n\n🎓 **Online Courses**:\n• freeCodeCamp - Comprehensive & free\n• Coursera - University-level courses (audit free)\n• edX - MIT/Harvard courses\n• YouTube - Tons of tutorials\n\n📖 **Documentation & Guides**:\n• Official documentation (always start here!)\n• MDN Web Docs\n• Real Python\n• Dev.to articles\n\n💻 **Practice Platforms**:\n• LeetCode - Coding challenges\n• HackerRank - Skill certification\n• Codewars - Gamified learning\n• GitHub - Real projects\n\n🎯 **Pro Tip**: Start with one course, complete it fully before jumping to another!\n\nWhich type of resource interests you most?`
    }

    if (lowerMessage.includes('project')) {
      return `🚀 **Project Ideas** (Beginner to Advanced):\n\n**🟢 Beginner Projects**:\n1. To-Do List App\n2. Calculator\n3. Weather Dashboard\n4. Personal Portfolio Website\n\n**🟡 Intermediate Projects**:\n1. E-commerce Product Page\n2. Social Media Dashboard\n3. Blog with CMS\n4. Real-time Chat Application\n\n**🔴 Advanced Projects**:\n1. Full-stack Application\n2. Machine Learning Model\n3. Mobile App\n4. SaaS Platform MVP\n\n💡 **My Recommendation**: Start with project #1 from beginner level. It teaches fundamentals while being achievable in a week!\n\nWant me to break down any specific project?`
    }

    if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      return `📝 **Quick Knowledge Check**\n\nLet's test your understanding! Here are some questions:\n\n❓ **Question 1**: What's the difference between var, let, and const in JavaScript?\n\n❓ **Question 2**: Explain what a function is and why we use them.\n\n❓ **Question 3**: What are the main data types you know?\n\nTake your time! There's no rush. Type your answer for any question, and I'll provide feedback! 😊\n\nRemember: Making mistakes is how we learn!`
    }

    // Default helpful response
    return `I'd love to help you with that! 🌟\n\nI can assist you with:\n\n📖 **Learning Paths** - Step-by-step roadmaps\n🎓 **Resources** - Free courses and tutorials\n💻 **Projects** - Hands-on practice ideas\n📝 **Quizzes** - Test your knowledge\n💡 **Tips** - Study strategies and motivation\n\n**Popular Skills I Can Help With**:\n• Programming (Python, JavaScript, Java)\n• Web Development (React, Node.js)\n• Data Science & ML\n• Cloud Computing\n• Cybersecurity\n• And many more!\n\nWhich skill are you interested in, or what would you like to know? 😊`
  }

  const handleQuickAction = (action) => {
    handleSendMessage(action)
  }

  const handleSkillClick = (skill) => {
    handleSendMessage(`I want to learn ${skill}`)
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Nova ✨ Learning Guide
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your friendly learning companion • Here to help you grow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition shrink-0"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Your Skills Bar */}
        {userSkills && userSkills.length > 0 && (
          <div className="px-6 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Your tracked skills:</p>
            <div className="flex flex-wrap gap-2">
              {userSkills.slice(0, 6).map((skill, index) => (
                <button
                  key={index}
                  onClick={() => handleSkillClick(skill.name)}
                  className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-medium transition"
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
                <span className="text-sm text-gray-600 dark:text-gray-400">Nova is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-900">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Quick Help:</p>
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
              placeholder="Ask me about any skill you want to learn..."
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
            Press Enter to send • Get personalized learning guidance powered by AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default NovaChatbot
