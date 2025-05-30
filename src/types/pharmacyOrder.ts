import { CartItem } from './medicine';

export interface PharmacyOrder {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  deliveryAddress?: string;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}
