import React, { useState } from 'react';
import type { FormData } from '../types';
import TTDUpload from './TTDUpload';
import { Upload, X, Building2, User, FileText, Stamp, ImagePlus, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface FormInputProps {
  data: FormData;
  onChange: (key: keyof FormData, value: string) => void;
  onSignatureChange: (signature: string | null) => void;
  onStampChange: (stamp: string | null) => void;
  onLogoChange: (logo: string | null) => void;
}

// 1. Label Component (Extracted outside to prevent re-renders)
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
    {children}
  </label>
);

// 2. InputGroup Component (Extracted & Added Accordion Logic)
const InputGroup = ({ 
  label, 
  children, 
  icon: Icon, 
  defaultOpen = false 
}: { 
  label: string, 
  children: React.ReactNode, 
  icon: any,
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-300">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 border-b ${isOpen ? 'border-gray-100 bg-blue-50/30' : 'border-transparent bg-white'} flex items-center justify-between gap-2 transition-colors duration-200 group`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'} transition-colors`}>
             <Icon className="w-4 h-4" />
          </div>
          <h3 className={`text-sm font-bold uppercase tracking-wide text-left ${isOpen ? 'text-blue-900' : 'text-gray-700'}`}>
            {label}
          </h3>
        </div>
        
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-blue-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const FormInput: React.FC<FormInputProps> = ({ data, onChange, onSignatureChange, onStampChange, onLogoChange }) => {
  const inputClasses = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm placeholder:text-gray-400";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof FormData, value);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onStampChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">

      {/* Detail Surat */}
      <InputGroup label="Detail Surat & Header" icon={Building2} defaultOpen={true}>
         {/* Logo Upload */}
         <div className="mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <Label>Logo Perusahaan</Label>
          <div className="mt-2 flex items-center gap-3">
            <div className="relative overflow-hidden group w-full">
               <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:bg-white hover:border-blue-400 transition-all">
                  <div className="flex items-center gap-2 text-blue-600">
                    <ImagePlus size={18} />
                    <span className="text-sm font-medium">Pilih Logo (JPG/PNG)</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
               </label>
            </div>
            <button 
                type="button" 
                onClick={() => onLogoChange(null)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Hapus Logo"
            >
                <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
            <div>
              <Label>Nama Perusahaan (Kop Surat & Isi)</Label>
              <input
                type="text"
                name="companyName"
                value={data.companyName}
                onChange={handleChange}
                className={inputClasses}
                placeholder="PT. Garuda Wings"
              />
            </div>
            <div>
              <Label>Alamat Perusahaan (Kop Surat)</Label>
              <textarea
                name="companyAddress"
                value={data.companyAddress}
                onChange={handleChange}
                rows={2}
                className={inputClasses}
                placeholder="Alamat lengkap perusahaan untuk header"
              />
            </div>
            <div>
              <Label>Kontak Perusahaan (Telp/Email)</Label>
              <input
                type="text"
                name="companyContact"
                value={data.companyContact}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Telp. ..., Email: ..."
              />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
          <div>
            <Label>Nomor Surat</Label>
            <input
              type="text"
              name="letterNumber"
              value={data.letterNumber}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <Label>Keperluan Surat</Label>
            <input
              type="text"
              name="purpose"
              value={data.purpose}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>
      </InputGroup>

      {/* Pihak Penerbit (Penandatangan) */}
      <InputGroup label="Pihak Penandatangan" icon={FileText} defaultOpen={false}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Nama Penandatangan</Label>
              <input
                type="text"
                name="issuerName"
                value={data.issuerName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <Label>Jabatan</Label>
              <input
                type="text"
                name="issuerJob"
                value={data.issuerJob}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Contoh: Direktur Utama"
              />
            </div>
          </div>
          <div>
            <Label>Alamat Penandatangan</Label>
            <textarea
              name="issuerAddress"
              value={data.issuerAddress}
              onChange={handleChange}
              rows={2}
              className={inputClasses}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
                <Label>Tempat TTD (Kota)</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        name="letterPlace"
                        value={data.letterPlace}
                        onChange={handleChange}
                        className={`${inputClasses} pl-9`}
                        placeholder="Medan"
                    />
                </div>
            </div>
            <div>
                <Label>Tanggal TTD</Label>
                <input
                    type="date"
                    name="letterDate"
                    value={data.letterDate}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>
          </div>
        </div>
      </InputGroup>

      {/* Pihak Penerima */}
      <InputGroup label="Data Karyawan" icon={User} defaultOpen={false}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Nama Karyawan</Label>
              <input
                type="text"
                name="recipientName"
                value={data.recipientName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <Label>Jabatan</Label>
              <input
                type="text"
                name="recipientJob"
                value={data.recipientJob}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
          <div>
            <Label>Alamat Karyawan</Label>
            <textarea
              name="recipientAddress"
              value={data.recipientAddress}
              onChange={handleChange}
              rows={2}
              className={inputClasses}
            />
          </div>
        </div>
      </InputGroup>

      {/* Legalitas (Stempel & TTD) */}
      <InputGroup label="Legalitas & Tanda Tangan" icon={Stamp} defaultOpen={false}>
        
        {/* Stempel Upload */}
        <div className="mb-8">
          <Label>Stempel Perusahaan</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all group relative">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Upload Stempel</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG Transparan (Max 2MB)</p>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleStampUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); onStampChange(null); }}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 z-10 transition-colors"
                title="Hapus Stempel"
            >
                <X size={14} />
            </button>
          </div>
        </div>

        {/* Tanda Tangan */}
        <div>
          <Label>Tanda Tangan Pejabat</Label>
          <div className="mt-2">
            <TTDUpload onSignatureChange={onSignatureChange} />
          </div>
        </div>
      </InputGroup>

    </div>
  );
};

export default FormInput;