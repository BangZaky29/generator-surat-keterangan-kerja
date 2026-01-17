import { forwardRef } from 'react';
import type { FormData } from '../types';

interface LetterPreviewProps {
  data: FormData;
  signature: string | null;
  stamp: string | null;
  companyLogo: string | null;
}

const LetterPreview = forwardRef<HTMLDivElement, LetterPreviewProps>(({ data, signature, stamp, companyLogo }, ref) => {
  
  // Format Date to Indonesian format: "10 Agustus 2023"
  const formattedDate = new Date(data.letterDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    // Outer container: Dark "PDF Viewer" style background
    <div className="w-full bg-slate-700 rounded-xl border border-slate-600 shadow-inner flex justify-center items-start overflow-hidden pt-6 md:pt-10 min-h-[600px] relative">
      
      {/* Decorative 'Preview' label */}
      <div className="absolute top-3 left-4 text-slate-400 text-xs font-medium uppercase tracking-widest pointer-events-none select-none">
        Live Preview
      </div>

      {/* 
        Scaling Wrapper: 
        - Centers the A4 content.
        - Uses scale transform to fit mobile screens.
        - Negative margin bottom accounts for the empty space left by scaling down.
      */}
      <div className="relative origin-top transform transition-transform duration-300 ease-out
                      scale-[0.42] sm:scale-[0.65] md:scale-[0.75] lg:scale-100
                      mb-[-150mm] sm:mb-[-90mm] md:mb-[-50mm] lg:mb-12">
        
        {/* Actual A4 Paper content - This is what gets printed */}
        {/* 
           Uses px-[25mm] py-[20mm] to ensure print margins.
        */}
        <div 
          ref={ref}
          className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.5)] px-[25mm] py-[20mm] text-dark relative mx-auto flex flex-col"
          style={{ 
            width: '210mm', 
            height: '297mm', // Fixed height A4 for display
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          {/* Header / Kop Surat (Dynamic) */}
          <div className="flex items-center gap-6 border-b-2 border-black pb-6 mb-8 shrink-0 relative">
            {/* Logo Container: shrink-0 is CRITICAL. 
                Using relative positioning and explicit dimensions helps html2canvas render correctly.
            */}
            <div 
              className="flex-shrink-0 relative flex items-center justify-center"
              style={{ width: '100px', height: '100px' }}
            >
               {companyLogo ? (
                  /* 
                     FIX: Do not use w-full h-full combined with object-fit for PDF generation.
                     html2canvas sometimes ignores object-fit. 
                     Using max-width/max-height with auto width/height preserves aspect ratio naturally.
                  */
                  <img 
                    src={companyLogo} 
                    alt="Logo Perusahaan" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      width: 'auto', 
                      height: 'auto',
                      objectFit: 'contain'
                    }} 
                  />
               ) : (
                  // Placeholder jika belum upload logo
                  <div className="w-full h-full rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-center p-1">
                      <span className="text-[10px] text-gray-400">Upload Logo</span>
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

          {/* Content - Flex grow agar isi surat mengisi ruang tersedia */}
          <div className="space-y-5 text-justify leading-relaxed text-[12pt] text-black grow">
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

          {/* Footer / Signature Area (Dynamic) */}
          <div className="mt-auto flex justify-end shrink-0 pt-4">
            <div className="text-center w-64 relative">
              <p className="mb-4 text-black">{data.letterPlace}, {formattedDate}</p>
              <p className="font-bold mb-1 text-black">{data.issuerJob}</p>
              <p className="font-bold mb-4 text-black">{data.companyName}</p>
              
              {/* Signature & Stamp Container */}
              <div className="h-24 w-full flex items-center justify-center mb-2 relative">
                
                {/* 1. STAMP LAYER (Stempel) - z-index 10 (Bottom) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-90">
                   {stamp ? (
                     <img 
                      src={stamp} 
                      alt="Stempel" 
                      className="w-24 h-24 object-contain transform -rotate-12 opacity-80 mix-blend-multiply" 
                     />
                   ) : (
                     // Placeholder transparan
                     <div className="w-24 h-24"></div> 
                   )}
                </div>

                {/* 2. SIGNATURE LAYER (TTD) - z-index 20 (Top) */}
                <div className="relative z-20 w-full h-full flex items-center justify-center">
                  {signature ? (
                    <img 
                      src={signature} 
                      alt="Tanda Tangan" 
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