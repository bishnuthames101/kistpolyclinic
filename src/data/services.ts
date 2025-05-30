import { Heart, Home, Syringe } from 'lucide-react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: any;
  price: number;
  doctors: Doctor[];
  features: string[];
  faqs: Array<{ question: string; answer: string; }>;
}

export const services: Service[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Expert heart care with state-of-the-art diagnostic and treatment facilities',
    longDescription: 'Our cardiology department provides comprehensive care for all types of heart conditions. We offer advanced diagnostic services, treatment plans, and preventive care using the latest medical technology.',
    icon: Heart,
    price: 2000,
    doctors: [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Senior Cardiologist',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Interventional Cardiologist',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
      }
    ],
    features: [
      'Advanced cardiac imaging',
      'Heart disease treatment',
      'Preventive cardiology',
      'ECG and stress testing'
    ],
    faqs: [
      {
        question: 'What heart conditions do you treat?',
        answer: 'We treat a wide range of cardiac conditions including coronary artery disease, heart rhythm disorders, heart failure, and hypertension.'
      },
      {
        question: 'How often should I get a heart check-up?',
        answer: 'We recommend annual heart check-ups for adults over 40 or those with risk factors. However, the frequency may vary based on your individual health condition.'
      }
    ]
  },
  {
    id: 'doctor-home-visit',
    name: 'Doctor Home Visit',
    description: 'Professional medical consultation in the comfort of your home',
    longDescription: 'Our home visit service brings qualified doctors to your doorstep, providing convenient and comprehensive medical care in the familiar environment of your home.',
    icon: Home,
    price: 2500,
    doctors: [
      {
        id: '3',
        name: 'Dr. Emily Patel',
        specialty: 'General Physician',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400'
      }
    ],
    features: [
      'Convenient home consultations',
      'Comprehensive check-ups',
      'Prescription delivery',
      'Follow-up care'
    ],
    faqs: [
      {
        question: 'How quickly can a doctor visit my home?',
        answer: 'We typically arrange home visits within 2-3 hours of booking, depending on availability and urgency.'
      },
      {
        question: 'What types of medical issues can be handled during a home visit?',
        answer: 'Our doctors can handle most general medical issues, basic procedures, and routine check-ups. Emergency cases should still visit the hospital.'
      }
    ]
  },
  {
    id: 'home-sample-collection',
    name: 'Home Sample Collection',
    description: 'Convenient blood sample collection at your doorstep',
    longDescription: 'Skip the laboratory queues with our home sample collection service. Our trained phlebotomists will collect your samples at home and deliver digital results promptly.',
    icon: Syringe,
    price: 1000,
    doctors: [
      {
        id: '4',
        name: 'Dr. James Wilson',
        specialty: 'Pathologist',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
      }
    ],
    features: [
      'Professional sample collection',
      'Digital results delivery',
      'Wide range of tests available',
      'Strict safety protocols'
    ],
    faqs: [
      {
        question: 'How long does it take to get test results?',
        answer: 'Most routine test results are available within 24-48 hours. Some specialized tests may take longer.'
      },
      {
        question: 'Do I need to prepare for blood tests?',
        answer: 'Many blood tests require fasting for 8-12 hours. Our team will inform you about any specific preparations needed.'
      }
    ]
  }
];