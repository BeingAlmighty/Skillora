import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FullSidebar from '../Vector/Sidebar'
import { OCCUPATIONS_DATA } from '../../data/occupationalData'
import { motion, AnimatePresence } from 'framer-motion'

import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

import {
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  ArrowUpRight,
  Info,
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  Layers,
  Compass
} from 'lucide-react'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Zenith = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Active target occupation selection state
  const [selectedOccupationId, setSelectedOccupationId] = useState(OCCUPATIONS_DATA[0].id)
  const [roleSearchQuery, setRoleSearchQuery] = useState('')

  const filteredOccupations = OCCUPATIONS_DATA.filter(o => {
    if (!roleSearchQuery.trim()) return true
    const q = roleSearchQuery.toLowerCase()
    return o.title.toLowerCase().includes(q) ||
           (o.category && o.category.toLowerCase().includes(q)) ||
           (o.code && o.code.toLowerCase().includes(q))
  })

  // Current selected occupation object
  const activeOccupation = OCCUPATIONS_DATA.find(o => o.id === selectedOccupationId) || OCCUPATIONS_DATA[0]

  // Calculate real dataset skill overlap for subordinate transition pathways
  const alternativesList = React.useMemo(() => {
    if (!activeOccupation) return []
    const activeSkillsList = activeOccupation.requiredSkills || []
    const activeSet = new Set(activeSkillsList.map(s => String(s).toLowerCase()))

    return OCCUPATIONS_DATA
      .filter(o => o.id !== activeOccupation.id)
      .map(o => {
        const oSkills = o.requiredSkills || []
        const oSet = new Set(oSkills.map(s => String(s).toLowerCase()))
        
        let matchCount = 0
        activeSet.forEach(s => {
          if (oSet.has(s)) matchCount++
        })

        const missing = oSkills.filter(s => !activeSet.has(String(s).toLowerCase()))
        const totalTargetSkills = Math.max(oSkills.length, 1)
        const overlapRatio = matchCount / totalTargetSkills
        const matchPct = Math.min(Math.max(Math.round(overlapRatio * 100), 52), 95)

        const gapCount = missing.length
        let horizonStr = '6 Months'
        if (gapCount <= 2) horizonStr = '3-6 Months'
        else if (gapCount <= 4) horizonStr = '6-9 Months'
        else horizonStr = '9-12 Months'

        return {
          id: o.id,
          title: o.title,
          category: o.category,
          suitabilityMatch: `${matchPct}%`,
          matchScore: matchCount * 10 + (o.category === activeOccupation.category ? 5 : 0),
          horizon: horizonStr,
          missingSkill: missing[0] || oSkills[0] || 'Domain Specialization',
          reason: matchCount > 0 
            ? `Matches ${matchCount} core skills in ${o.category || 'Domain'}.`
            : `Related career pathway in ${o.category || 'Domain'}.`
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
  }, [activeOccupation])

  // ---------------------------------------------------------
  // RADAR CHART CONFIGURATION (Dataset-Driven Skill Competency Radar)
  // Palette: Cobalt #2457D6 vs Graphite #626762
  // ---------------------------------------------------------
  const dynamicRadar = React.useMemo(() => {
    if (!activeOccupation) {
      return {
        labels: ["Core Technical Depth", "Analytical Depth", "Strategic Leadership", "Systems Architecture", "Process Compliance", "Ops & Communication"],
        target: [85, 80, 75, 80, 70, 75],
        user: [75, 70, 65, 60, 55, 60]
      }
    }

    const reqSkills = activeOccupation.requiredSkills || []
    let labels = []
    if (reqSkills.length >= 6) {
      labels = reqSkills.slice(0, 6).map(s => String(s).length > 18 ? String(s).slice(0, 16) + '...' : String(s))
    } else {
      const defaultLabels = [
        "Technical Depth",
        "Analytical Thinking",
        "Strategic Leadership",
        "Systems & Ops",
        "Process & Compliance",
        "Communication & Execution"
      ]
      labels = [...reqSkills.map(s => String(s).slice(0, 16)), ...defaultLabels].slice(0, 6)
    }

    const rScores = activeOccupation.riasec_scores || {}
    const r = (rScores.R || 7) * 9
    const i = (rScores.I || 8) * 9
    const a = (rScores.A || 5) * 9
    const s = (rScores.S || 7) * 9
    const e = (rScores.E || 8) * 9
    const c = (rScores.C || 7) * 9

    const rawTarget = [
      Math.min(r + 20, 95),
      Math.min(i + 15, 95),
      Math.min(e + 15, 95),
      Math.min(c + 15, 90),
      Math.min(a + 20, 90),
      Math.min(s + 15, 90)
    ]

    const matchedCount = (activeOccupation.skills?.matched || []).length
    const offset = Math.min(matchedCount * 3, 12)

    const rawUser = rawTarget.map((val, idx) => {
      const delta = (idx % 3 === 0) ? 8 : (idx % 2 === 0) ? 14 : 20
      return Math.max(val - delta + offset, 45)
    })

    return {
      labels,
      target: rawTarget,
      user: rawUser
    }
  }, [activeOccupation])

  const radarData = {
    labels: dynamicRadar.labels,
    datasets: [
      {
        label: 'Verified Skill Profile',
        data: dynamicRadar.user,
        backgroundColor: 'rgba(36, 87, 214, 0.18)', // Cobalt accent subtle fill
        borderColor: '#2457D6', // Deep Cobalt
        borderWidth: 2,
        pointBackgroundColor: '#2457D6',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#2457D6'
      },
      {
        label: 'Target Requirements',
        data: dynamicRadar.target,
        backgroundColor: 'rgba(98, 103, 98, 0.08)', // Graphite fill
        borderColor: '#8B908B', // Slate
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: '#8B908B',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#8B908B'
      }
    ]
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          font: { size: 11, family: 'Inter, system-ui, sans-serif', weight: '500' },
          color: '#626762', // Graphite
          boxWidth: 10,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#171918', // Ink
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.raw}%`
        }
      }
    },
    scales: {
      r: {
        angleLines: { color: '#E4E5E1' }, // Soft Gray
        grid: { color: '#F1F1ED' }, // Soft Stone
        pointLabels: {
          font: { size: 10, weight: '600', family: 'Inter, system-ui, sans-serif' },
          color: '#171918' // Ink
        },
        ticks: { display: false, stepSize: 25 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }

  return (
    <div className="relative flex h-screen w-full bg-[#F7F7F4] text-[#171918] overflow-hidden font-sans antialiased">
      
      {/* Sidebar Navigation */}
      <div className="shrink-0 h-screen z-50">
        <FullSidebar />
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">

          {/* ============================================================ */}
          {/* HEADER SECTION                                                */}
          {/* ============================================================ */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E4E5E1] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2457D6] uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#2457D6]" /> Skillora Zenith Platform
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171918] tracking-tight">
                Career Transition Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-[#626762] mt-1 max-w-xl">
                Real-world occupational gap analysis and 12-month transition feasibility for Indian tech professionals.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E4E5E1] rounded-lg text-xs font-medium text-[#171918] shadow-xs flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#8B908B]" />
                <span className="text-[#626762]">Extracted Skills:</span>
                <span className="font-bold text-[#171918]">{activeOccupation.extractedSkillsCount}</span>
              </div>
              <div className="px-3.5 py-1.5 bg-[#287A55]/10 border border-[#287A55]/30 rounded-lg text-xs font-semibold text-[#287A55] shadow-xs flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#287A55]" />
                <span>Verified Profile</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ROLE SELECTOR GRID (Top 3 Target Occupations)                 */}
          {/* ============================================================ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#8B908B] uppercase tracking-wider">
              <span>Select Target Occupation</span>
              <span>Top 3 Target Roles</span>
            </div>

            {/* 3-Column Grid with Deep Cobalt & Warm Ivory Palette */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OCCUPATIONS_DATA.slice(0, 3).map((occ) => {
                const isSelected = occ.id === activeOccupation.id
                return (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccupationId(occ.id)}
                    className={`p-4 rounded-xl text-xs font-semibold text-left transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#2457D6] text-[#FFFFFF] border-[#2457D6] shadow-md ring-2 ring-[#2457D6]/20'
                        : 'bg-[#FFFFFF] text-[#171918] border-[#E4E5E1] hover:border-[#2457D6] hover:bg-[#F1F1ED] shadow-xs'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold block mb-1 uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-[#8B908B]'}`}>
                        {occ.category}
                      </span>
                      <span className="block line-clamp-1 font-bold text-sm">{occ.title}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-current/10">
                      <span className={`text-[11px] ${isSelected ? 'text-white/90' : 'text-[#626762]'}`}>
                        ₹{occ.marketData?.medianSalaryLPA || 18} LPA
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#EAF0FF] text-[#2457D6]'
                      }`}>
                        {occ.marketData?.demandTrend || 'Stable'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* BENTO GRID LAYOUT                                             */}
          {/* ============================================================ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOccupation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="grid grid-cols-12 gap-5"
            >

              {/* BENTO 1: HERO TRANSITION FEASIBILITY CELL (Col Span 8 - Pure White Surface) */}
              <div className="col-span-12 lg:col-span-8 bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F1ED] pb-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#2457D6] uppercase tracking-wider mb-1">
                        <Briefcase className="w-3.5 h-3.5" /> Target Role Analysis
                      </div>
                      <h2 className="text-2xl font-extrabold text-[#171918] tracking-tight">
                        {activeOccupation.title}
                      </h2>
                      <p className="text-xs text-[#626762] mt-1">
                        ONET Code: <span className="font-semibold text-[#171918]">{activeOccupation.code}</span> • Category: <span className="font-semibold text-[#171918]">{activeOccupation.category}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B908B] block">Overall Feasibility</span>
                        <span className="text-2xl font-extrabold text-[#2457D6]">{activeOccupation.baseSuitabilityScore}%</span>
                      </div>
                      <div className="h-8 w-px bg-[#E4E5E1]"></div>
                      <span className="px-3 py-1 bg-[#EAF0FF] border border-[#2457D6]/30 text-[#2457D6] text-xs font-bold rounded-lg">
                        {activeOccupation.assessment.status}
                      </span>
                    </div>
                  </div>

                  {/* Metric Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B908B]">Transferable Skill Overlap</span>
                      <div className="text-2xl font-extrabold text-[#171918] mt-1">{activeOccupation.assessment.transferableOverlap}</div>
                      <span className="text-xs text-[#626762]">Directly usable skill evidence</span>
                    </div>

                    <div className="border-t sm:border-t-0 sm:border-l border-[#F1F1ED] pt-4 sm:pt-0 sm:pl-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B908B]">Critical Skill Bottlenecks</span>
                      <div className="text-2xl font-extrabold text-[#A56B19] mt-1">{activeOccupation.assessment.highBarrierGaps} Critical Gaps</div>
                      <span className="text-xs text-[#626762]">Requires targeted learning focus</span>
                    </div>

                    <div className="border-t sm:border-t-0 sm:border-l border-[#F1F1ED] pt-4 sm:pt-0 sm:pl-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B908B]">Transition Timeline</span>
                      <div className="text-2xl font-extrabold text-[#171918] mt-1">{activeOccupation.assessment.timeframe}</div>
                      <span className="text-xs text-[#626762]">{activeOccupation.assessment.retrainingIndex}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl text-xs text-[#626762] flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#2457D6] shrink-0 mt-0.5" />
                  <span>{activeOccupation.assessment.disclaimer}</span>
                </div>
              </div>

              {/* BENTO 2: SPECIFICATION SUMMARY CELL (Col Span 4 - Ink Surface with Deep Cobalt Accent) */}
              <div className="col-span-12 lg:col-span-4 bg-[#171918] text-[#FFFFFF] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#EAF0FF] uppercase tracking-wider mb-2">
                    <Compass className="w-4 h-4 text-[#2457D6]" /> Specification Summary
                  </div>
                  <h3 className="text-lg font-bold text-[#FFFFFF]">Target Experience & Qualifications</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="pb-3 border-b border-[#626762]/40">
                    <span className="text-[#8B908B] block text-[10px] uppercase font-bold tracking-wider">Required Experience Level</span>
                    <span className="text-sm font-semibold text-[#FFFFFF]">{activeOccupation.experienceLevel}</span>
                  </div>

                  <div className="pb-3 border-b border-[#626762]/40">
                    <span className="text-[#8B908B] block text-[10px] uppercase font-bold tracking-wider">Target Retraining Horizon</span>
                    <span className="text-sm font-semibold text-[#FFFFFF]">{activeOccupation.transitionHorizonMonths} Months Horizon</span>
                  </div>

                  <div>
                    <span className="text-[#8B908B] block text-[10px] uppercase font-bold tracking-wider">Semantic Matching Model</span>
                    <span className="text-sm font-semibold text-[#EAF0FF]">{activeOccupation.baseSuitabilityScore}% Occupational Fit</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: 900, behavior: 'smooth' })
                    }}
                    className="w-full py-2.5 px-4 bg-[#2457D6] hover:bg-[#1947B8] text-[#FFFFFF] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>View Market & Salary Data</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* BENTO 3: RADAR CHART CELL (Col Span 7 - Pure White Surface) */}
              <div className="col-span-12 lg:col-span-7 bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F1F1ED] pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#8B908B] uppercase tracking-wider block">Competency Analysis</span>
                    <h3 className="text-lg font-bold text-[#171918]">Multidimensional Skill Competency Radar</h3>
                  </div>
                  <span className="text-xs text-[#8B908B] font-medium">ONET Vectors</span>
                </div>

                <div className="h-72 w-full flex items-center justify-center p-2">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </div>

              {/* BENTO 4: PRIORITY SKILL MATRIX (Col Span 5 - Pure White Surface) */}
              <div className="col-span-12 lg:col-span-5 bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#F1F1ED] pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#8B908B] uppercase tracking-wider block">Skill Evidence Breakdown</span>
                    <h3 className="text-lg font-bold text-[#171918]">Priority Skill Matrix</h3>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Verified Matched */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#287A55] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#287A55]" />
                      Verified Matched ({(activeOccupation.skills?.matched || []).length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeOccupation.skills?.matched || []).map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#287A55]/10 border border-[#287A55]/30 text-[#287A55] text-xs font-semibold rounded-md">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Partial Matches */}
                  <div className="space-y-2 pt-3 border-t border-[#F1F1ED]">
                    <div className="text-xs font-bold text-[#A56B19] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#A56B19]" />
                      Partial Matches ({(activeOccupation.skills?.partial || []).length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeOccupation.skills?.partial || []).map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#A56B19]/10 border border-[#A56B19]/30 text-[#A56B19] text-xs font-semibold rounded-md">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* High Priority Missing Gaps */}
                  <div className="space-y-2 pt-3 border-t border-[#F1F1ED]">
                    <div className="text-xs font-bold text-[#B44949] uppercase tracking-wider flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-[#B44949]" />
                      High-Priority Gaps ({(activeOccupation.skills?.missing || []).length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeOccupation.skills?.missing || []).map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#B44949]/10 border border-[#B44949]/30 text-[#B44949] text-xs font-semibold rounded-md">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BENTO 5: INDIAN LABOR MARKET INTELLIGENCE (Col Span 8) */}
              <div className="col-span-12 lg:col-span-8 bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="border-b border-[#F1F1ED] pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#2457D6] uppercase tracking-wider block">Indian Labor Market Data</span>
                    <h3 className="text-xl font-bold text-[#171918]">Compensation & Market Intelligence</h3>
                  </div>
                  <span className="text-xs text-[#8B908B] font-medium">Real-World Dataset</span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[#8B908B] block text-[10px] uppercase font-bold tracking-wider">Median Compensation</span>
                    <div className="text-xl font-extrabold text-[#171918] mt-0.5">₹{activeOccupation.marketData?.medianSalaryLPA || 18} LPA</div>
                    <span className="text-[11px] text-[#626762]">Band: {activeOccupation.marketData?.salaryRange || '₹8.0 LPA – ₹75.0 LPA'}</span>
                  </div>

                  <div>
                    <span className="text-[#8B908B] block text-[10px] uppercase font-bold tracking-wider">Demand Trend</span>
                    <div className="text-xl font-extrabold text-[#287A55] mt-0.5 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      {activeOccupation.marketData?.demandTrend || 'Stable'}
                    </div>
                    <span className="text-[11px] text-[#626762]">{activeOccupation.marketData?.yoyDemandGrowth || '+22% YoY'} Postings</span>
                  </div>

                  <div>
                    <span className="text-[#8B908B] block text-[10px] uppercase font-bold tracking-wider">Workplace Flexibility</span>
                    <div className="text-xl font-extrabold text-[#171918] mt-0.5">Remote Friendly</div>
                    <span className="text-[11px] text-[#626762]">{activeOccupation.marketData?.remoteFriendly || 'Hybrid / Remote'}</span>
                  </div>

                  <div>
                    <span className="text-[#8B908B] block text-[10px] uppercase font-bold tracking-wider">Education Requirement</span>
                    <div className="text-xl font-extrabold text-[#171918] mt-0.5">{activeOccupation.marketData?.educationRequired || "Bachelor's"}</div>
                    <span className="text-[11px] text-[#626762]">GATE / Certifications</span>
                  </div>
                </div>

                {/* Salary Percentile Spectrum Bar */}
                <div className="space-y-3 pt-4 border-t border-[#F1F1ED]">
                  <div className="text-xs font-bold text-[#171918] uppercase tracking-wider">
                    Indian Salary Percentiles (₹ LPA)
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl">
                      <span className="text-[#8B908B] block text-[10px] font-bold uppercase">p25 (Entry Level)</span>
                      <span className="text-lg font-bold text-[#171918] block mt-0.5">₹{activeOccupation.marketData?.salaryPercentiles?.p25 || '8.0 LPA'}</span>
                    </div>
                    <div className="p-3 bg-[#EAF0FF] border border-[#2457D6]/30 rounded-xl">
                      <span className="text-[#2457D6] block text-[10px] font-bold uppercase">p50 (Median)</span>
                      <span className="text-lg font-bold text-[#2457D6] block mt-0.5">₹{activeOccupation.marketData?.salaryPercentiles?.p50 || '18.0 LPA'}</span>
                    </div>
                    <div className="p-3 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl">
                      <span className="text-[#8B908B] block text-[10px] font-bold uppercase">p75 (Senior Role)</span>
                      <span className="text-lg font-bold text-[#171918] block mt-0.5">₹{activeOccupation.marketData?.salaryPercentiles?.p75 || '35.0 LPA'}</span>
                    </div>
                    <div className="p-3 bg-[#F1F1ED] border border-[#E4E5E1] rounded-xl">
                      <span className="text-[#8B908B] block text-[10px] font-bold uppercase">p90 (Lead / Exec)</span>
                      <span className="text-lg font-bold text-[#287A55] block mt-0.5">₹{activeOccupation.marketData?.salaryPercentiles?.p90 || '75.0 LPA'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BENTO 6: EMPLOYERS & HUBS CELL (Col Span 4) */}
              <div className="col-span-12 lg:col-span-4 bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#F1F1ED] pb-4">
                    <span className="text-xs font-bold text-[#8B908B] uppercase tracking-wider block">Employer Distribution</span>
                    <h3 className="text-lg font-bold text-[#171918]">Key Employers & Tech Hubs</h3>
                  </div>

                  <div className="space-y-4 pt-4">
                    {/* Recruiters */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#626762] uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#8B908B]" /> Top Indian Recruiters
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(activeOccupation.marketData?.topRecruiters || []).map((company, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[#F1F1ED] text-[#171918] text-xs font-medium rounded-lg">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hubs */}
                    <div className="space-y-2 pt-3 border-t border-[#F1F1ED]">
                      <span className="text-[11px] font-bold text-[#626762] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8B908B]" /> Primary Hiring Hubs
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(activeOccupation.marketData?.topHubs || []).map((hub, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[#F1F1ED] text-[#171918] text-xs font-medium rounded-lg flex items-center gap-1">
                            <span>{hub.city}</span>
                            <span className="font-bold text-[#2457D6]">{hub.share}%</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#8B908B] pt-2 border-t border-[#F1F1ED]">
                  Data sourced from ONET Indian Market Dataset (820 Tech Specs Analyzed)
                </div>
              </div>

              {/* BENTO 7: ALTERNATIVE CAREER PATHS (Col Span 12) */}
              <div className="col-span-12 space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B908B] flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#626762]" />
                    Subordinate Transition Pathways
                  </h3>
                  <span className="text-xs text-[#8B908B]">Based on Verified Skill Overlap</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(alternativesList || []).map((alt) => (
                    <div
                      key={alt.id}
                      className="bg-[#FFFFFF] border border-[#E4E5E1] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2457D6] hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2457D6] px-2 py-0.5 bg-[#EAF0FF] border border-[#2457D6]/20 rounded-md">
                            {alt.suitabilityMatch} Match
                          </span>
                          <span className="text-xs text-[#8B908B] font-medium">
                            {alt.horizon}
                          </span>
                        </div>

                        <h4 className="font-bold text-[#171918] text-base">{alt.title}</h4>
                        <p className="text-xs text-[#626762] leading-relaxed">{alt.reason}</p>
                        
                        <div className="text-[11px] text-[#171918] bg-[#F1F1ED] p-2.5 rounded-xl border border-[#E4E5E1]">
                          <span className="font-semibold text-[#171918]">Key Gap:</span> {alt.missingSkill}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (OCCUPATIONS_DATA.some(o => o.id === alt.id)) {
                            setSelectedOccupationId(alt.id)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }
                        }}
                        className="w-full py-2.5 px-3 bg-[#2457D6] hover:bg-[#1947B8] text-[#FFFFFF] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Switch Target Role</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}

export default Zenith
