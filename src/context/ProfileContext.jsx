import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ProfileContext = createContext()

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider')
  }
  return context
}

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth()
  
  // Get user-specific localStorage keys
  const getUserKey = (baseKey) => {
    const userId = user?.user_id || user?.id || user?.email || 'guest'
    return `${baseKey}_${userId}`
  }

  // Load from localStorage with user-specific keys
  const [wishlistJobs, setWishlistJobs] = useState(() => {
    if (!user) return []
    const saved = localStorage.getItem(getUserKey('jobWishlist'))
    return saved ? JSON.parse(saved) : []
  })

  const [userSkills, setUserSkills] = useState(() => {
    if (!user) return []
    const saved = localStorage.getItem(getUserKey('userSkills'))
    return saved ? JSON.parse(saved) : []
  })

  // Store API response data from Zenith
  const [zenithApiData, setZenithApiData] = useState(() => {
    if (!user) return null
    const saved = localStorage.getItem(getUserKey('zenithApiData'))
    return saved ? JSON.parse(saved) : null
  })

  // Reload data when user changes
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(getUserKey('jobWishlist'))
      const savedSkills = localStorage.getItem(getUserKey('userSkills'))
      const savedZenith = localStorage.getItem(getUserKey('zenithApiData'))
      
      setWishlistJobs(savedWishlist ? JSON.parse(savedWishlist) : [])
      setUserSkills(savedSkills ? JSON.parse(savedSkills) : [])
      setZenithApiData(savedZenith ? JSON.parse(savedZenith) : null)
    } else {
      setWishlistJobs([])
      setUserSkills([])
      setZenithApiData(null)
    }
  }, [user?.user_id, user?.id, user?.email])

  // Save to localStorage whenever state changes (with user-specific keys)
  useEffect(() => {
    if (user) {
      localStorage.setItem(getUserKey('jobWishlist'), JSON.stringify(wishlistJobs))
    }
  }, [wishlistJobs, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(getUserKey('userSkills'), JSON.stringify(userSkills))
    }
  }, [userSkills, user])

  useEffect(() => {
    if (user && zenithApiData) {
      localStorage.setItem(getUserKey('zenithApiData'), JSON.stringify(zenithApiData))
    }
  }, [zenithApiData, user])

  // Wishlist functions
  const addToWishlist = (job) => {
    const isAlreadyInWishlist = wishlistJobs.some(item => item.job_id === job.job_id)
    if (!isAlreadyInWishlist) {
      setWishlistJobs([...wishlistJobs, job])
      return true
    }
    return false
  }

  const removeFromWishlist = (jobId) => {
    setWishlistJobs(wishlistJobs.filter(job => job.job_id !== jobId))
  }

  const toggleWishlist = (job) => {
    const isInWishlist = wishlistJobs.some(item => item.job_id === job.job_id)
    if (isInWishlist) {
      removeFromWishlist(job.job_id)
    } else {
      addToWishlist(job)
    }
  }

  const isInWishlist = (jobId) => {
    return wishlistJobs.some(item => item.job_id === jobId)
  }

  // Skills functions
  const addSkill = (skillData) => {
    const newSkill = {
      id: Date.now().toString(),
      name: skillData.name,
      level: skillData.level || 'Beginner',
      progress: skillData.progress || 0,
      addedDate: new Date().toISOString().split('T')[0],
      relatedJobs: skillData.relatedJobs || [],
      nextSteps: skillData.nextSteps || []
    }
    setUserSkills([...userSkills, newSkill])
    return newSkill
  }

  const removeSkill = (skillId) => {
    setUserSkills(userSkills.filter(skill => skill.id !== skillId))
  }

  const updateSkillProgress = (skillId, newProgress) => {
    setUserSkills(userSkills.map(skill =>
      skill.id === skillId ? { ...skill, progress: newProgress } : skill
    ))
  }

  const updateSkill = (skillId, updates) => {
    setUserSkills(userSkills.map(skill =>
      skill.id === skillId ? { ...skill, ...updates } : skill
    ))
  }

  // Zenith API data functions
  const updateZenithApiData = (data) => {
    setZenithApiData(data)
    
    // Do NOT auto-sync skills - user must manually add them from Zenith
  }

  const syncSkillsFromApi = (apiSkills) => {
    // Get existing skill names
    const existingSkillNames = userSkills.map(s => s.name.toLowerCase())
    
    // Add new skills from API that don't exist yet
    const newSkills = apiSkills
      .filter(skillName => !existingSkillNames.includes(skillName.toLowerCase()))
      .map(skillName => ({
        id: `api-${Date.now()}-${Math.random()}`,
        name: skillName,
        level: 'Intermediate', // Default level for API skills
        progress: 50, // Default progress
        addedDate: new Date().toISOString().split('T')[0],
        relatedJobs: [],
        nextSteps: [],
        fromApi: true
      }))
    
    if (newSkills.length > 0) {
      setUserSkills([...userSkills, ...newSkills])
    }
  }

  const value = {
    // Wishlist
    wishlistJobs,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    // Skills
    userSkills,
    addSkill,
    removeSkill,
    updateSkillProgress,
    updateSkill,
    // Zenith API Data
    zenithApiData,
    updateZenithApiData,
    syncSkillsFromApi
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
