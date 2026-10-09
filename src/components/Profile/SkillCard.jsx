import React, { useState } from 'react'
import { Target, X, ChevronDown, ChevronUp, BookOpen, Calendar, TrendingUp } from 'lucide-react'

const SkillCard = ({ skill, onRemove, onUpdateProgress }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newProgress, setNewProgress] = useState(skill.progress)

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Intermediate': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400',
      'Advanced': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400'
    }
    return colors[level] || colors['Beginner']
  }

  const getProgressColor = (progress) => {
    if (progress < 33) return 'from-red-500 to-orange-500'
    if (progress < 66) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-emerald-500'
  }

  const handleSaveProgress = () => {
    onUpdateProgress(skill.id, newProgress)
    setIsEditing(false)
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              {skill.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold border ${getLevelColor(skill.level)}`}>
                {skill.level}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Added {new Date(skill.addedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => onRemove(skill.id)}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition group"
            title="Remove skill"
          >
            <X className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
          </button>
        </div>

        {/* Progress Section */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Progress
            </span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSaveProgress}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setNewProgress(skill.progress)
                  }}
                  className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="font-semibold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
              >
                {skill.progress}%
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${getProgressColor(skill.progress)} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${skill.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Related Jobs */}
        {skill.relatedJobs.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">Related Jobs:</p>
            <div className="flex flex-wrap gap-1.5">
              {skill.relatedJobs.map((job, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs"
                >
                  {job}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {skill.nextSteps.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>Next Steps</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Expanded Section - Next Steps */}
      {isExpanded && skill.nextSteps.length > 0 && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
          <ul className="space-y-2">
            {skill.nextSteps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-semibold mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SkillCard
