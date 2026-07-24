"use client";

import { useEffect, useState } from "react";
import { Loader2, Award, Download, CheckCircle, Search } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We can fetch certificates from a general GET or reuse a specific endpoint
    // Let's create an API call for it. Wait, we already created GET /api/certificates/evaluate ? 
    // Yes, the GET method in evaluate/route.ts returns certificates!
    fetch("/api/certificates/evaluate")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCertificates(data);
        }
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleEvaluate = async (category: string) => {
    try {
      const res = await fetch("/api/certificates/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      if (res.ok && data.certificate) {
        alert("🎉 Certificate earned!");
        setCertificates([data.certificate, ...certificates]);
      } else {
        alert(data.error || data.message || "Not eligible yet.");
      }
    } catch (e) {
      alert("Error evaluating certificate");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
          <p className="text-gray-500 mt-2">View and download your earned certificates.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Check Eligibility</h3>
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => handleEvaluate("AI_LEARNING")} className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors">
            Check AI Learning Certificate
          </button>
          <button onClick={() => handleEvaluate("GAMIFICATION_MASTER")} className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium transition-colors">
            Check XP Master Certificate
          </button>
          <button onClick={() => handleEvaluate("OVERALL_PROFICIENCY")} className="px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-medium transition-colors">
            Check Proficiency Certificate
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <Award className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Certificates Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">Keep learning, passing quizzes, and earning XP to unlock certificates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-800">
                <Award className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-tight">{cert.title}</h3>
                <p className="text-teal-700 dark:text-teal-400 text-sm mt-1 font-medium">{cert.category}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>Issued On:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{cert.certificateCode.split("-")[0]}...</span>
                </div>
                <div className="pt-4 flex gap-3">
                  <a href={`/api/certificates/\${cert.certificateCode}/download`} target="_blank" className="flex-1 flex justify-center items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    <Download size={18} /> PDF
                  </a>
                  <Link href={`/verify?code=\${cert.certificateCode}`} target="_blank" className="flex-1 flex justify-center items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <CheckCircle size={18} /> Verify
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
