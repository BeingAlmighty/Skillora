import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/client'
import FullSidebar from '../Vector/Sidebar'
import PlaceholdersAndVanishInput from '../Vector/ChatInterface'

const Vector = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      loadChatHistory()
    }
  }, [isAuthenticated, loading])

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const history = await api.getChatHistory(50)
      
    
      const formattedMessages = history.reverse().map(msg => ({
        id: msg.message_id,
        text: msg.content,
        timestamp: msg.created_at,
        sender: msg.sender === 'user' ? 'user' : 'ai'
      }))
      
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const placeholders = [
    "What career path should I pursue?",
    "What skills do I need to learn?",
    "How can I improve my resume?",
    "Tell me about career opportunities in tech...",
  ]

  const handleChange = (e) => {
    console.log('Input changed:', e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const input = e.target.querySelector('input')
    if (input && input.value.trim()) {
      const userMessageText = input.value
      const userMessage = {
        id: Date.now(),
        text: userMessageText,
        timestamp: new Date().toISOString(),
        sender: 'user'
      }

      setMessages(prev => [...prev, userMessage])

      input.value = ''

      setIsTyping(true)
      
      try {
        // Send message with authenticated user's ID or use guest ID
        const userId = user?.user_id || user?.id || user?.email || 'guest_user'
        const response = await api.sendMessage(userMessageText, userId, 10)
        console.log('API Response:', response)

        setIsTyping(false)

        // Format the AI response with job recommendations if available
        let responseText = response.message || "I received your message!"
        
        // If there are job recommendations, format them nicely
        if (response.job_recommendations && response.job_recommendations.length > 0) {
          responseText += "\n\n Job Recommendations:\n\n"
          
          response.job_recommendations.forEach((job, index) => {
            const matchPercentage = (job.similarity_score * 100).toFixed(1)
            responseText += `${index + 1}. ${job.Job_Role}\n`
            responseText += `    Skills: ${job.Required_Skills}\n`
            
            // Add salary range if available
            if (job.Min_Salary && job.Max_Salary) {
              responseText += `    Salary: ${job.Min_Salary} - ${job.Max_Salary} LPA\n`
            } else if (job.Min_Salary) {
              responseText += `    Salary: ${job.Min_Salary}+ LPA\n`
            }
            
            responseText += `    Match: ${matchPercentage}%\n\n`
          })
        }

        const aiResponse = {
          id: Date.now() + 1,
          text: responseText,
          timestamp: new Date().toISOString(),
          sender: 'ai',
          data: {
            extractedSkills: response.extracted_skills || [],
            jobRecommendations: response.job_recommendations || [],
            skillsSaved: response.skills_saved || false,
            totalJobs: response.total_jobs || 0
          }
        }
        setMessages(prev => [...prev, aiResponse])
        
      } catch (error) {
        console.error('Failed to send message:', error)
        setIsTyping(false)

        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          timestamp: new Date().toISOString(),
          sender: 'ai'
        }
        setMessages(prev => [...prev, errorMessage])
      }
    }
  }

  const handleClearChat = () => {
    setMessages([])
    console.log('Chat cleared')
  }

  if (loading) {
    return (
      <div className="relative h-screen w-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-neutral-900 overflow-hidden">

      <div className="fixed left-0 top-0 h-screen z-50">
        <FullSidebar onClearChat={handleClearChat} />
      </div>

      <div className="w-full h-screen flex flex-col">

        {messages.length === 0 ? (
          /* Layout for Empty State */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500 dark:text-gray-400 mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Welcome {user?.full_name || user?.email}!
              </h2>
              <p className="text-lg">Ask me anything about your career journey!</p>
            </motion.div>
            
            {/* Centered Chat Input */}
            <motion.div 
              className="w-full max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </div>
        ) : (
          /* Chat View with Messages */
          <>
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* AI Avatar */}
                    {message.sender === 'ai' && (
                      <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden shadow-lg">
                        <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*A7MUqyCLvZDcHkfM.jpg" alt="" className='w-full h-full object-cover' />
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                      <div
                        className={`rounded-4xl px-8 py-3 shadow-md ${
                          message.sender === 'user'
                            ? 'bg-zinc-700 text-white rounded-br-md'
                            : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        
                        {/* Display extracted skills if available */}
                        {message.data?.extractedSkills && message.data.extractedSkills.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold mb-2">🎯 Extracted Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.data.extractedSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 block ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* User Avatar */}
                    {message.sender === 'user' && (
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
                        U
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex gap-3 justify-start"
                  >
                    {/* AI Avatar */}
                    <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden shadow-lg">
                      <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*A7MUqyCLvZDcHkfM.jpg" alt=""  className='w-full h-full object-cover'/>
                    </div>
                    
                    {/* Typing Bubble */}
                    <div className="max-w-[70%]">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="rounded-2xl p-4 shadow-md bg-white dark:bg-neutral-800 rounded-bl-md"
                      >
                        <div className="flex gap-1 items-center">
                          <motion.div
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ 
                              duration: 0.6, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ 
                              duration: 0.6, 
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.2
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ 
                              duration: 0.6, 
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.4
                            }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="shrink-0 p-4">
              <div className="max-w-4xl mx-auto">
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Vector
