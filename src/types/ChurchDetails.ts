export interface ChurchDetails {
  id?: string;
  name: string;
  address: string;
  poBox: string;
  city: string;
  province: string;
  country: string;
  tel?: string;
  cell: string[];
  email: string;
  website: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/** Payload used to create a new ChurchDetails */
export interface CreateChurchDetailsRequest {
  name: string;
  address: string;
  poBox?: string;
  city?: string;
  province?: string;
  country?: string;
  tel?: string;
  cell?: string[]; // array of phone numbers
  email?: string;
  website?: string;
}

/** Payload used to update an existing ChurchDetails (id required by service method) */
export interface UpdateChurchDetailsRequest extends Partial<CreateChurchDetailsRequest> {
  id: string;
}
