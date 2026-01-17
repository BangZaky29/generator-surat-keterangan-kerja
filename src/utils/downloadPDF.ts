import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
  if (!ref.current) return; // guard null

  try {
    const originalElement = ref.current;

    // Dimensi A4 @ 96 DPI
    const A4_WIDTH_PX = 793.7;
    const A4_HEIGHT_PX = 1122.5;

    // 1. Buat container sementara
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.style.left = '-10000px';
    container.style.zIndex = '-9999';
    container.style.width = `${A4_WIDTH_PX}px`;
    document.body.appendChild(container);

    // 2. Clone elemen surat
    const clone = originalElement.cloneNode(true) as HTMLElement;

    // 3. Reset style clone
    clone.style.width = `${A4_WIDTH_PX}px`;
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

    // 4. Render ke canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: A4_WIDTH_PX,
    });

    // 5. Bersihkan DOM sementara
    document.body.removeChild(container);

    // 6. Buat PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const canvasRatio = canvas.height / canvas.width;
    const imgHeight = pdfWidth * canvasRatio;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    pdf.save(`${filename}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
