import { OCCUPATIONS_DATA } from '../data/occupationalData'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export async function fetchOccupationsFromApi(params = {}) {
  try {
    const urlParams = new URLSearchParams()
    if (params.search) urlParams.append('search', params.search)
    if (params.domain) urlParams.append('domain', params.domain)
    if (params.demand_trend) urlParams.append('demand_trend', params.demand_trend)
    if (params.education) urlParams.append('education', params.education)
    if (params.remote_only !== undefined) urlParams.append('remote_only', params.remote_only)
    if (params.limit) urlParams.append('limit', params.limit)
    if (params.offset) urlParams.append('offset', params.offset)

    const response = await fetch(`${API_BASE_URL}/occupations/?${urlParams.toString()}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (err) {
    console.warn("Backend API offline or unreachable. Using local dataset fallback:", err)
    let filtered = OCCUPATIONS_DATA
    if (params.domain) {
      filtered = filtered.filter(o => o.category === params.domain || o.domain === params.domain)
    }
    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(o => 
        o.title.toLowerCase().includes(q) ||
        (o.category && o.category.toLowerCase().includes(q)) ||
        (o.code && o.code.toLowerCase().includes(q))
      )
    }
    const limit = params.limit || 100
    const offset = params.offset || 0
    return {
      total: filtered.length,
      limit,
      offset,
      occupations: filtered.slice(offset, offset + limit)
    }
  }
}

export async function fetchOccupationByIdFromApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/occupations/${id}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return await response.json()
  } catch (err) {
    console.warn(`Backend API unreachable for occupation ${id}. Using local fallback.`, err)
    return OCCUPATIONS_DATA.find(o => o.id === id || o.onet_soc_code === id || o.code?.includes(id)) || null
  }
}

export async function fetchDomainsFromApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/occupations/domains`)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return await response.json()
  } catch (err) {
    const domainsCount = {}
    OCCUPATIONS_DATA.forEach(o => {
      if (o.category) {
        domainsCount[o.category] = (domainsCount[o.category] || 0) + 1
      }
    })
    return Object.entries(domainsCount).map(([domain, count]) => ({ domain, count }))
  }
}
