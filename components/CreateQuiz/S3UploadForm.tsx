// "use client";
// import React, { useState } from "react";

// interface UploadFormProps {
//   onFileUrlChange: (url: string) => void;
// }

// export const UploadForm = ({ onFileUrlChange }: UploadFormProps) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!file) return;
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await fetch("/api/image", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       console.log(data.fileUrl);
//       onFileUrlChange(data.fileUrl);

//       setUploading(false);
//       setFile(null);
//     } catch (error) {
//       console.log(error);
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="file"
//           className="file-input file-input-bordered w-full max-w-xs"
//           onChange={handleFileChange}
//         />
//         <button
//           type="submit"
//           className="btn btn-primary mt-4"
//           disabled={uploading}
//         >
//           {uploading ? "Uploading..." : "Upload"}
//         </button>
//       </form>
//     </div>
//   );
// };

"use client";
import React, { useState } from "react";

interface UploadFormProps {
  onFileUrlChange: (url: string) => void;
}

export const UploadForm = ({ onFileUrlChange }: UploadFormProps) => {
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
    <div>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="btn btn-primary mt-4"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};
