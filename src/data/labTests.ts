export interface LabTest {
    id: string;
    name: string;
    description: string;
    price: number;
    turnaroundTime: string;
    requirements: string;
  }
  
  export interface TestPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    tests: string[];
    turnaroundTime: string;
    requirements: string;
  }
  
  export const labTests: LabTest[] = [
    {
      id: 'cbc',
      name: 'Complete Blood Count (CBC)',
      description: 'Measures different components of blood including RBC, WBC, and platelets',
      price: 500,
      turnaroundTime: 'Same Day',
      requirements: 'Fasting not required'
    },
    {
      id: 'blood-sugar-fasting',
      name: 'Blood Sugar (Fasting)',
      description: 'Measures blood glucose levels after 8-12 hours of fasting',
      price: 200,
      turnaroundTime: 'Same Day',
      requirements: '8-12 hours fasting required'
    },
    {
      id: 'lipid-profile',
      name: 'Lipid Profile',
      description: 'Measures cholesterol and triglycerides levels',
      price: 800,
      turnaroundTime: 'Same Day',
      requirements: '12 hours fasting required'
    },
    {
      id: 'thyroid-profile',
      name: 'Thyroid Profile (T3, T4, TSH)',
      description: 'Evaluates thyroid function',
      price: 1200,
      turnaroundTime: '24 Hours',
      requirements: 'No special preparation needed'
    },
    {
      id: 'liver-function',
      name: 'Liver Function Test (LFT)',
      description: 'Evaluates liver function and health',
      price: 1000,
      turnaroundTime: 'Same Day',
      requirements: '8-12 hours fasting required'
    },
    {
      id: 'kidney-function',
      name: 'Kidney Function Test (RFT)',
      description: 'Evaluates kidney function and health',
      price: 1000,
      turnaroundTime: 'Same Day',
      requirements: '8-12 hours fasting required'
    },
    {
      id: 'hba1c',
      name: 'HbA1c',
      description: 'Measures average blood sugar levels over past 3 months',
      price: 800,
      turnaroundTime: 'Same Day',
      requirements: 'No fasting required'
    },
    {
      id: 'urine-routine',
      name: 'Urine Routine',
      description: 'Analyzes physical, chemical, and microscopic aspects of urine',
      price: 300,
      turnaroundTime: 'Same Day',
      requirements: 'Early morning sample preferred'
    }
  ];
  
  export const testPackages: TestPackage[] = [
    {
      id: 'basic-health',
      name: 'Basic Health Checkup',
      description: 'Essential tests for routine health screening',
      price: 2500,
      tests: ['CBC', 'Blood Sugar (F)', 'Lipid Profile', 'Urine Routine'],
      turnaroundTime: 'Same Day',
      requirements: '12 hours fasting required'
    },
    {
      id: 'diabetes-screening',
      name: 'Diabetes Screening',
      description: 'Comprehensive diabetes assessment',
      price: 3000,
      tests: ['Blood Sugar (F)', 'Blood Sugar (PP)', 'HbA1c', 'Kidney Function'],
      turnaroundTime: '24 Hours',
      requirements: '12 hours fasting required'
    },
    {
      id: 'thyroid-complete',
      name: 'Complete Thyroid Profile',
      description: 'Detailed thyroid function assessment',
      price: 2800,
      tests: ['T3', 'T4', 'TSH', 'Anti-TPO'],
      turnaroundTime: '24 Hours',
      requirements: 'No special preparation needed'
    },
    {
      id: 'heart-health',
      name: 'Heart Health',
      description: 'Cardiac risk assessment',
      price: 4500,
      tests: ['Lipid Profile', 'ECG', 'CRP', 'Homocysteine'],
      turnaroundTime: '24 Hours',
      requirements: '12 hours fasting required'
    },
    {
      id: 'womens-health',
      name: "Women's Health",
      description: 'Essential health screening for women',
      price: 5000,
      tests: ['CBC', 'Thyroid Profile', 'Vitamin D', 'Iron Profile'],
      turnaroundTime: '24 Hours',
      requirements: '12 hours fasting required'
    },
    {
      id: 'liver-health',
      name: 'Liver Health',
      description: 'Comprehensive liver function assessment',
      price: 3500,
      tests: ['LFT', 'HBsAg', 'Anti HCV', 'Prothrombin Time'],
      turnaroundTime: '24 Hours',
      requirements: '12 hours fasting required'
    },
    {
      id: 'kidney-health',
      name: 'Kidney Health',
      description: 'Complete kidney function assessment',
      price: 3000,
      tests: ['RFT', 'Urine Routine', 'Uric Acid', 'Electrolytes'],
      turnaroundTime: '24 Hours',
      requirements: '12 hours fasting required'
    },
    {
      id: 'executive-health',
      name: 'Executive Health Checkup',
      description: 'Comprehensive health assessment',
      price: 8000,
      tests: ['CBC', 'Lipid Profile', 'Liver Function', 'Kidney Function', 'Thyroid Profile', 'Vitamin Profile'],
      turnaroundTime: '48 Hours',
      requirements: '12 hours fasting required'
    }
  ];