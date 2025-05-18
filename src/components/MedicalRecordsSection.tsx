import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Eye, Download } from 'lucide-react';
import { medicalRecords, MedicalRecord } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

// API URL for prepending to relative URLs
const API_URL = 'http://localhost:8000';

// Export the component interface for ref access
export interface MedicalRecordsSectionRef {
  fetchMedicalRecords: () => Promise<void>;
}

const MedicalRecordsSection = forwardRef<MedicalRecordsSectionRef>((_, ref) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecords.getAll();
      console.log('Medical records response:', response.data);
      // Filter records for the current user if needed
      const userRecords = user 
        ? response.data.filter(record => record.patient === Number(user.id)) 
        : response.data;
      setRecords(userRecords);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records');
      setLoading(false);
      showToast('Failed to load medical records', 'error');
    }
  };

  // Expose the fetchMedicalRecords method to parent components
  useImperativeHandle(ref, () => ({
    fetchMedicalRecords
  }));

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  // Delete functionality removed as records are now managed from the admin panel

  const handleView = (fileUrl: string) => {
    // If the URL is relative (doesn't start with http), prepend the API_URL
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_URL}${fileUrl}`;
    console.log('Opening file URL:', fullUrl);
    window.open(fullUrl, '_blank');
  };

  const handleDownload = (fileUrl: string, title: string) => {
    // If the URL is relative (doesn't start with http), prepend the API_URL
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_URL}${fileUrl}`;
    console.log('Downloading file URL:', fullUrl);
    
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to get the appropriate icon based on file type
  const getFileIcon = () => {
    return <FileText className="w-8 h-8 text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 MedicalRecordsSection">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 MedicalRecordsSection">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 MedicalRecordsSection">
      <h2 className="text-xl font-semibold mb-6">Your Medical Records</h2>
      
      {records.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You have not uploaded any medical records yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Use the upload form above to add your medical records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <div key={record.id} className="border rounded-lg p-4 flex flex-col">
              <div className="flex items-center mb-3">
                {getFileIcon()}
                <div className="ml-3 flex-1">
                  <h3 className="font-medium truncate">{record.title}</h3>
                  <p className="text-xs text-gray-500">
                    Uploaded {formatDistanceToNow(new Date(record.uploaded_at))} ago
                  </p>
                </div>
              </div>
              
              {record.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{record.description}</p>
              )}
              
              <div className="flex justify-between mt-auto pt-3 border-t">
                <button
                  onClick={() => handleView(record.file_url)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDownload(record.file_url, record.title)}
                  className="flex items-center text-sm text-green-600 hover:text-green-800"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
                {/* Delete button removed as records are now managed from the admin panel */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default MedicalRecordsSection;
