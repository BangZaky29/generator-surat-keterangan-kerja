import React from 'react';
import { Edit3, Eye } from 'lucide-react';

interface MobileActionButtonProps {
  activeTab: 'form' | 'preview';
  onToggle: () => void;
}

const MobileActionButton: React.FC<MobileActionButtonProps> = ({ activeTab, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-xl shadow-blue-500/40 z-50 hover:bg-primary-dark transition-transform active:scale-95 flex items-center justify-center"
      aria-label={activeTab === 'form' ? 'Lihat Preview' : 'Edit Surat'}
    >
      {activeTab === 'form' ? (
        <Eye className="w-6 h-6" />
      ) : (
        <Edit3 className="w-6 h-6" />
      )}
    </button>
  );
};

export default MobileActionButton;