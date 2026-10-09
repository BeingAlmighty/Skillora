import React, { useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { useAuth } from '../../context/AuthContext'
import FullSidebar from '../Vector/Sidebar'
import HRInterviewBot from '../Wishlist/HRInterviewBot'
import { 
  Briefcase, 
  Heart, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Filter,
  Search,
  X,
  ExternalLink,
  Building2,
  MessageCircle
} from 'lucide-react'

const JobWishlist = () => {
  const { wishlistJobs, removeFromWishlist } = useProfile()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date') // date, salary, match
  const [selectedJobForChat, setSelectedJobForChat] = useState(null)

  // Filter and sort jobs
  const filteredJobs = wishlistJobs
    .filter(job => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        job.job_role?.toLowerCase().includes(query) ||
        job.job_title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return (b.avg_salary || 0) - (a.avg_salary || 0)
        case 'match':
          return (b.similarity_score || 0) - (a.similarity_score || 0)
        case 'date':
        default:
          return 0 // Keep original order (most recent first)
      }
    })

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified'
    // Salary is already in Lakhs from the API
    return `₹${Math.round(salary).toLocaleString()} LPA`
  }

  const getMatchColor = (score) => {
    if (!score) return 'text-gray-500'
    const percentage = score * 100
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

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
              
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-8 w-8 text-red-500 fill-current" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    My Job Wishlist
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Track and manage your saved job opportunities
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {wishlistJobs.length}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Saved Jobs</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {wishlistJobs.length > 0
                          ? Math.round(
                              wishlistJobs.reduce((sum, job) => sum + (job.similarity_score * 100 || 0), 0) / 
                              wishlistJobs.length
                            )
                          : 0}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Match Rate</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {wishlistJobs.length > 0
                          ? `₹${Math.round(wishlistJobs.reduce((sum, job) => sum + (job.avg_salary || 0), 0) / wishlistJobs.length).toLocaleString()}`
                          : '₹0'} LPA
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Salary</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs by title, company, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="date">Most Recent</option>
                      <option value="salary">Highest Salary</option>
                      <option value="match">Best Match</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Cards */}
              {filteredJobs.length === 0 ? (
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                  <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchQuery ? 'No jobs found' : 'Your wishlist is empty'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Start adding jobs from the Zenith dashboard to track opportunities'}
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
                <div className="space-y-4">
                  {filteredJobs.map((job, index) => (
                    <div
                      key={job.job_id || index}
                      className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {job.job_role || job.job_title || 'Job Title'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{job.company || 'Company'}</span>
                            </div>
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromWishlist(job.job_id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Remove from wishlist"
                        >
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Salary</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatSalary(job.avg_salary)}
                          </p>
                        </div>

                        {job.similarity_score && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Match Score</p>
                            <p className={`font-semibold ${getMatchColor(job.similarity_score)}`}>
                              {Math.round(job.similarity_score * 100)}%
                            </p>
                          </div>
                        )}

                        {job.experience_required && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {job.experience_required}
                            </p>
                          </div>
                        )}

                        {job.job_type && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Job Type</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {job.job_type}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Skills Required */}
                      {job.skills_required && job.skills_required.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Skills Required</p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills_required.slice(0, 8).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills_required.length > 8 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                +{job.skills_required.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {job.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                          {job.description}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedJobForChat(job)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition font-medium text-sm"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat with HR
                        </button>
                        {job.application_link && (
                          <a
                            href={job.application_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium text-sm"
                          >
                            Apply Now
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HR Interview Bot Modal */}
      {selectedJobForChat && (
        <HRInterviewBot 
          job={selectedJobForChat}
          onClose={() => setSelectedJobForChat(null)}
        />
      )}
    </div>
  )
}

export default JobWishlist
