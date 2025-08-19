import api from './api';
import { Member, CreateMemberRequest, UpdateMemberRequest} from '../types/Members';
import { ApiResponse, PaginatedResponse, FilterOptions } from '../types/Common';

/**
 * membersService
 * - Mirrors the style of eventService in your repo.
 * - NOTE: backend controller had ambiguous GET mappings for `/{id}` and `/{position}`.
 *   For safety this service calls `/members/position/{position}` for getByPosition.
 *   If your backend actually exposes `/members/{position}` (and disambiguates),
 *   change the route below accordingly.
 */
export const membersService = {
  async getAll(filters?: FilterOptions): Promise<Member[]> {
    const response = await api.get<ApiResponse<Member[]>>('/members', { params: filters });
    return response.data.data;
  },

  async getPaginated(page: number = 1, limit: number = 10, filters?: FilterOptions): Promise<PaginatedResponse<Member>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Member>>>('/members/paginated', {
      params: { page, limit, ...filters }
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Member> {
    const response = await api.get<ApiResponse<Member>>(`/members/${id}`);
    return response.data.data;
  },

  /**
   * getByPosition
   * NOTE: controller currently has a conflicting @GetMapping("/{position}") route.
   * Recommended backend change: expose a distinct route such as /members/position/{position}
   * or use a query parameter /members?position=...
   *
   * If your backend keeps the ambiguous mapping, change the URL to `/members/${position}`
   * but be aware of the collision with getById.
   */
  async getByPosition(position: string): Promise<Member[]> {
    const response = await api.get<ApiResponse<Member[]>>(`/members/position/${encodeURIComponent(position)}`);
    return response.data.data;
  },

   async getByPositionType(positionType: string): Promise<Member[]> {
    const response = await api.get<ApiResponse<Member[]>>(`/members/positionType/${encodeURIComponent(positionType)}`);
    return response.data.data;
  },

  async create(member: CreateMemberRequest): Promise<Member> {
    console.log('Member to be created: ', member);
    const response = await api.post<ApiResponse<Member>>('/members', member);
    console.log('Create member response:', response.data);
    return response.data.data;
  },

  async update(member: UpdateMemberRequest): Promise<Member> {
    const response = await api.put<ApiResponse<Member>>(`/members/${member.id}`, member);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/members/${id}`);
  },

  /**
   * uploadPhoto
   * - Expects backend endpoint to accept multipart/form-data at /members/upload-photo
   * - Returns uploaded file URL string (adjust to your ApiResponse shape)
   */
  async uploadPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse<{ url: string }>>('/members/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data.url;
  }
};

