// C:\codingVibes\nuansasolution\.subpath\generator-surat-keterangan-kerja\src\types.ts

// types.ts
export interface FormData {
  issuerName: string;
  issuerJob: string;
  issuerAddress: string;
  recipientName: string;
  recipientJob: string;
  recipientAddress: string;
  letterNumber: string;
  letterDate: string;
  purpose: string;
}

export const initialFormData: FormData = {
  issuerName: "Thomas Alvian",
  issuerJob: "Direktur Utama PT. Garuda Wings",
  issuerAddress: "Jl. Gatot Subroto No.34 Medan Kota",
  recipientName: "Astuti Rahma Ningrum, S.E.",
  recipientJob: "Manajer Produksi",
  recipientAddress: "Jl. Setia Budi No.102 Medan Kota",
  letterNumber: "101/SPK-RM/VI/2024",
  letterDate: new Date().toISOString().split('T')[0],
  purpose: "administrasi pengajuan KPR",
};
