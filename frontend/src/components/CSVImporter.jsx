import { useState, useRef } from "react";
import { UploadCloud, FileText, X, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import DataTable from "./DataTable";

// endpoint: e.g. "/school-admin/teachers/import"
// sampleColumns: string shown to the user as the expected CSV header row
const CSVImporter = ({ endpoint, sampleColumns, onImported }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Import api dynamically to avoid circular import issues in some bundlers
      const api = (await import("../services/api")).default;
      const { data } = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onImported?.();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please check the file and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-navy-900">Upload CSV</h2>
          <p className="text-xs text-navy-400 mt-1">
            Expected columns: <code className="bg-navy-50 px-1.5 py-0.5 rounded">{sampleColumns}</code>
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-navy-100 rounded-lg p-8 flex flex-col items-center text-center">
        <UploadCloud className="w-8 h-8 text-navy-400 mb-2" />
        <p className="text-sm text-navy-400 mb-3">Drag and drop, or choose a CSV file</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-input"
        />
        <label
          htmlFor="csv-input"
          className="cursor-pointer px-4 py-2 rounded-lg bg-navy-50 text-navy-700 text-sm font-medium hover:bg-navy-100"
        >
          Choose File
        </label>

        {file && (
          <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-navy-50 text-sm text-navy-900">
            <FileText className="w-4 h-4" />
            {file.name}
            <button onClick={() => setFile(null)} aria-label="Remove file">
              <X className="w-3.5 h-3.5 text-navy-400" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4 bg-navy-900 hover:bg-navy-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
        Import
      </button>

      {result && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-navy-900">
              {result.successCount} row(s) imported successfully
              {result.failedRows?.length > 0 && `, ${result.failedRows.length} failed`}
            </span>
          </div>

          {result.failedRows?.length > 0 && (
            <DataTable
              columns={[
                { key: "row", label: "CSV Row #" },
                { key: "reason", label: "Reason" },
              ]}
              rows={result.failedRows}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CSVImporter;
