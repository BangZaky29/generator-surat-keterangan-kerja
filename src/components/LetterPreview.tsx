import { forwardRef, useEffect, useState, useRef } from 'react';
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
        // Ambil lebar container parent dikurangi padding
        const parentWidth = containerRef.current.clientWidth - 32; 
        
        // Hitung rasio scale, max 1 (jangan membesar melebihi ukuran asli di layar besar)
        const newScale = Math.min(parentWidth / A4_WIDTH_PX, 1);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    // Outer Container
    <div 
      ref={containerRef}
      className="w-full bg-slate-700 rounded-xl border border-slate-600 shadow-inner flex flex-col items-center justify-start overflow-hidden pt-8 pb-8 relative min-h-[300px]"
    >
      <div className="absolute top-3 left-4 text-slate-400 text-xs font-medium uppercase tracking-widest pointer-events-none select-none z-10">
        Live Preview
      </div>

      {/* Dynamic Scaling Wrapper */}
      <div 
        style={{ 
          width: A4_WIDTH_PX * scale, 
          height: A4_HEIGHT_PX * scale,
          transition: 'width 0.2s, height 0.2s'
        }}
        className="relative bg-white shadow-2xl"
      >
        {/* Actual A4 Content */}
        <div 
          ref={ref}
          className="bg-white text-dark absolute top-0 left-0 origin-top-left overflow-hidden flex flex-col"
          style={{ 
            width: `${A4_WIDTH_PX}px`, 
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            padding: '25mm 25mm 20mm 25mm', // Margin A4
            fontFamily: '"Times New Roman", Times, serif',
            boxSizing: 'border-box'
          }}
        >
            
            {/* Header / Kop Surat (Fixed Height / Shrink-0) */}
            <div className="flex items-center gap-6 border-b-2 border-black pb-6 mb-6 shrink-0">
              <div className="shrink-0 w-[100px] h-[100px] flex items-center justify-center relative">
                 {companyLogo ? (
                    <img 
                      src={companyLogo} 
                      alt="Logo" 
                      className="w-full h-full object-contain"
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

            {/* Title (Shrink-0) */}
            <div className="text-center mb-6 shrink-0">
              <h2 className="text-xl font-bold underline uppercase text-black">SURAT KETERANGAN KERJA</h2>
              <p className="mt-1 text-black">No. {data.letterNumber}</p>
            </div>

            {/* Content Body (Flex-1 & Overflow Hidden) 
                Ini kunci perbaikan: jika teks terlalu panjang, dia akan terpotong di sini
                dan TIDAK akan mendorong footer keluar canvas. 
            */}
            <div className="flex-1 overflow-hidden flex flex-col text-justify leading-relaxed text-[12pt] text-black">
                <div className="space-y-4">
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
            </div>

            {/* Footer / Signature (Shrink-0) 
                Menggunakan mt-auto (otomatis ke bawah) tapi karena di dalam flex container 
                dengan sibling flex-1, dia akan selalu terlihat di bawah area yang tersedia.
            */}
            <div className="shrink-0 mt-4 pt-2 flex justify-end">
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
      </div>
    </div>
  );
});

LetterPreview.displayName = 'LetterPreview';

export default LetterPreview;