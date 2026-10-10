import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import FullSidebar from '../Vector/Sidebar'
import { OCCUPATIONS_DATA } from '../../data/occupationalData'

import {
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Edit2,
  X,
  FileText,
  Briefcase,
  Compass,
  MapPin,
  Building2,
  GraduationCap,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Target
} from 'lucide-react'

const ALL_DOMAINS = [
  "Information Technology & Computing",
  "Data Infrastructure & Engineering",
  "Artificial Intelligence & Research",
  "Cloud Architecture & Systems",
  "Management & Leadership",
  "Science & Research",
  "Business & Finance",
  "Engineering & Technology"
]

const ALL_CITIES = [
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Mumbai"
]

const Profile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const profileContext = useProfile() || {}

  const profileInfo = profileContext.profileInfo || {
    name: user?.name || user?.email?.split('@')[0] || 'Manas Kapoor',
    institution: 'NIT Delhi',
    degree: 'B.Tech',
    stream: 'Computer Science',
    year: '3rd Year',
    location: 'Delhi',
    bio: 'Software & Data Science student'
  }

  const careerPreferences = profileContext.careerPreferences || {
    preferredDomains: ['Information Technology & Computing', 'Data Infrastructure & Engineering'],
    preferredCities: ['Delhi NCR', 'Bengaluru', 'Hyderabad'],
    preferredWorkMode: 'Remote preferred',
    targetCareerAreas: 'Software / Data / AI'
  }

  const savedTargetCareers = Array.isArray(profileContext.savedTargetCareers) && profileContext.savedTargetCareers.length > 0
    ? profileContext.savedTargetCareers
    : ['software-developer', 'database-architect']

  const userSkills = Array.isArray(profileContext.userSkills) ? profileContext.userSkills : []
  const riasecAssessment = profileContext.riasecAssessment || null
  const updateProfileInfo = profileContext.updateProfileInfo || (() => {})
  const updateCareerPreferences = profileContext.updateCareerPreferences || (() => {})
  const addSkill = profileContext.addSkill || (() => {})
  const removeSkill = profileContext.removeSkill || (() => {})

  // Modal and accordion states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [selectedSnapshotId, setSelectedSnapshotId] = useState(savedTargetCareers[0] || 'software-developer')
  const [expandedSkillId, setExpandedSkillId] = useState(null)

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: profileInfo.name || 'Manas Kapoor',
    institution: profileInfo.institution || 'NIT Delhi',
    degree: profileInfo.degree || 'B.Tech',
    stream: profileInfo.stream || 'Computer Science',
    year: profileInfo.year || '3rd Year',
    location: profileInfo.location || 'Delhi',
    bio: profileInfo.bio || ''
  })

  // Add skill form state
  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 'Intermediate',
    status: 'User reported',
    snippet: ''
  })

  // Handle Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateProfileInfo(editForm)
    setShowEditProfileModal(false)
  }

  // Handle Add Skill Save
  const handleSaveSkill = (e) => {
    e.preventDefault()
    if (!skillForm.name.trim()) return
    addSkill({
      name: skillForm.name.trim(),
      level: skillForm.level,
      status: skillForm.status,
      sourcesCount: skillForm.status === 'Evidence-backed' ? 2 : 1,
      snippet: skillForm.snippet || 'User self-declared skill competency.'
    })
    setSkillForm({ name: '', level: 'Intermediate', status: 'User reported', snippet: '' })
    setShowAddSkillModal(false)
  }

  // Skill Statistics
  const totalSkills = userSkills.length
  const evidenceBackedCount = userSkills.filter(s => s.status === 'Evidence-backed').length
  const acceptedCount = userSkills.filter(s => s.status === 'Accepted' || s.status === 'Evidence-backed').length
  const needsReviewCount = userSkills.filter(s => s.status === 'Needs review').length

  // Selected Target Career Object directly from dataset
  const activeSnapshotOccupation = OCCUPATIONS_DATA.find(o => o.id === selectedSnapshotId) || OCCUPATIONS_DATA[0]

  const userInitials = (profileInfo.name || 'MK')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'MK'

  return (
    <FullSidebar>
      <div className="bg-[#F7F7F4] text-[#171918] min-h-screen w-full font-sans antialiased">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-10">

          {/* ============================================================ */}
          {/* SECTION 1: EDITORIAL PROFILE HEADER                           */}
          {/* ============================================================ */}
          <div className="border-b border-[#E4E5E1] pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Minimal Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#F1F1ED] border border-[#E4E5E1] flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-[#171918]">
                  {userInitials}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171918] tracking-tight">
                  {profileInfo.name}
                </h1>
                <p className="text-sm font-semibold text-[#626762] mt-1">
                  {profileInfo.institution} • {profileInfo.degree} ({profileInfo.stream}) • {profileInfo.year}
                </p>
                <p className="text-xs text-[#8B908B] mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8B908B]" /> {profileInfo.location}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditForm({
                  name: profileInfo.name,
                  institution: profileInfo.institution,
                  degree: profileInfo.degree,
                  stream: profileInfo.stream,
                  year: profileInfo.year,
                  location: profileInfo.location,
                  bio: profileInfo.bio
                })
                setShowEditProfileModal(true)
              }}
              className="px-4 py-2 bg-[#FFFFFF] border border-[#E4E5E1] hover:border-[#2457D6] hover:bg-[#F1F1ED] text-[#171918] text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 self-start"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#2457D6]" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: CAREER PROFILE (ABOUT & EDUCATION)                 */}
          {/* ============================================================ */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B908B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#171918]" />
              Career Profile Overview
            </h2>

            <div className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs divide-y sm:divide-y-0 sm:divide-x divide-[#F1F1ED]">
                <div>
                  <span className="text-[#8B908B] block font-bold uppercase text-[10px] tracking-wider mb-1">Education Degree</span>
                  <span className="font-bold text-[#171918] text-base">{profileInfo.degree}</span>
                </div>
                <div className="pt-4 sm:pt-0 sm:pl-6">
                  <span className="text-[#8B908B] block font-bold uppercase text-[10px] tracking-wider mb-1">Institution</span>
                  <span className="font-bold text-[#171918] text-base">{profileInfo.institution}</span>
                </div>
                <div className="pt-4 sm:pt-0 sm:pl-6">
                  <span className="text-[#8B908B] block font-bold uppercase text-[10px] tracking-wider mb-1">Academic Stream</span>
                  <span className="font-bold text-[#171918] text-base">{profileInfo.stream}</span>
                </div>
                <div className="pt-4 sm:pt-0 sm:pl-6">
                  <span className="text-[#8B908B] block font-bold uppercase text-[10px] tracking-wider mb-1">Target Areas</span>
                  <span className="font-bold text-[#2457D6] text-base">{careerPreferences.targetCareerAreas}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3 & 4: MY SKILLS & FACTUAL SKILL SUMMARY             */}
          {/* ============================================================ */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B908B] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#171918]" />
                My Verified & Reported Skills
              </h2>

              <button
                onClick={() => setShowAddSkillModal(true)}
                className="px-3.5 py-1.5 bg-[#2457D6] hover:bg-[#1947B8] text-[#FFFFFF] text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Factual Skill Summary Strip (No fake scores!) */}
            <div className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#F1F1ED] rounded-xl border border-[#E4E5E1]">
                <span className="text-[#8B908B] block text-[10px] font-bold uppercase">Skills Identified</span>
                <span className="text-xl font-extrabold text-[#171918] block mt-0.5">{totalSkills}</span>
              </div>
              <div className="p-3 bg-[#287A55]/10 rounded-xl border border-[#287A55]/30">
                <span className="text-[#287A55] block text-[10px] font-bold uppercase">Evidence-Backed</span>
                <span className="text-xl font-extrabold text-[#287A55] block mt-0.5">{evidenceBackedCount}</span>
              </div>
              <div className="p-3 bg-[#EAF0FF] rounded-xl border border-[#2457D6]/30">
                <span className="text-[#2457D6] block text-[10px] font-bold uppercase">Accepted Skills</span>
                <span className="text-xl font-extrabold text-[#2457D6] block mt-0.5">{acceptedCount}</span>
              </div>
              <div className="p-3 bg-[#A56B19]/10 rounded-xl border border-[#A56B19]/30">
                <span className="text-[#A56B19] block text-[10px] font-bold uppercase">Needs Review</span>
                <span className="text-xl font-extrabold text-[#A56B19] block mt-0.5">{needsReviewCount}</span>
              </div>
            </div>

            {/* Skills List Table */}
            <div className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 shadow-xs space-y-3">
              {userSkills.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#8B908B]">
                  No skills recorded yet. Click "Add Skill" to add your skills.
                </div>
              ) : (
                userSkills.map((skill) => {
                  const isExpanded = expandedSkillId === skill.id
                  return (
                    <div
                      key={skill.id}
                      className="p-4 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl space-y-3 transition-colors hover:border-[#2457D6]/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-[#171918]">{skill.name}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-[#F1F1ED] text-[#626762] rounded border border-[#E4E5E1]">
                            {skill.level}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Status Badge */}
                          {skill.status === 'Evidence-backed' && (
                            <span className="px-2.5 py-1 bg-[#287A55]/10 border border-[#287A55]/30 text-[#287A55] text-xs font-bold rounded-lg flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Evidence-backed ({skill.sourcesCount || 1} sources)
                            </span>
                          )}
                          {skill.status === 'Accepted' && (
                            <span className="px-2.5 py-1 bg-[#EAF0FF] border border-[#2457D6]/30 text-[#2457D6] text-xs font-bold rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Accepted
                            </span>
                          )}
                          {skill.status === 'User reported' && (
                            <span className="px-2.5 py-1 bg-[#F1F1ED] border border-[#E4E5E1] text-[#626762] text-xs font-bold rounded-lg">
                              User reported
                            </span>
                          )}
                          {skill.status === 'Needs review' && (
                            <span className="px-2.5 py-1 bg-[#A56B19]/10 border border-[#A56B19]/30 text-[#A56B19] text-xs font-bold rounded-lg flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Needs review
                            </span>
                          )}

                          {/* Expand snippet toggle */}
                          {skill.snippet && (
                            <button
                              onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                              className="text-xs font-semibold text-[#2457D6] hover:underline flex items-center gap-1"
                            >
                              <span>{isExpanded ? 'Hide' : 'View evidence'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="text-[#8B908B] hover:text-[#B44949] p-1 transition-colors"
                            title="Remove Skill"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Evidence Snippet Panel */}
                      {isExpanded && skill.snippet && (
                        <div className="p-3 bg-[#FFFFFF] border border-[#E4E5E1] rounded-lg text-xs text-[#626762] space-y-1">
                          <span className="font-bold text-[#171918] block">Supporting Evidence Note:</span>
                          <p className="italic">"{skill.snippet}"</p>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 5: CAREER PREFERENCES                                 */}
          {/* ============================================================ */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B908B] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#171918]" />
              Explicit Career Preferences
            </h2>

            <div className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              
              {/* Preferred Domains */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#171918] block">Target Career Domains</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DOMAINS.map((domain) => {
                    const isSelected = (careerPreferences.preferredDomains || []).includes(domain)
                    return (
                      <button
                        key={domain}
                        onClick={() => {
                          const currentDomains = careerPreferences.preferredDomains || []
                          const updated = isSelected
                            ? currentDomains.filter(d => d !== domain)
                            : [...currentDomains, domain]
                          updateCareerPreferences({ preferredDomains: updated })
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#2457D6] text-[#FFFFFF] border-[#2457D6]'
                            : 'bg-[#F1F1ED] text-[#626762] border-[#E4E5E1] hover:border-[#2457D6]'
                        }`}
                      >
                        {domain}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preferred Locations */}
              <div className="space-y-2 pt-4 border-t border-[#F1F1ED]">
                <label className="text-xs font-bold text-[#171918] block">Preferred Indian Employment Hubs</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CITIES.map((city) => {
                    const isSelected = (careerPreferences.preferredCities || []).includes(city)
                    return (
                      <button
                        key={city}
                        onClick={() => {
                          const currentCities = careerPreferences.preferredCities || []
                          const updated = isSelected
                            ? currentCities.filter(c => c !== city)
                            : [...currentCities, city]
                          updateCareerPreferences({ preferredCities: updated })
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#2457D6] text-[#FFFFFF] border-[#2457D6]'
                            : 'bg-[#F1F1ED] text-[#626762] border-[#E4E5E1] hover:border-[#2457D6]'
                        }`}
                      >
                        {city}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Work Preference Radio Selection */}
              <div className="space-y-2 pt-4 border-t border-[#F1F1ED]">
                <label className="text-xs font-bold text-[#171918] block">Work Mode Preference</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {["Remote preferred", "Hybrid", "On-site", "No preference"].map((mode) => {
                    const isSelected = careerPreferences.preferredWorkMode === mode
                    return (
                      <button
                        key={mode}
                        onClick={() => updateCareerPreferences({ preferredWorkMode: mode })}
                        className={`p-3 rounded-xl border font-semibold text-center transition-all ${
                          isSelected
                            ? 'bg-[#EAF0FF] text-[#2457D6] border-[#2457D6]'
                            : 'bg-[#F1F1ED] text-[#626762] border-[#E4E5E1] hover:border-[#8B908B]'
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>


          {/* ============================================================ */}
          {/* SECTION 8: TARGET CAREERS                                     */}
          {/* ============================================================ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B908B] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#171918]" />
                Saved Target Careers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedTargetCareers.map((occId) => {
                const occ = OCCUPATIONS_DATA.find(o => o.id === occId || o.onet_soc_code === occId || o.code?.includes(occId))
                if (!occ) return null
                const isSelected = selectedSnapshotId === occ.id
                return (
                  <div
                    key={occ.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-[#FFFFFF] border-[#2457D6] shadow-sm ring-1 ring-[#2457D6]'
                        : 'bg-[#FFFFFF] border-[#E4E5E1] hover:border-[#8B908B]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#8B908B] uppercase tracking-wider block">{occ.code}</span>
                        <h3 className="font-bold text-[#171918] text-base mt-0.5">{occ.title}</h3>
                        <span className="text-xs text-[#626762] block mt-1">{occ.category}</span>
                      </div>

                      <button
                        onClick={() => setSelectedSnapshotId(occ.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          isSelected
                            ? 'bg-[#2457D6] text-[#FFFFFF] border-[#2457D6]'
                            : 'bg-[#F1F1ED] text-[#2457D6] border-[#E4E5E1] hover:border-[#2457D6]'
                        }`}
                      >
                        {isSelected ? 'Viewing Snapshot' : 'View Snapshot'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 9: DATASET-GROUNDED CAREER SNAPSHOT                  */}
          {/* ============================================================ */}
          {activeSnapshotOccupation && (
            <div className="space-y-4 pt-4 border-t border-[#E4E5E1]">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2457D6] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2457D6]" />
                  Dataset Factual Snapshot: {activeSnapshotOccupation.title}
                </h2>
                <span className="text-xs text-[#8B908B]">Direct Dataset Facts</span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                
                {/* 4 Metrics Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl">
                    <span className="text-[#8B908B] block font-bold uppercase text-[10px]">Demand Trend</span>
                    <span className="text-base font-extrabold text-[#287A55] block mt-1">{activeSnapshotOccupation.marketData.demandTrend}</span>
                  </div>
                  <div className="p-3.5 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl">
                    <span className="text-[#8B908B] block font-bold uppercase text-[10px]">Median Salary</span>
                    <span className="text-base font-extrabold text-[#171918] block mt-1">₹{activeSnapshotOccupation.marketData.medianSalaryLPA} LPA</span>
                  </div>
                  <div className="p-3.5 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl">
                    <span className="text-[#8B908B] block font-bold uppercase text-[10px]">Workplace Flexibility</span>
                    <span className="text-base font-extrabold text-[#171918] block mt-1">Remote Allowed</span>
                  </div>
                  <div className="p-3.5 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl">
                    <span className="text-[#8B908B] block font-bold uppercase text-[10px]">Required Education</span>
                    <span className="text-base font-extrabold text-[#171918] block mt-1">{activeSnapshotOccupation.marketData.educationRequired}</span>
                  </div>
                </div>

                {/* Salary Percentiles */}
                <div className="space-y-2 pt-2 border-t border-[#F1F1ED]">
                  <span className="text-xs font-bold text-[#171918] uppercase tracking-wider block">Indian Market Salary Percentiles</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl">
                      <span className="text-[#8B908B] block text-[10px]">p25 (Entry Level)</span>
                      <span className="text-sm font-bold text-[#171918]">₹{activeSnapshotOccupation.marketData.salaryPercentiles.p25}</span>
                    </div>
                    <div className="p-3 bg-[#EAF0FF] border border-[#2457D6]/30 rounded-xl">
                      <span className="text-[#2457D6] block text-[10px] font-bold">p50 (Median)</span>
                      <span className="text-sm font-bold text-[#2457D6]">₹{activeSnapshotOccupation.marketData.salaryPercentiles.p50}</span>
                    </div>
                    <div className="p-3 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl">
                      <span className="text-[#8B908B] block text-[10px]">p75 (Senior Role)</span>
                      <span className="text-sm font-bold text-[#171918]">₹{activeSnapshotOccupation.marketData.salaryPercentiles.p75}</span>
                    </div>
                    <div className="p-3 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl">
                      <span className="text-[#8B908B] block text-[10px]">p90 (Lead / Principal)</span>
                      <span className="text-sm font-bold text-[#287A55]">₹{activeSnapshotOccupation.marketData.salaryPercentiles.p90}</span>
                    </div>
                  </div>
                </div>

                {/* Recruiters & Hubs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#F1F1ED] text-xs">
                  <div>
                    <span className="font-bold text-[#171918] block mb-2">Top Employers in India</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSnapshotOccupation.marketData.topRecruiters.map((emp, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#F1F1ED] border border-[#E4E5E1] text-[#171918] rounded-md font-medium">
                          {emp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-[#171918] block mb-2">Primary Hiring Hubs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSnapshotOccupation.marketData.topHubs.map((hub, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#F1F1ED] border border-[#E4E5E1] text-[#171918] rounded-md font-medium flex items-center gap-1">
                          <span>{hub.city}</span>
                          <span className="font-bold text-[#2457D6]">{hub.share}%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ============================================================ */}
      {/* EDIT PROFILE MODAL                                           */}
      {/* ============================================================ */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-100 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1F1ED] pb-4">
              <h3 className="text-lg font-bold text-[#171918]">Edit Career Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-[#8B908B] hover:text-[#171918]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#171918] mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171918] mb-1">Institution</label>
                  <input
                    type="text"
                    value={editForm.institution}
                    onChange={e => setEditForm({ ...editForm, institution: e.target.value })}
                    className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#171918] mb-1">Degree</label>
                  <input
                    type="text"
                    value={editForm.degree}
                    onChange={e => setEditForm({ ...editForm, degree: e.target.value })}
                    className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171918] mb-1">Academic Stream</label>
                  <input
                    type="text"
                    value={editForm.stream}
                    onChange={e => setEditForm({ ...editForm, stream: e.target.value })}
                    className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#171918] mb-1">Current Year</label>
                  <input
                    type="text"
                    value={editForm.year}
                    onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#171918] mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F1ED]">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 bg-[#F1F1ED] text-[#626762] rounded-xl font-semibold hover:bg-[#E4E5E1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2457D6] text-[#FFFFFF] rounded-xl font-semibold hover:bg-[#1947B8]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD SKILL MODAL                                              */}
      {/* ============================================================ */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-100 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1F1ED] pb-4">
              <h3 className="text-lg font-bold text-[#171918]">Add Skill Record</h3>
              <button onClick={() => setShowAddSkillModal(false)} className="text-[#8B908B] hover:text-[#171918]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#171918] mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Python, SQL, System Design"
                  value={skillForm.name}
                  onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171918] mb-1">Proficiency Level</label>
                  <select
                    value={skillForm.level}
                    onChange={e => setSkillForm({ ...skillForm, level: e.target.value })}
                    className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#171918] mb-1">Evidence Status</label>
                  <select
                    value={skillForm.status}
                    onChange={e => setSkillForm({ ...skillForm, status: e.target.value })}
                    className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                  >
                    <option value="User reported">User reported</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Evidence-backed">Evidence-backed</option>
                    <option value="Needs review">Needs review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#171918] mb-1">Supporting Evidence / Project Note</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Built data processing scripts and SQL query pipeline."
                  value={skillForm.snippet}
                  onChange={e => setSkillForm({ ...skillForm, snippet: e.target.value })}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#E4E5E1] rounded-xl text-[#171918] focus:outline-none focus:border-[#2457D6]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F1ED]">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 bg-[#F1F1ED] text-[#626762] rounded-xl font-semibold hover:bg-[#E4E5E1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2457D6] text-[#FFFFFF] rounded-xl font-semibold hover:bg-[#1947B8]"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FullSidebar>
  )
}

export default Profile
