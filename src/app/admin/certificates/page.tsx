"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, ShieldCheck, Download, Search } from "lucide-react";

import { toast } from "sonner";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchCertificates = () => {
      fetch("/api/admin/certificates")
        .then(res => res.json())
        .then(d => {
          if (isMounted) {
            setCertificates(d);
            setIsLoading(false);
          }
        })
        .catch(console.error);
    };
    fetchCertificates();
    return () => { isMounted = false; };
  }, []);

  const handleRevoke = async (code: string) => {
    if (!confirm("Are you sure you want to revoke this certificate? This action cannot be undone and will immediately invalidate public verification.")) return;

    try {
      const res = await fetch(`/api/admin/certificates/${code}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Certificate revoked successfully.");
        setCertificates(certificates.filter(c => c.certificateCode !== code));
      } else {
        toast.error("Failed to revoke certificate.");
      }
    } catch (e) {
      toast.error("Error revoking certificate.");
    }
  };

  const filtered = certificates.filter(c => 
    c.certificateCode.toLowerCase().includes(search.toLowerCase()) || 
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificate Management</h1>
          <p className="text-gray-500 mt-2">Manage issued certificates, view verification logs, and revoke if necessary.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search certificates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin text-teal-600 w-12 h-12" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/30 text-gray-500 text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4">Certificate ID</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Achievement</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Issued On</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert) => (
                  <tr key={cert.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded" title={cert.certificateCode}>
                        {cert.certificateCode.split("-")[0]}...
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{cert.issuedToName || cert.user?.name}</div>
                      <div className="text-xs text-gray-500">{cert.user?.email}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {cert.title}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">{cert.category}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <a href={`/api/certificates/\${cert.certificateCode}/download`} target="_blank" className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF">
                        <Download size={18} />
                      </a>
                      <a href={`/verify?code=\${cert.certificateCode}`} target="_blank" className="inline-flex p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Verify Link">
                        <ShieldCheck size={18} />
                      </a>
                      <button onClick={() => handleRevoke(cert.certificateCode)} className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Revoke">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No certificates found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
