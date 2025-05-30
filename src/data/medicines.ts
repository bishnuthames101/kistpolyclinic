import { Medicine } from '../types/medicine';

// This file is kept for backward compatibility
// Medicine data is now fetched from the API using the endpoints in src/services/api.ts
// Use the medicines API service instead of this static data

// Example usage:
// import { medicines } from '../services/api';
// 
// // In a React component:
// const [medicineData, setMedicineData] = useState<Record<string, Medicine[]>>({});
// 
// useEffect(() => {
//   const fetchMedicines = async () => {
//     try {
//       // Get all categories
//       const categoriesResponse = await medicines.getCategories();
//       const categories = categoriesResponse.data;
//       
//       // Fetch medicines for each category
//       const medicinesByCategory: Record<string, Medicine[]> = {};
//       
//       for (const category of categories) {
//         const response = await medicines.getByCategory(category);
//         medicinesByCategory[category.toLowerCase().replace(/\s+/g, '')] = response.data;
//       }
//       
//       setMedicineData(medicinesByCategory);
//     } catch (error) {
//       console.error('Error fetching medicines:', error);
//     }
//   };
//   
//   fetchMedicines();
// }, []);

// Placeholder data structure for backward compatibility
export const medicines: Record<string, Medicine[]> = {
  anti_inflammatory: [],
  Antibiotic: [],
  Calcium: [],
  Vitamins: [],
  Allergy: [],
  Cardiac: [],
  antifungal: [],
  antiviral: [],
  antipyretic: [],
  antiseptic: [],
  antihistamine: [],
  antimalarial: [],
  antiparasitic: [],
  antipruritic: [],
  antirheumatic: [],
  sexual_wellness: [],
};