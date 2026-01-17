import React, { useRef, useState, useEffect } from 'react';
import { PenLine, Image as ImageIcon, Eraser } from 'lucide-react';

interface TTDUploadProps {
  onSignatureChange: (dataUrl: string | null) => void;
}

const TTDUpload: React.FC<TTDUploadProps> = ({ onSignatureChange }) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Drawing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    exportCanvas();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSignatureChange(canvas.toDataURL('image/png'));
    }
  };

  // Setup Canvas style on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeTab]);

  // Upload Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSignatureChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Segmented Control Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab('draw')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'draw'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PenLine size={16} /> Gambar
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'upload'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon size={16} /> Upload
        </button>
      </div>

      {activeTab === 'draw' ? (
        <div className="space-y-3">
          <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-white touch-none shadow-sm hover:border-blue-300 transition-colors">
            <canvas
              ref={canvasRef}
              className="w-full h-48 cursor-crosshair block"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasSignature && !isDrawing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-sm">
                Coret tanda tangan di sini
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1.5 text-xs text-red-500 font-medium hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            <Eraser size={14} /> Reset Canvas
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <ImageIcon size={24} className="text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-700">Klik untuk upload gambar</p>
          <p className="mt-1 text-xs text-gray-400">PNG/JPG (Latar transparan)</p>
        </div>
      )}
    </div>
  );
};

export default TTDUpload;