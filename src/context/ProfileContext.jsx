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

  // User Profile Basic Personal & Academic Info
  const [profileInfo, setProfileInfo] = useState(() => {
    if (!user) return {
      name: 'Manas Kapoor',
      institution: 'NIT Delhi',
      degree: 'B.Tech',
      stream: 'Computer Science',
      year: '3rd Year',
      location: 'Delhi',
      bio: 'Software & Data Science student exploring 12-month occupational transitions.'
    }
    const saved = localStorage.getItem(getUserKey('profileInfo'))
    return saved ? JSON.parse(saved) : {
      name: user.name || user.email?.split('@')[0] || 'Manas Kapoor',
      institution: 'NIT Delhi',
      degree: 'B.Tech',
      stream: 'Computer Science',
      year: '3rd Year',
      location: 'Delhi',
      bio: 'Software & Data Science student exploring 12-month occupational transitions.'
    }
  })

  // User Wishlist Jobs
  const [wishlistJobs, setWishlistJobs] = useState(() => {
    if (!user) return []
    const saved = localStorage.getItem(getUserKey('jobWishlist'))
    return saved ? JSON.parse(saved) : []
  })

  // User Evidence-Backed & Reported Skills
  const [userSkills, setUserSkills] = useState(() => {
    if (!user) return [
      {
        id: '1',
        name: 'Python',
        level: 'Intermediate',
        status: 'Evidence-backed',
        sourcesCount: 3,
        snippet: 'Built exploratory data analysis scripts and ML baseline models.'
      },
      {
        id: '2',
        name: 'SQL & Database Management',
        level: 'Intermediate',
        status: 'Evidence-backed',
        sourcesCount: 2,
        snippet: 'Authored relational schema queries & join optimizations.'
      },
      {
        id: '3',
        name: 'React.js',
        level: 'Intermediate',
        status: 'User reported',
        sourcesCount: 1,
        snippet: 'User-declared web frontend framework experience.'
      },
      {
        id: '4',
        name: 'Machine Learning',
        level: 'Beginner',
        status: 'Needs review',
        sourcesCount: 0,
        snippet: 'Pending project verification.'
      }
    ]
    const saved = localStorage.getItem(getUserKey('userSkills'))
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Python',
        level: 'Intermediate',
        status: 'Evidence-backed',
        sourcesCount: 3,
        snippet: 'Built exploratory data analysis scripts and ML baseline models.'
      },
      {
        id: '2',
        name: 'SQL & Database Management',
        level: 'Intermediate',
        status: 'Evidence-backed',
        sourcesCount: 2,
        snippet: 'Authored relational schema queries & join optimizations.'
      },
      {
        id: '3',
        name: 'React.js',
        level: 'Intermediate',
        status: 'User reported',
        sourcesCount: 1,
        snippet: 'User-declared web frontend framework experience.'
      },
      {
        id: '4',
        name: 'Machine Learning',
        level: 'Beginner',
        status: 'Needs review',
        sourcesCount: 0,
        snippet: 'Pending project verification.'
      }
    ]
  })

  // User Career Preferences
  const [careerPreferences, setCareerPreferences] = useState(() => {
    if (!user) return {
      preferredDomains: ['Information Technology & Computing', 'Data Infrastructure & Engineering'],
      preferredCities: ['Delhi NCR', 'Bengaluru', 'Hyderabad'],
      preferredWorkMode: 'Remote preferred',
      targetCareerAreas: 'Software / Data / AI'
    }
    const saved = localStorage.getItem(getUserKey('careerPreferences'))
    return saved ? JSON.parse(saved) : {
      preferredDomains: ['Information Technology & Computing', 'Data Infrastructure & Engineering'],
      preferredCities: ['Delhi NCR', 'Bengaluru', 'Hyderabad'],
      preferredWorkMode: 'Remote preferred',
      targetCareerAreas: 'Software / Data / AI'
    }
  })

  // Saved Target Careers (references actual OCCUPATIONS_DATA IDs from career_dataset.csv)
  const [savedTargetCareers, setSavedTargetCareers] = useState(() => {
    if (!user) return ['soc_15-1252_00', 'soc_15-1243_00']
    const saved = localStorage.getItem(getUserKey('savedTargetCareers'))
    return saved ? JSON.parse(saved) : ['soc_15-1252_00', 'soc_15-1243_00']
  })

  // RIASEC Interest Assessment State (null means not assessed yet)
  const [riasecAssessment, setRiasecAssessment] = useState(() => {
    if (!user) return null
    const saved = localStorage.getItem(getUserKey('riasecAssessment'))
    return saved ? JSON.parse(saved) : null
  })

  // Store Zenith API Data
  const [zenithApiData, setZenithApiData] = useState(() => {
    if (!user) return null
    const saved = localStorage.getItem(getUserKey('zenithApiData'))
    return saved ? JSON.parse(saved) : null
  })

  // Reload data when user changes
  useEffect(() => {
    if (user) {
      const savedInfo = localStorage.getItem(getUserKey('profileInfo'))
      const savedWishlist = localStorage.getItem(getUserKey('jobWishlist'))
      const savedSkills = localStorage.getItem(getUserKey('userSkills'))
      const savedPref = localStorage.getItem(getUserKey('careerPreferences'))
      const savedTargets = localStorage.getItem(getUserKey('savedTargetCareers'))
      const savedRiasec = localStorage.getItem(getUserKey('riasecAssessment'))
      const savedZenith = localStorage.getItem(getUserKey('zenithApiData'))
      
      if (savedInfo) setProfileInfo(JSON.parse(savedInfo))
      setWishlistJobs(savedWishlist ? JSON.parse(savedWishlist) : [])
      if (savedSkills) setUserSkills(JSON.parse(savedSkills))
      if (savedPref) setCareerPreferences(JSON.parse(savedPref))
      if (savedTargets) setSavedTargetCareers(JSON.parse(savedTargets))
      setRiasecAssessment(savedRiasec ? JSON.parse(savedRiasec) : null)
      setZenithApiData(savedZenith ? JSON.parse(savedZenith) : null)
    }
  }, [user?.user_id, user?.id, user?.email])

  // Save to localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getUserKey('profileInfo'), JSON.stringify(profileInfo))
    }
  }, [profileInfo, user])

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
    if (user) {
      localStorage.setItem(getUserKey('careerPreferences'), JSON.stringify(careerPreferences))
    }
  }, [careerPreferences, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(getUserKey('savedTargetCareers'), JSON.stringify(savedTargetCareers))
    }
  }, [savedTargetCareers, user])

  useEffect(() => {
    if (user && riasecAssessment) {
      localStorage.setItem(getUserKey('riasecAssessment'), JSON.stringify(riasecAssessment))
    }
  }, [riasecAssessment, user])

  useEffect(() => {
    if (user && zenithApiData) {
      localStorage.setItem(getUserKey('zenithApiData'), JSON.stringify(zenithApiData))
    }
  }, [zenithApiData, user])

  // Context updates
  const updateProfileInfo = (updates) => {
    setProfileInfo(prev => ({ ...prev, ...updates }))
  }

  const updateCareerPreferences = (updates) => {
    setCareerPreferences(prev => ({ ...prev, ...updates }))
  }

  const addTargetCareer = (occupationId) => {
    if (!savedTargetCareers.includes(occupationId)) {
      setSavedTargetCareers([...savedTargetCareers, occupationId])
    }
  }

  const removeTargetCareer = (occupationId) => {
    setSavedTargetCareers(savedTargetCareers.filter(id => id !== occupationId))
  }

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
      level: skillData.level || 'Intermediate',
      status: skillData.status || 'User reported',
      sourcesCount: skillData.sourcesCount || 1,
      snippet: skillData.snippet || 'User self-declared skill competency.'
    }
    setUserSkills([...userSkills, newSkill])
    return newSkill
  }

  const removeSkill = (skillId) => {
    setUserSkills(userSkills.filter(skill => skill.id !== skillId))
  }

  const updateSkill = (skillId, updates) => {
    setUserSkills(userSkills.map(skill =>
      skill.id === skillId ? { ...skill, ...updates } : skill
    ))
  }

  const updateZenithApiData = (data) => {
    setZenithApiData(data)
  }

  const value = {
    profileInfo,
    updateProfileInfo,
    careerPreferences,
    updateCareerPreferences,
    savedTargetCareers,
    addTargetCareer,
    removeTargetCareer,
    riasecAssessment,
    setRiasecAssessment,
    wishlistJobs,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    userSkills,
    addSkill,
    removeSkill,
    updateSkill,
    zenithApiData,
    updateZenithApiData
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
