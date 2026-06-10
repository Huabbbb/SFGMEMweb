import axios from 'axios'
import type { MemResult, PhaseRequest, PhaseResponse, SfgGenerateRequest, SfgResult, FittingParams, MemCompareResult } from '../types/mem'

const api = axios.create({ baseURL: '/api' })

export async function runMem(
  file: File,
  nn?: number,
  nNout?: number,
  column?: number
): Promise<MemResult> {
  const formData = new FormData()
  formData.append('file', file)
  if (nn != null) formData.append('nn', String(nn))
  if (nNout != null) formData.append('nnout', String(nNout))
  if (column != null) formData.append('column', String(column))
  const { data } = await api.post<MemResult>('/mem/run', formData)
  return data
}

export async function applyPhase(params: PhaseRequest): Promise<PhaseResponse> {
  const { data } = await api.post<PhaseResponse>('/mem/phase', params)
  return data
}

export async function generateSfg(params: SfgGenerateRequest): Promise<SfgResult> {
  const { data } = await api.post<SfgResult>('/sfg/generate', params)
  return data
}

export async function runMemCompare(
  file: File,
  nn: number | undefined,
  column: number | undefined,
  fitParams: FittingParams,
): Promise<MemCompareResult> {
  const formData = new FormData()
  formData.append('file', file)
  if (nn != null) formData.append('nn', String(nn))
  if (column != null) formData.append('column', String(column))
  formData.append('params_json', JSON.stringify(fitParams))
  const { data } = await api.post<MemCompareResult>('/mem/compare', formData)
  return data
}
