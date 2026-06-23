"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { FolderOpen, Download, Trash2, Search, Loader2, FileText, Image, File, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface DocumentData {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  client: {
    name: string;
  };
}

interface ClientSelectOption {
  id: string;
  name: string;
}

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("ALL");

  // Upload Form states
  const [uploadClientId, setUploadClientId] = useState("");
  const [customFilename, setCustomFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all documents query
  const { data: documents, isLoading, error } = useQuery<DocumentData[]>({
    queryKey: ["documents", selectedClientId],
    queryFn: async () => {
      const url = selectedClientId && selectedClientId !== "ALL"
        ? `/api/documents?clientId=${selectedClientId}`
        : "/api/documents";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load documents");
      return response.json();
    },
  });

  // Fetch client options for searchable upload dropdown
  const { data: clients } = useQuery<ClientSelectOption[]>({
    queryKey: ["clients-select"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to load clients list");
      return response.json();
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete document");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action is permanent.`)) {
      deleteMutation.mutate(id);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/msword" // doc
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".docx")) {
      setUploadError("Invalid file type. Only PDF, JPG, PNG, and DOCX/DOC are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setUploadError("File size exceeds 10MB limit.");
      return;
    }
    setSelectedFile(file);
    if (!customFilename) {
      setCustomFilename(file.name.substring(0, file.name.lastIndexOf(".")) || file.name);
    }
  };

  // Upload handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadClientId) {
      setUploadError("Please select a client and choose a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10);

    // Simulate progress bar increase
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 80 ? prev : prev + 15));
    }, 250);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("clientId", uploadClientId);
      formData.append("name", customFilename);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to upload document");
      }

      // Reset Form state
      setSelectedFile(null);
      setUploadClientId("");
      setCustomFilename("");
      setUploadProgress(0);
      setIsUploading(false);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (err: any) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError(err.message || "Failed to upload file.");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="w-6 h-6 text-danger" />;
    if (fileType.includes("image") || fileType.includes("jpeg") || fileType.includes("png"))
      return <Image className="w-6 h-6 text-sky" />;
    return <File className="w-6 h-6 text-gray-400" />;
  };

  const filteredDocs = search && documents
    ? documents.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.client.name.toLowerCase().includes(search.toLowerCase())
      )
    : documents || [];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
          Document Vault
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Centralized locker for KYC files, policy contracts, proposals, and tax receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Section (5 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-5">
          <h3 className="font-serif text-lg font-bold text-navy">Upload Document</h3>
          
          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-semibold">
            {/* Searchable Client Selector */}
            <div>
              <label className="block text-gray-400 uppercase tracking-wider text-[10px] mb-2">
                Select Client <span className="text-danger">*</span>
              </label>
              <select
                value={uploadClientId}
                onChange={(e) => setUploadClientId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold bg-white cursor-pointer"
              >
                <option value="">-- Choose Client --</option>
                {clients?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Filename */}
            <div>
              <label className="block text-gray-400 uppercase tracking-wider text-[10px] mb-2">
                Document Name / Label
              </label>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder="e.g. Pancard Copy, Policy Bond"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-medium"
              />
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2",
                isDragActive
                  ? "border-sky bg-sky/5 text-sky-dark"
                  : "border-gray-200 hover:border-sky/40 text-gray-400"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
              />
              
              <UploadCloud className="w-10 h-10 stroke-1 text-gray-400" />
              
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-navy font-bold truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-[10px] text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-navy font-bold">Drag and drop file here</p>
                  <p className="text-[10px] text-gray-400">PDF, JPG, PNG or DOCX (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Upload progress indicator */}
            {isUploading && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-[11px] flex items-start gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isUploading || !selectedFile || !uploadClientId}
              className="w-full py-3 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Upload Document
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Files Cabinets (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs bg-gray-50 rounded-xl border border-gray-100">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search file name or client..."
                className="w-full pl-9 pr-4 py-2.5 bg-transparent rounded-xl focus:outline-none text-xs text-gray-800"
              />
            </div>

            {/* Filter by Client Dropdown */}
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Client:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-navy focus:outline-none bg-white cursor-pointer font-semibold"
              >
                <option value="ALL">All Clients</option>
                {clients?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents cabinet listing */}
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-3 text-gray-400 bg-white border border-gray-100 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Loading document vault...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-gray-400 text-sm bg-white border border-gray-100 rounded-2xl">
              Failed to load documents.
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-3 bg-white border border-gray-100 rounded-2xl">
              <FolderOpen className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-sm font-medium">No documents found in cabinet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div className="space-y-1 min-w-0 text-xs font-semibold">
                      <h4 className="font-bold text-navy truncate" title={doc.name}>{doc.name}</h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Client: {doc.client.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {(doc.fileSize / 1024).toFixed(1)} KB • Uploaded: {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <a
                      href={doc.fileUrl}
                      download
                      className="p-2 border border-gray-100 hover:border-sky/30 text-sky-dark hover:bg-sky/5 rounded-xl transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="p-2 border border-gray-100 hover:border-danger/30 text-danger hover:bg-danger/5 rounded-xl transition-colors"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
