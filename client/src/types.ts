import type React from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  location: LocationData | null;
  loadingLocation: boolean;
  city: string;
  // cart: ICart[] | null;
  // fetchCart: () => Promise<void>;
  // subTotal: number;
  // quauntity: number;
}

export interface IRestaurant {
  _id: string
  name: string;
  image: string;
  ownerId: string;
  description?: string;
  phone: number;
  isVerified: boolean

  autoLocation:{
      type: "Point";
      coordinates: [number,number];
      formattedAddress: string;
  };

  isOpen: boolean;
  createdAt: Date;
}