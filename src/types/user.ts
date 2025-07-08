export interface UserAddress {
  id: number;
  type: "billing" | "shipping";
  firstName: string;
  lastName: string;
  address: string;
  addressComplement?: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  addresses: UserAddress[];
}

export interface AddressFormData {
  firstName: string;
  lastName: string;
  address: string;
  addressComplement?: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}
