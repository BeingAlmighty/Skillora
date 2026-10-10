import React, { useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { useAuth } from '../../context/AuthContext'
import FullSidebar from '../Vector/Sidebar'
import { 
  Target, 
  Trash2, 
  TrendingUp, 
  Award,
  Search,
  X,
  DollarSign,
  Briefcase,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react'

const Skills = () => {
  const { userSkills, removeSkill, updateSkill, zenithApiData } = useProfile()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSkills = userSkills.filter(skill => {
    if (!searchQuery) return true
    return skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getSkillROI = (skillName) => {
    if (!zenithApiData?.roi_report) return null
    return zenithApiData.roi_report.find(
      item => item.skill.toLowerCase() === skillName.toLowerCase()
    )
  }

  const skillStats = {
    total: userSkills.length,
    manual: userSkills.length,
    completed: userSkills.filter(s => s.completed).length
  }
  
  const handleToggleComplete = (skillId) => {
    const skill = userSkills.find(s => s.id === skillId)
    updateSkill(skillId, { completed: !skill.completed })
  }
  
  const getTierColor = (tier) => {
    const colors = {
      'Mandatory': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300',
      'High Priority': 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300',
      'Strategic Value': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Nice to Have': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300'
    }
    return colors[tier] || colors['Nice to Have']
  }

  return (
    <div className="relative h-screen w-screen bg-gray-50 dark:bg-neutral-900 overflow-hidden">
      <div className="fixed left-0 top-0 h-screen z-100">
        <FullSidebar />
      </div>

      <div className="h-screen flex items-center justify-center overflow-hidden" style={{ width: '1200px', marginLeft: '80px' }}>
        <div className="w-full h-full flex items-center justify-center px-4">
          <div className="w-full h-full py-8 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-blue-500" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    My Skills
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Your skills portfolio with ROI insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Skills</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{skillStats.total}</p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{skillStats.completed}</p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Circle className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{skillStats.total - skillStats.completed}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {filteredSkills.length === 0 ? (
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                  <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchQuery ? 'No skills found' : 'No skills yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchQuery
                      ? 'Try adjusting your search'
                      : 'Add skills from the Zenith ROI Plan to get started'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredSkills.map((skill) => {
                    const roiData = getSkillROI(skill.name)
                    return (
                      <div
                        key={skill.id}
                        className={`bg-white dark:bg-neutral-800 rounded-lg p-6 border-2 hover:shadow-lg transition ${
                          skill.completed 
                            ? 'border-green-500 dark:border-green-600' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`text-xl font-bold ${
                                skill.completed 
                                  ? 'text-green-600 dark:text-green-400 line-through' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {skill.name}
                              </h3>
                              {skill.completed && (
                                <CheckCircle className="h-5 w-5 text-green-500 fill-current" />
                              )}
                            </div>
                            
                            {roiData && roiData.tier && (
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTierColor(roiData.tier)}`}>
                                {roiData.tier}
                              </span>
                            )}
                            {!roiData && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                ROI data available after running Zenith analysis
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Remove skill"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {roiData && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                ROI Insights
                              </h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="bg-white dark:bg-neutral-800 rounded p-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <Briefcase className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Job Demand</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  {roiData.countWithSkill}/{roiData.totalJobs} jobs
                                </p>
                              </div>
                              
                              {roiData.salaryPremium > 0 && (
                                <div className="bg-white dark:bg-neutral-800 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Salary Boost</p>
                                  </div>
                                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                    +₹{Math.round(roiData.salaryPremium).toLocaleString()} LPA
                                  </p>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                              {roiData.narrative}
                            </p>
                          </div>
                        )}

                        {skill.addedDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Added on {new Date(skill.addedDate).toLocaleDateString()}
                          </p>
                        )}

                        <div className="w-full">
                          <button
                            onClick={() => handleToggleComplete(skill.id)}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
                              skill.completed
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {skill.completed ? (
                              <>
                                <Circle className="h-5 w-5" />
                                Mark Incomplete
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                Mark Complete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skills
