import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { downloadPDF } from '../utils/downloadPDF';

interface DownloadPDFButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName: string;
  onSuccess?: () => void;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ targetRef, fileName, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleDownload = async () => {
    if (!targetRef.current) {
      alert("Preview belum siap untuk di-download.");
      return;
    }

    setStatus('loading');

    // Sedikit delay agar UI settle
    setTimeout(async () => {
      try {
        await downloadPDF(targetRef, fileName); // sudah aman, targetRef bisa null
        setStatus('success');
        if (onSuccess) onSuccess();

        // Reset status button setelah 3 detik
        setTimeout(() => setStatus('idle'), 3000);
      } catch (error) {
        console.error(error);
        alert("Gagal memproses PDF. Silakan coba lagi.");
        setStatus('idle');
      }
    }, 500);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status === 'loading'}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-lg w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed ${
        status === 'success' 
          ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30' 
          : 'bg-primary hover:bg-primary-dark text-white shadow-blue-500/30'
      }`}
    >
      {status === 'loading' ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Memproses...</span>
        </>
      ) : status === 'success' ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span>Berhasil!</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
};

export default DownloadPDFButton;
