import React, { useState, useRef} from 'react';
import Header from './components/Header';
import FormInput from './components/FormInput';
import LetterPreview from './components/LetterPreview';
import DownloadPDFButton from './components/DownloadPDFButton';
import MobileActionButton from './components/MobileActionButton';
import type { FormData } from './types';
import { initialFormData } from './types';
import { Info, CheckCircle, X } from 'lucide-react';

// Simple Toast Component
const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="fixed top-24 right-4 z-[60] animate-in slide-in-from-right-5 fade-in duration-300">
    <div className="bg-white border-l-4 border-green-500 shadow-xl rounded-lg p-4 pr-10 flex items-center gap-3 min-w-[300px]">
      <div className="bg-green-100 p-2 rounded-full">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">Sukses</h4>
        <p className="text-xs text-gray-500 mt-0.5">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
      >
        <X size={14} />
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [signature, setSignature] = useState<string | null>(null);
  const [stamp, setStamp] = useState<string | null>(null); 
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [showToast, setShowToast] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [key]: value }));
  };


  const handleSignatureChange = (newSignature: string | null) => {
    setSignature(newSignature);
  };

  const handleStampChange = (newStamp: string | null) => {
    setStamp(newStamp);
  };

  const handleLogoChange = (newLogo: string | null) => {
    setCompanyLogo(newLogo);
  };

  const toggleMobileTab = () => {
    setMobileTab(prev => prev === 'form' ? 'preview' : 'form');
  };

  const handleDownloadSuccess = () => {
    setShowToast(true);
    // Auto hide toast after 4 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      <Header />

      {showToast && (
        <Toast 
          message="Dokumen PDF berhasil didownload." 
          onClose={() => setShowToast(false)} 
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
          
          {/* Left Column: Input Form */}
          <div className={`lg:col-span-5 space-y-8 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm flex gap-3 items-start">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-gray-900 font-semibold text-sm">Panduan Pengisian</h2>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Lengkapi data formulir, upload logo perusahaan, tanda tangan, dan stempel. Pratinjau akan terupdate secara otomatis.
                </p>
              </div>
            </div>
            
            <FormInput 
              data={formData} 
              onChange={handleFormChange} 
              onSignatureChange={handleSignatureChange}
              onStampChange={handleStampChange}
              onLogoChange={handleLogoChange}
            />

            <div className="hidden lg:block sticky top-24 z-10">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <p className="text-sm font-medium text-gray-600 mb-4">Dokumen sudah sesuai?</p>
                <DownloadPDFButton 
                  targetRef={printRef} 
                  fileName={`Surat_Kerja_${formData.recipientName.replace(/\s+/g, '_')}`}
                  onSuccess={handleDownloadSuccess}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className={`lg:col-span-7 flex flex-col gap-6 ${mobileTab === 'form' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex items-center justify-between lg:justify-end mb-1">
              <h2 className="text-xl font-bold text-gray-800 lg:hidden">Preview Hasil</h2>
              {/* Mobile Download Button */}
              <div className="lg:hidden w-auto ml-auto">
                 <DownloadPDFButton 
                  targetRef={printRef} 
                  fileName={`Surat_Kerja_${formData.recipientName.replace(/\s+/g, '_')}`}
                  onSuccess={handleDownloadSuccess}
                />
              </div>
            </div>
            
            <LetterPreview 
              ref={printRef} 
              data={formData} 
              signature={signature} 
              stamp={stamp}
              companyLogo={companyLogo}
            />
          </div>

        </div>
      </main>

      <MobileActionButton activeTab={mobileTab} onToggle={toggleMobileTab} />

      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Generator Surat Kerja.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;