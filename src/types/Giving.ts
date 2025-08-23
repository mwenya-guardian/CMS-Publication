export interface Giving {
  id?: string;
  title: string;
  method: string[]; 
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface GivingRequest {
  title: string;
  method: string[]; 
}

export interface UpdateGivingRequest extends GivingRequest {
  id: string;
}
