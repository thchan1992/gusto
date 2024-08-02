"use client";
import React, { useState } from "react";

interface UploadFormProps {
  onFileUrlChange: (url: string) => void;
  oldFileUrl?: string;
}

export const UploadForm = ({
  onFileUrlChange,
  oldFileUrl,
}: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    console.log(oldFileUrl, "old file url");
    if (oldFileUrl) {
      formData.append("oldFileUrl", oldFileUrl);
    }

    console.log(formData, "Form Data");
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.fileUrl);
      onFileUrlChange(data.fileUrl);

      setUploading(false);
      setFile(null);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <div className="full-w justify-center items-center flex flex-row p-3">
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="btn btn-primary ml-2"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};
