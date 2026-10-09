import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import FullSidebar from '../Vector/Sidebar'
import { 
  User, Briefcase, Target, TrendingUp, Plus, X, 
  MessageCircle, Sparkles, Award, BookOpen, Clock, ChevronRight, ArrowRight
} from 'lucide-react'
import AddSkillModal from '../Profile/AddSkillModal'
import HRChatbot from '../Profile/HRChatbot'
import NovaChatbot from '../Profile/NovaChatbot'

const Profile = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, user } = useAuth()
  const {
    wishlistJobs,
    removeFromWishlist,
    userSkills,
    addSkill,
    removeSkill,
    updateSkillProgress,
    zenithApiData
  } = useProfile()

  // Modal states
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [showHRChat, setShowHRChat] = useState(false)
  const [showNovaChat, setShowNovaChat] = useState(false)

  // Derive profile data from user and API data
  const profileData = {
    name: user?.name || user?.email?.split('@')[0] || 'Guest User',
    email: user?.email || 'Not logged in',
    bio: zenithApiData?.user_skills?.length > 0 
      ? `Skills: ${zenithApiData.user_skills.slice(0, 3).join(', ')}${zenithApiData.user_skills.length > 3 ? ' and more' : ''}`
      : 'Building career profile...',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`,
    topRoles: zenithApiData?.top_opportunities?.slice(0, 3).map(job => job.job_role || job.job_title) || []
  }

  const handleRemoveFromWishlist = (jobId) => {
    removeFromWishlist(jobId)
  }

  const handleAddSkill = (skillData) => {
    addSkill(skillData)
    setShowAddSkillModal(false)
  }

  const handleRemoveSkill = (skillId) => {
    removeSkill(skillId)
  }

  const handleUpdateProgress = (skillId, newProgress) => {
    updateSkillProgress(skillId, newProgress)
  }

  if (loading) {
    return (
      <div className="relative h-screen w-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const totalSkills = userSkills.length
  const averageProgress = userSkills.length > 0 
    ? Math.round(userSkills.reduce((sum, skill) => sum + skill.progress, 0) / userSkills.length)
    : 0
  
  // Calculate average match rate from wishlist jobs
  const averageMatchRate = wishlistJobs.length > 0
    ? Math.round(wishlistJobs.reduce((sum, job) => sum + (job.similarity_score * 100 || 0), 0) / wishlistJobs.length)
    : zenithApiData?.top_opportunities?.[0]?.similarity_score 
      ? Math.round(zenithApiData.top_opportunities[0].similarity_score * 100)
      : 0

  return (
    <div className="relative h-screen w-screen bg-gray-50 dark:bg-neutral-900 overflow-hidden">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-100">
        <FullSidebar />
      </div>

      {/* Main Content */}
      <div className="h-screen flex items-center justify-center overflow-hidden" style={{ width: '1200px', marginLeft: '80px' }}>
        <div className="w-full h-full flex items-center justify-center px-4">
          <div className="w-full h-full py-8 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">

              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Career Profile
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your skills, manage job wishlist, and get AI-powered guidance
                </p>
              </div>

              {/* Profile Summary Card */}
              <div className="bg-orange-500 dark:bg-orange-600 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                    <span className="text-4xl font-bold text-orange-500">
                      {profileData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-white">
                    <h2 className="text-2xl text-black font-bold mb-2">{profileData.name}</h2>
                    <p className="text-orange-100 dark:text-orange-200 mb-3">{profileData.email}</p>
                    {profileData.topRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.topRoles.map((role, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-sm font-medium"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/70 text-sm">
                        Visit Zenith to discover your top job matches
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Wishlist Jobs</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{wishlistJobs.length}</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Total Skills</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSkills}</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Jobs Analyzed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {zenithApiData?.total_jobs_analyzed || 0}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Average Match Rate Display */}
              {averageMatchRate > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-700 dark:text-orange-300 font-semibold mb-1">
                        Average Job Match Rate
                      </p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                        {averageMatchRate}%
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                        {wishlistJobs.length > 0 
                          ? `Based on ${wishlistJobs.length} wishlist job${wishlistJobs.length > 1 ? 's' : ''}`
                          : 'Based on top opportunity from Zenith'}
                      </p>
                    </div>
                    <div className="text-orange-500">
                      <TrendingUp className="h-12 w-12" />
                    </div>
                  </div>
                </div>
              )}

              {/* API Skills Insight */}
              {zenithApiData && zenithApiData.user_skills && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-2">
                        Skills from Zenith Analysis
                      </h3>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                        Based on {zenithApiData.total_jobs_analyzed} jobs analyzed, these skills were detected:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {zenithApiData.user_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium border border-orange-300 dark:border-orange-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Assistants - Quick Access Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setShowHRChat(true)}
                  className="bg-orange-500 hover:bg-orange-500 text-white rounded-lg p-4 shadow-lg transition transform hover:scale-[1.02] flex items-center gap-3"
                >
                  <MessageCircle className="h-6 w-6" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Zenith HR</h3>
                    <p className="text-sm text-orange-100">Get career advice, interview tips, and job roadmaps</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowNovaChat(true)}
                  className="bg-orange-500 text-white rounded-lg p-4 shadow-lg transition transform hover:scale-[1.02] flex items-center gap-3"
                >
                  <Sparkles className="h-6 w-6" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Nova - Skill Guide</h3>
                    <p className="text-sm text-orange-100">Learn any skill with structured paths and resources</p>
                  </div>
                </button>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Job Wishlist Section - Summary Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-orange-500" />
                      Job Wishlist
                    </h2>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-semibold">
                      {wishlistJobs.length} saved
                    </span>
                  </div>

                  {wishlistJobs.length > 0 ? (
                    <>
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                          <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Avg Match</p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            {wishlistJobs.length > 0
                              ? Math.round(wishlistJobs.reduce((sum, job) => sum + (job.similarity_score * 100 || 0), 0) / wishlistJobs.length)
                              : 0}%
                          </p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                          <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Avg Salary</p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            ₹{wishlistJobs.length > 0
                              ? Math.round(wishlistJobs.reduce((sum, job) => sum + (job.avg_salary || 0), 0) / wishlistJobs.length).toLocaleString()
                              : '0'} L
                          </p>
                        </div>
                      </div>

                      {/* Preview of Top 3 Jobs */}
                      <div className="space-y-3 mb-4">
                        {wishlistJobs.slice(0, 3).map((job) => (
                          <div
                            key={job.job_id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {job.job_role || job.job_title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {job.company}
                                </p>
                              </div>
                              <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded text-xs font-semibold whitespace-nowrap">
                                {Math.round(job.similarity_score * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View All Button */}
                      <button
                        onClick={() => navigate('/wishlist')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
                      >
                        View All Jobs
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">No jobs in wishlist</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                        Visit Zenith to add opportunities
                      </p>
                      <button
                        onClick={() => navigate('/zenith')}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                      >
                        Explore Jobs
                      </button>
                    </div>
                  )}
                </div>

                {/* Skills Tracking Section - Summary Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-500" />
                      My Skills
                    </h2>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-semibold">
                      {userSkills.length} skills
                    </span>
                  </div>

                  {userSkills.length > 0 ? (
                    <>
                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="bg-orange-50 flex flex-col justify-center items-center dark:bg-orange-900/20 rounded-lg p-3">
                          <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Total Skills</p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            {userSkills.length}
                          </p>
                        </div>
                      </div>

                      {/* Preview of Top 5 Skills */}
                      <div className="space-y-2 mb-4">
                        {userSkills
                          .slice(0, 5)
                          .map((skill) => (
                            <div
                              key={skill.id}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                            >
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                {skill.name}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* View All Button */}
                      <button
                        onClick={() => navigate('/skills')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
                      >
                        View All Skills
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">No skills tracked yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                        Start tracking your learning journey
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddSkillModal && (
        <AddSkillModal
          onClose={() => setShowAddSkillModal(false)}
          onAdd={handleAddSkill}
        />
      )}

      {/* HR Chatbot Modal */}
      {showHRChat && (
        <HRChatbot 
          onClose={() => setShowHRChat(false)}
          userSkills={userSkills}
          wishlistJobs={wishlistJobs}
          zenithApiData={zenithApiData}
        />
      )}

      {/* Nova Chatbot Modal */}
      {showNovaChat && (
        <NovaChatbot 
          onClose={() => setShowNovaChat(false)}
          userSkills={userSkills}
          zenithApiData={zenithApiData}
        />
      )}

    </div>
  )
}

export default Profile
