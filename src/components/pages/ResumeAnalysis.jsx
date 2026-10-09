import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ResumeUploader from '../Vector/Resume'

const ResumeAnalysis = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 flex justify-center flex-col items-center">
      <h2 className="text-4xl font-semibold mb-4">Resume Analysis</h2>
      <ResumeUploader />
    </div>
  )
}

export default ResumeAnalysis