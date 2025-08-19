export interface Member {
    id: string;
    position: string;
    firstname: string;
    lastname: string;
    positionType: string;
    photoUrl?: string;
    email: string;
    phone?: string;
}
export interface CreateMemberRequest {
    position: string;
    firstname: string;
    lastname: string;
    positionType: string;
    photoUrl?: string;
    email: string;
    phone?: string;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
    id: string;
}
