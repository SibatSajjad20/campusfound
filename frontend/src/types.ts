import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
  itemsReported: number;
  itemsFound: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LostItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl: string;
  type: 'lost' | 'found';
  status: 'pending' | 'active' | 'rejected' | 'resolved';
  reportedBy: any;
  resolvedBy?: any;
  resolvedAt?: string;
  contactInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportItemData {
  title: string;
  description: string;
  category: string;
  location: string;
  type: 'lost' | 'found';
  image?: File;
}

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  _id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface TechStackItem {
  name: string;
  color: string;
}

export interface SearchFilters {
  category?: string;
  location?: string;
  type?: 'lost' | 'found';
  dateRange?: {
    from: string;
    to: string;
  };
}