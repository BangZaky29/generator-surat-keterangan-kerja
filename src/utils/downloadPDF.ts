import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

  export const downloadPDF = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
  ) => {
    if (!ref.current) return;

  try {
    const originalElement = ref.current;
    
    // Dimensi A4 @ 96 DPI
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

    // 3. Reset style pada clone agar sesuai A4 murni
    clone.style.width = `${A4_WIDTH_PX}px`;
    
    // FIX: Gunakan height fixed agar layout flexbox (flex-1 overflow-hidden) bekerja dengan benar.
    // Jika height auto, konten akan memanjang ke bawah dan flex-1 tidak akan memotong teks,
    // sehingga footer terdorong keluar dari halaman A4.
    clone.style.height = `${A4_HEIGHT_PX}px`; 
    clone.style.minHeight = `${A4_HEIGHT_PX}px`;
    
    // Pastikan overflow hidden supaya tidak ada yang keluar dari kanvas
    clone.style.overflow = 'hidden';
    
    clone.style.margin = '0';
    clone.style.padding = '25mm 25mm 20mm 25mm'; 
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.backgroundColor = '#ffffff';
    clone.style.boxSizing = 'border-box';

    // Pastikan display flex tetap ada (biasanya terbawa dari cloneNode, tapi untuk safety)
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';

    container.appendChild(clone);

    // 4. Render ke Canvas
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x scale untuk kualitas tinggi
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX, // Paksa tinggi canvas
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
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};