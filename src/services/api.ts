import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Appointment {
  id: number;
  doctor_name: string;
  doctor_specialization: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason?: string;
  notes?: string;
  is_past: boolean;
  patient?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  address: string;
  role: 'patient' | 'admin';
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface LaboratoryTest {
  id: number;
  test_name: string;
  test_description: string;
  test_date: string;
  test_time: string;
  status: string;
  notes?: string;
  is_past: boolean;
  patient_id?: string;
  patient?: string;
  patient_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PharmacyOrder {
  id: number;
  patient_id: string;
  patient?: string;
  medicine_name: string;
  quantity: number;
  price_per_unit: number;
  medicine_image?: string;
  total_amount: number;
  order_date: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  delivery_address?: string;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

export interface MedicalRecord {
  id: number;
  patient: number;
  patient_name: string;
  title: string;
  description: string | null;
  file: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Setting auth header:', `Bearer ${token}`);
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      console.log('Unauthorized error - clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (phone: string, password: string) => {
    const response = await api.post<LoginResponse>('/auth/login/', { phone, password });
    const { access, refresh, user } = response.data;
    
    // Store tokens and user data
    localStorage.setItem('token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response;
  },
  register: async (data: {
    phone: string;
    password: string;
    name: string;
    email: string;
    address: string;
  }) => {
    const cleanedPhone = data.phone.replace(/\D/g, '');

    if (cleanedPhone.length !== 10 || !cleanedPhone.startsWith('9')) {
      throw new Error('Phone number must be 10 digits starting with 9');
    }
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const payload = {
      phone: cleanedPhone,
      name: data.name,
      email: data.email,
      password: data.password,
      address: data.address,
    };

    return api.post('/auth/register/', payload);
  },
  getProfile: () => {
    return api.get<User>('/users/me/');
  },
};

export const appointments = {
  getAll: () => {
    return api.get<Appointment[]>('/appointments/');
  },
  create: (data: {
    doctor_name: string;
    doctor_specialization: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
    patient?: string;
  }) => {
    return api.post<Appointment>('/appointments/', data);
  },
  update: (id: number, data: Partial<Appointment>) => {
    return api.patch<Appointment>(`/appointments/${id}/`, data);
  },
  cancel: (id: number) => {
    return api.patch<Appointment>(`/appointments/${id}/`, { status: 'cancelled' });
  },
};

export const laboratoryTests = {
  getAll: () => {
    return api.get<LaboratoryTest[]>('/laboratory-tests/');
  },
  create: (data: {
    test_name: string;
    test_description: string;
    test_date: string;
    test_time: string;
    patient_id: string;
  }) => {
    return api.post<LaboratoryTest>('/laboratory-tests/', data);
  },
  update: (id: number, data: Partial<LaboratoryTest>) => {
    return api.patch<LaboratoryTest>(`/laboratory-tests/${id}/`, data);
  },
  cancel: (id: number) => {
    return api.patch<LaboratoryTest>(`/laboratory-tests/${id}/`, { status: 'cancelled' });
  }
};

export const pharmacyOrders = {
  getAll: () => {
    return api.get<PharmacyOrder[]>('/pharmacy-orders/');
  },
  create: (data: {
    patient_id: string;
    medicine_name: string;
    quantity: number;
    price_per_unit: number;
    medicine_image?: string;
    total_amount: number;
    delivery_address?: string;
    payment_method?: string;
  }) => {
    return api.post<PharmacyOrder>('/pharmacy-orders/', data);
  },
  getById: (id: number) => {
    return api.get<PharmacyOrder>(`/pharmacy-orders/${id}/`);
  },
  update: (id: number, data: Partial<PharmacyOrder>) => {
    return api.patch<PharmacyOrder>(`/pharmacy-orders/${id}/`, data);
  },
  cancel: (id: number) => {
    return api.patch<PharmacyOrder>(`/pharmacy-orders/${id}/`, { status: 'cancelled' });
  }
};

export const medicalRecords = {
  getAll: () => {
    return api.get<MedicalRecord[]>('/medical-records/');
  },
  upload: (formData: FormData) => {
    return api.post<MedicalRecord>('/medical-records/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getById: (id: number) => {
    return api.get<MedicalRecord>(`/medical-records/${id}/`);
  },
  delete: (id: number) => {
    return api.delete(`/medical-records/${id}/`);
  },
};

export const medicines = {
  getAll: () => {
    return api.get<Medicine[]>('/medicines/');
  },
  getById: (id: string) => {
    return api.get<Medicine>(`/medicines/${id}/`);
  },
  getByCategory: (category: string) => {
    return api.get<Medicine[]>(`/medicines/?category=${category}`);
  },
  getCategories: () => {
    return api.get<string[]>('/medicines/categories/');
  },
  search: (query: string) => {
    return api.get<Medicine[]>(`/medicines/?search=${query}`);
  },
  filter: (params: {
    category?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params.max_price) queryParams.append('max_price', params.max_price.toString());
    if (params.in_stock !== undefined) queryParams.append('in_stock', params.in_stock.toString());
    
    return api.get<Medicine[]>(`/medicines/?${queryParams.toString()}`);
  },
};
