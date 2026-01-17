import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
  if (!ref.current) return;

  try {
    const originalElement = ref.current;
    
    // Gunakan dimensi presisi untuk A4 @ 96 DPI
    // 210mm = 793.7px, 297mm = 1122.5px
    const A4_WIDTH_PX = 793.7;
    const A4_HEIGHT_PX = 1122.5;

    // 1. Buat wadah terisolasi
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.style.left = '-10000px';
    container.style.zIndex = '-9999';
    container.style.width = `${A4_WIDTH_PX}px`; 
    document.body.appendChild(container);

    // 2. Clone elemen surat
    const clone = originalElement.cloneNode(true) as HTMLElement;

    // 3. Reset style pada clone
    clone.style.width = `${A4_WIDTH_PX}px`;
    // PENTING: Gunakan min-height, bukan height fixed.
    // Jika rendering font di canvas membuat konten sedikit lebih tinggi dari A4,
    // height fixed akan memaksa flexbox "menjepit" (squash) elemen seperti logo/gambar.
    clone.style.height = 'auto'; 
    clone.style.minHeight = `${A4_HEIGHT_PX}px`; 
    
    clone.style.margin = '0';
    clone.style.padding = '25mm 25mm 20mm 25mm'; 
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.backgroundColor = '#ffffff';
    clone.style.boxSizing = 'border-box';

    container.appendChild(clone);

    // 4. Render ke Canvas
    // Hapus opsi width/height fix di html2canvas agar ia menangkap ukuran asli elemen (yang sudah kita atur di clone)
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x scale untuk kualitas tinggi
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: A4_WIDTH_PX, // Bantu simulasi viewport
    });

    // 5. Bersihkan DOM
    document.body.removeChild(container);

    // 6. Buat PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    // const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Hitung tinggi berdasarkan rasio canvas asli
    const canvasRatio = canvas.height / canvas.width;
    const imgHeight = pdfWidth * canvasRatio;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};