"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2, FileCheck, AlertCircle } from "lucide-react";

interface DocumentUploaderProps {
  clientId: string;
}

export default function DocumentUploader({ clientId }: DocumentUploaderProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Select a file first");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientId", clientId);
      formData.append("name", docName);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      setFile(null);
      setDocName("");
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["client-profile", clientId] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Something went wrong during upload");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      // Pre-fill name if empty
      if (!docName) {
        setDocName(selected.name.split(".")[0]);
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!file) {
      setErrorMsg("Please select a file to upload.");
      return;
    }
    uploadMutation.mutate();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="font-serif text-base font-bold text-navy">Upload Document</h3>
      <p className="text-gray-400 text-xs">Upload KYC sheets, policies, or tax receipts (PDF, PNG, JPG).</p>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Document custom name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Document Label
          </label>
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="e.g. Aadhaar Card, LIC Receipt"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-light focus:border-sky-light text-xs text-gray-800"
          />
        </div>

        {/* File selection box */}
        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50/50 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />
          <div className="space-y-2 text-gray-500">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-xs font-semibold">
              {file ? file.name : "Click to select a file"}
            </p>
            <p className="text-[10px] text-gray-400">PDF, Images up to 10MB</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2 bg-danger/10 border border-danger/15 text-danger rounded-xl text-xs flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={uploadMutation.isPending}
          className="w-full py-2.5 bg-navy hover:bg-navy-light disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-all shadow-sm"
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Uploading File...
            </>
          ) : (
            <>
              <FileCheck className="w-4 h-4 mr-1.5" />
              Upload to Dossier
            </>
          )}
        </button>
      </form>
    </div>
  );
}
