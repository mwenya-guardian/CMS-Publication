import api from './api';
import { ApiResponse } from '../types/Common';
import { ChurchDetails, CreateChurchDetailsRequest, UpdateChurchDetailsRequest } from '../types/ChurchDetails';

const BASE = '/church-details';

export const churchDetailsService = {
  async getAll(): Promise<ChurchDetails[]> {
    const resp = await api.get<ApiResponse<ChurchDetails[]>>(BASE);
    return resp.data.data;
  },

  async getById(id: string): Promise<ChurchDetails> {
    const resp = await api.get<ApiResponse<ChurchDetails>>(`${BASE}/${encodeURIComponent(id)}`);
    return resp.data.data;
  },

  async create(payload: CreateChurchDetailsRequest): Promise<ChurchDetails> {
    const resp = await api.post<ApiResponse<ChurchDetails>>(BASE, payload);
    return resp.data.data;
  },

  async update(payload: UpdateChurchDetailsRequest): Promise<ChurchDetails> {
    const { id, ...body } = payload;
    const resp = await api.put<ApiResponse<ChurchDetails>>(`${BASE}/${encodeURIComponent(id)}`, body);
    return resp.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${BASE}/${encodeURIComponent(id)}`);
  },
};

