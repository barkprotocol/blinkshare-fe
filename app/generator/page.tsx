"use client";

import React, { useState } from "react";
import "./style.css";

const BlinkSharePlugin = () => {
  const [formData, setFormData] = useState({
    title: "",
    label: "",
    description: "",
    image: null as File | null,
    textPosition: "left",
    bgColor: "#ffffff",
    donationAmount: "0.1",
    donationLink: "",
  });

  const [loading, setLoading] = useState(false);

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

  const handleDownload = () => {
    if (!formData.title || !formData.label || !formData.description || !formData.image) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    setLoading(true); // Show loading
    const { title, label, description, image, bgColor } = formData;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.src = URL.createObjectURL(image!);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = formData.textPosition as CanvasTextAlign;

      ctx.fillText(title, canvas.width / 2, 50);
      ctx.fillText(label, canvas.width / 2, 100);
      ctx.fillText(description, canvas.width / 2, 150);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "blink-image.png";
      link.click();

      setLoading(false);
    };
  };

  return (
    <div
      id="webcrumbs"
      className="bg-gray-100 dark:bg-black min-h-screen flex flex-col justify-center items-center py-12"
    >
      <div className="w-[1200px] bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
        <div className="min-h-[800px] flex flex-col items-center px-12 py-20">
          <header className="text-center mb-20">
            <h1 className="text-4xl font-title text-neutral-950 dark:text-white">Create and Preview Your Blink</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-300 mt-2">
              Customize your Blink with the options below, and instantly see your changes in the preview.
            </p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-[1000px]">
            {/* Form Section */}
            <section className="bg-neutral-50 dark:bg-neutral-700 p-8 rounded-md space-y-8">
              <h2 className="text-2xl font-semibold text-neutral-950 dark:text-white text-center mb-6">Customization Form</h2>
              <form className="space-y-6">
                {/* Form Fields */}
                <div>
                  <label htmlFor="title" className="block text-lg text-neutral-700 dark:text-neutral-200">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-3 bg-neutral-100 dark:bg-neutral-600 rounded-md border border-neutral-300 dark:border-neutral-500"
                    placeholder="Enter your title here"
                  />
                </div>
                {/* More fields... */}
              </form>
            </section>
            {/* Live Preview Section */}
            <section className="bg-neutral-50 dark:bg-neutral-700 p-8 rounded-md space-y-8">
              <h2 className="text-2xl font-semibold text-neutral-950 dark:text-white text-center mb-6">Live Preview</h2>
              <div className="w-full h-[400px] bg-neutral-200 dark:bg-neutral-600 rounded-md flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-full object-contain shadow-md"
                  />
                ) : (
                  <span className="text-neutral-500 dark:text-neutral-300">Preview Area</span>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlinkSharePlugin;
