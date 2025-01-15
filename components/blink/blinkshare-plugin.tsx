'use client';

import React, { useState } from 'react';
import { useBlinkForm } from '@/hooks/use-blink-form';
import CustomizationForm from './form';
import { Preview } from './blink-preview';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const BlinkSharePlugin: React.FC = () => {
  const { formData, setFormData, handleInputChange, handleFileChange } = useBlinkForm();
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!formData.title || !formData.label || !formData.description || !formData.image) {
      toast.error('Please fill in all required fields and upload an image.');
      return;
    }

    setLoading(true);
    const { title, label, description, image, bgColor, textPosition } = formData;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      toast.error('Unable to create canvas context');
      setLoading(false);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = textPosition;

      ctx.fillText(title, canvas.width / 2, 50);
      ctx.fillText(label, canvas.width / 2, 100);
      ctx.fillText(description, canvas.width / 2, 150);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'blink-image.png';
      link.click();

      setLoading(false);
      toast.success('Image downloaded successfully');
    };
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-7xl bg-white dark:bg-neutral-800 rounded-lg shadow-lg my-8">
        <div className="min-h-[800px] flex flex-col items-center px-12 py-20">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-950 dark:text-white">Create and Preview Your Blink</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-300 mt-2">
              Customize your Blink with the options below, and instantly see your changes in the preview.
            </p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-[1000px]">
            <section className="bg-neutral-50 dark:bg-neutral-700 p-8 rounded-md space-y-8">
              <h2 className="text-2xl font-semibold text-neutral-950 dark:text-white text-center mb-6">Customization Form</h2>
              <CustomizationForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                setFormData={setFormData}
              />
            </section>
            <section className="bg-gray-100 dark:bg-neutral-700 p-8 rounded-md space-y-8">
              <h2 className="text-2xl font-semibold text-neutral-950 dark:text-white text-center mb-6">Preview</h2>
              <Preview 
                image={formData.image}
                title={formData.title}
                label={formData.label}
                description={formData.description}
                donationAmount={formData.donationAmount}
                donationCurrency={formData.donationCurrency}
              />
            </section>
          </div>
          <Button
            onClick={handleDownload}
            disabled={loading}
            className="mt-8 px-6 py-3 bg-gray-950 text-white rounded-md hover:bg-gray-1000 transition-colors"
          >
            {loading ? 'Generating...' : 'Download Blink Image'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlinkSharePlugin;

