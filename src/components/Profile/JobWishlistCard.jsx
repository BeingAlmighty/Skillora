import React from 'react'
import { Briefcase, DollarSign, X, TrendingUp, AlertCircle } from 'lucide-react'

const JobWishlistCard = ({ job, onRemove }) => {
  const progressPercentage = job.hasSkills.length / job.requiredSkills.length * 100

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition p-4 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {job.company}
          </p>
        </div>
        <button
          onClick={() => onRemove(job.id)}
          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition group"
          title="Remove from wishlist"
        >
          <X className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
        </button>
      </div>

      {/* Salary and Match */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
          <DollarSign className="h-4 w-4" />
          <span>₹{(job.salary / 100000).toFixed(1)} LPA</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm">
          <TrendingUp className="h-4 w-4" />
          <span>{job.matchPercentage}% Match</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Skill Progress
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {job.hasSkills.length}/{job.requiredSkills.length} skills
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Missing Skills */}
      {job.missingSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-2">
            <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Missing Skills ({job.missingSkills.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {job.missingSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {job.missingSkills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs font-medium">
                +{job.missingSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition">
        View Roadmap
      </button>
    </div>
  )
}

export default JobWishlistCard
