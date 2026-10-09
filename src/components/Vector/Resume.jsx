import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useImageUpload } from "../../hooks/use-image-upload"
import { ImagePlus, X, Upload, Trash2, CheckCircle2 } from "lucide-react"
import { useCallback, useState } from "react"
import { cn } from "../../lib/utils"
import api from "../../api/client"
import { useAuth } from "../../context/AuthContext"
import { useProfile } from "../../context/ProfileContext"

export default function ResumeUploader() {
  const { user } = useAuth()
  const { addSkill, userSkills } = useProfile()
  
  const {
    previewUrl,
    fileName,
    fileInputRef,
    file,
    extractedText,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload({
    onUpload: (payload) => {
      console.log("onUpload payload:", payload)
    },
  })

  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const submitUpload = async () => {
    setError(null)
    setAnalysis(null)
    setSuccessMessage(null)
    
    const currentFile = file
    if (!currentFile) {
      setError('No file selected')
      return
    }

    // Try to get UUID from various possible user fields
    let uuid = user?.uuid || 
               user?.id || 
               user?.user_id || 
               user?.userId

    // If no UUID in user object, check localStorage for this user's UUID
    if (!uuid && user?.email) {
      const storageKey = `user_uuid_${user.email}`
      uuid = localStorage.getItem(storageKey)
      
      if (!uuid) {
        // Generate a new UUID for this user
        uuid = crypto.randomUUID()
        localStorage.setItem(storageKey, uuid)
      }
    } else if (!uuid) {
      uuid = localStorage.getItem('user_uuid') || crypto.randomUUID()
      localStorage.setItem('user_uuid', uuid)
    }

    const fd = new FormData()
    fd.append('file', currentFile)
    fd.append('uuid', uuid)

    try {
      setLoading(true)
      
      // Call the resume parsing API
      const response = await fetch('https://resume-u4su.onrender.com/parse-resume', {
        method: 'POST',
        body: fd,
      })

      // Try to get error details from response
      const contentType = response.headers.get('content-type')
      let result
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        throw new Error(`Server error: ${response.status}. ${text.substring(0, 200)}`)
      }

      if (!response.ok) {
        throw new Error(result.message || result.detail || `HTTP error! status: ${response.status}`)
      }
      
      if (result.success && result.skills && result.skills.length > 0) {
        // Get existing skill names (case-insensitive)
        const existingSkillNames = userSkills.map(s => s.name.toLowerCase())
        
        // Filter out skills that already exist
        const newSkills = result.skills.filter(
          skillName => !existingSkillNames.includes(skillName.toLowerCase())
        )
        
        // Add new skills to profile
        let addedCount = 0
        newSkills.forEach(skillName => {
          addSkill({
            name: skillName,
            level: 'Intermediate',
            progress: 0,
            relatedJobs: [],
            nextSteps: []
          })
          addedCount++
        })
        
        setAnalysis(result)
        setSuccessMessage(
          `✅ Resume parsed successfully! Found ${result.skills.length} skills. ` +
          `${addedCount} new skill${addedCount !== 1 ? 's' : ''} added to your profile. `
        )
      } else {
        setError(result.message || 'No skills found in resume')
      }
    } catch (err) {
      setError(err.message || 'Failed to parse resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const f = e.dataTransfer.files?.[0]
      if (f) {
        const fakeEvent = { target: { files: [f] } }
        handleFileChange(fakeEvent)
      }
    },
    [handleFileChange],
  )

  return (
    <div className="w-full max-w-xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upload Resume</h3>
        <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX, JPG, PNG</p>
      </div>

      <Input
        type="file"
        accept="image/*,application/pdf,.pdf,.doc,.docx"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!previewUrl ? (
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
            isDragging && "border-primary/50 bg-primary/5",
          )}
        >
          <div className="rounded-full bg-background p-3 shadow-sm">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to select</p>
            <p className="text-xs text-muted-foreground">or drag and drop file here</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="group relative h-64 overflow-hidden rounded-lg border">
            {file?.type === 'application/pdf' ? (
              <object data={previewUrl} type="application/pdf" width="100%" height="100%">
                <p>Preview not available. Download the file to view.</p>
              </object>
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button size="sm" variant="secondary" onClick={handleThumbnailClick} className="h-9 w-9 p-0">
                <Upload className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={handleRemove} className="h-9 w-9 p-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {fileName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="truncate">{fileName}</span>
              <button onClick={handleRemove} className="ml-auto rounded-full p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button onClick={submitUpload} disabled={loading || !file}>
          {loading ? 'Parsing Resume...' : 'Parse Resume '}
        </Button>
        <Button variant="ghost" onClick={handleRemove} disabled={!file}>Remove</Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-md border border-green-500 bg-green-50 dark:bg-green-950 p-4 text-sm text-green-700 dark:text-green-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {analysis && analysis.skills && (
        <div className="mt-4 rounded-md border border-border bg-muted/50 p-4">
          <h4 className="font-semibold mb-3 text-lg">Extracted Skills ({analysis.skills.length})</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium border border-orange-300 dark:border-orange-700"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            UUID: {analysis.uuid}
          </p>
        </div>
      )}
    </div>
  )
}
