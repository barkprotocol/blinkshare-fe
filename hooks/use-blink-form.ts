import { useState } from 'react';

export type BlinkType = 'Donation' | 'Payment' | 'Gift' | 'Mint NFT' | 'Mint Token';
export type DonationCurrency = 'SOL' | 'BARK' | 'USDC';
export type TextPosition = 'left' | 'center' | 'right';

interface BlinkFormData {
  title: string;
  label: string;
  description: string;
  image: File | null;
  textPosition: TextPosition;
  bgColor: string;
  donationAmount: string;
  donationLink: string;
  donationCurrency: DonationCurrency;
  blinkType: BlinkType;
}

export const useBlinkForm = () => {
  const [formData, setFormData] = useState<BlinkFormData>({
    title: '',
    label: '',
    description: '',
    image: null,
    textPosition: 'left',
    bgColor: '#ffffff',
    donationAmount: '0.1',
    donationLink: '',
    donationCurrency: 'SOL',
    blinkType: 'Donation',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const handleSelectChange = (field: keyof BlinkFormData) => (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return { formData, setFormData, handleInputChange, handleFileChange, handleSelectChange };
};

