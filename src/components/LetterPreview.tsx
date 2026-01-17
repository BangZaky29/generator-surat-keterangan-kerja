import React, { forwardRef, useEffect, useState, useRef } from 'react';
import type { FormData } from '../types';

interface LetterPreviewProps {
  data: FormData;
  signature: string | null;
  stamp: string | null;
  companyLogo: string | null;
}

const LetterPreview = forwardRef<HTMLDivElement, LetterPreviewProps>(({ data, signature, stamp, companyLogo }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Dimensi A4 dalam Pixel (96 DPI)
  const A4_WIDTH_PX = 793.7;
  const A4_HEIGHT_PX = 1122.5;

  // Format Date
  const formattedDate = new Date(data.letterDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Hitung scale otomatis berdasarkan lebar container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Ambil lebar container parent dikurangi padding (misal 32px atau 48px total padding)
        const parentWidth = containerRef.current.clientWidth - 40; 
        
        // Hitung rasio scale, max 1 (jangan membesar melebihi ukuran asli di layar besar)
        const newScale = Math.min(parentWidth / A4_WIDTH_PX, 1);
        setScale(newScale);
      }
    };

    // Initial calc
    handleResize();

    // Event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    // Outer Container: Dark background
    <div 
      ref={containerRef}
      className="w-full bg-slate-700 rounded-xl border border-slate-600 shadow-inner flex flex-col items-center justify-start overflow-hidden pt-8 pb-8 relative min-h-[300px]"
    >
      
      {/* Label Preview */}
      <div className="absolute top-3 left-4 text-slate-400 text-xs font-medium uppercase tracking-widest pointer-events-none select-none z-10">
        Live Preview
      </div>

      {/* 
        Dynamic Wrapper 
        Fungsinya: Menyediakan ruang dimensi fisik (width/height) yang akurat di DOM
        agar tidak ada margin kosong berlebih di bawah.
      */}
      <div 
        style={{ 
          width: A4_WIDTH_PX * scale, 
          height: A4_HEIGHT_PX * scale,
          transition: 'width 0.3s ease-out, height 0.3s ease-out'
        }}
        className="relative bg-white shadow-2xl"
      >
        {/* 
          Actual A4 Element 
          Di-scale menggunakan transform, dengan origin top-left agar pas di wrapper.
        */}
        <div 
          ref={ref}
          className="bg-white text-dark absolute top-0 left-0 origin-top-left"
          style={{ 
            width: `${A4_WIDTH_PX}px`, 
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            padding: '25mm 25mm 20mm 25mm', // Margin A4
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          {/* --- CONTENT SURAT --- */}
          <div className="w-full h-full flex flex-col relative">
            
            {/* Header / Kop Surat */}
            <div className="flex items-center gap-6 border-b-2 border-black pb-6 mb-8 shrink-0">
              <div 
                className="flex-shrink-0 relative flex items-center justify-center"
                style={{ width: '100px', height: '100px' }}
              >
                 {companyLogo ? (
                    <img 
                      src={companyLogo} 
                      alt="Logo" 
                      style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} 
                    />
                 ) : (
                    <div className="w-full h-full rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-center p-1">
                        <span className="text-[10px] text-gray-400">Logo</span>
                    </div>
                 )}
              </div>
              
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold uppercase tracking-wide text-black leading-tight mb-1">
                  {data.companyName}
                </h1>
                <p className="text-sm text-black leading-snug whitespace-pre-line">
                  {data.companyAddress}
                </p>
                <p className="text-sm text-blue-800 underline leading-snug mt-1">
                  {data.companyContact}
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 shrink-0">
              <h2 className="text-xl font-bold underline uppercase text-black">SURAT KETERANGAN KERJA</h2>
              <p className="mt-1 text-black">No. {data.letterNumber}</p>
            </div>

            {/* Content Body */}
            <div className="space-y-4 text-justify leading-relaxed text-[12pt] text-black grow">
              <p>Saya yang bertanda tangan dibawah ini:</p>

              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-32 py-1 align-top">Nama</td>
                    <td className="w-4 py-1 align-top">:</td>
                    <td className="py-1 align-top font-bold">{data.issuerName}</td>
                  </tr>
                  <tr>
                    <td className="py-1 align-top">Jabatan</td>
                    <td className="py-1 align-top">:</td>
                    <td className="py-1 align-top">{data.issuerJob} {data.companyName}</td>
                  </tr>
                  <tr>
                    <td className="py-1 align-top">Alamat</td>
                    <td className="py-1 align-top">:</td>
                    <td className="py-1 align-top">{data.issuerAddress}</td>
                  </tr>
                </tbody>
              </table>

              <p>Dengan ini menerangkan bahwa:</p>

              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-32 py-1 align-top">Nama</td>
                    <td className="w-4 py-1 align-top">:</td>
                    <td className="py-1 align-top font-bold">{data.recipientName}</td>
                  </tr>
                  <tr>
                    <td className="py-1 align-top">Jabatan</td>
                    <td className="py-1 align-top">:</td>
                    <td className="py-1 align-top">{data.recipientJob}</td>
                  </tr>
                  <tr>
                    <td className="py-1 align-top">Alamat</td>
                    <td className="py-1 align-top">:</td>
                    <td className="py-1 align-top">{data.recipientAddress}</td>
                  </tr>
                </tbody>
              </table>

              <p>
                Benar-benar karyawan tetap di <strong>{data.companyName}</strong> yang bekerja sampai saat ini dengan jabatan terakhir sebagai <strong>{data.recipientJob}</strong>.
              </p>

              <p>
                Surat Keterangan Kerja ini diterbitkan untuk keperluan: <strong>{data.purpose}</strong> oleh saudari {data.recipientName}.
              </p>

              <p>
                Demikian surat keterangan ini dibuat agar dapat dipergunakan sebagaimana mestinya.
              </p>
            </div>

            {/* Footer / Signature */}
            <div className="mt-auto flex justify-end shrink-0 pt-4">
              <div className="text-center w-64 relative">
                <p className="mb-4 text-black">{data.letterPlace}, {formattedDate}</p>
                <p className="font-bold mb-1 text-black">{data.issuerJob}</p>
                <p className="font-bold mb-4 text-black">{data.companyName}</p>
                
                <div className="h-24 w-full flex items-center justify-center mb-2 relative">
                  {/* Stamp */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-90">
                     {stamp && (
                       <img 
                        src={stamp} 
                        alt="Stempel" 
                        className="w-24 h-24 object-contain transform -rotate-12 opacity-80 mix-blend-multiply" 
                       />
                     )}
                  </div>

                  {/* Signature */}
                  <div className="relative z-20 w-full h-full flex items-center justify-center">
                    {signature ? (
                      <img 
                        src={signature} 
                        alt="TTD" 
                        className="max-h-full max-w-full object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    ) : (
                      <div className="text-gray-300 text-xs italic border border-dashed border-gray-300 w-full h-full flex items-center justify-center rounded bg-white/50 backdrop-blur-[1px]">
                        (Tanda Tangan)
                      </div>
                    )}
                  </div>
                </div>

                <p className="font-bold border-b border-black inline-block mt-4 px-2 pb-1 relative z-30 text-black">
                  {data.issuerName}
                </p>
              </div>
            </div>
          </div>
          {/* --- END CONTENT --- */}
        </div>
      </div>
    </div>
  );
});

LetterPreview.displayName = 'LetterPreview';

export default LetterPreview;