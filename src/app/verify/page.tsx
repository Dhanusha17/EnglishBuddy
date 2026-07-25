"use client";

import { useState, useEffect, Suspense } from "react";
import { Loader2, Search, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");



  const handleVerify = async (verifyCode: string) => {
    if (!verifyCode) return;
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/verify/\${verifyCode}`);
      const data = await res.json();
      
      if (res.ok && data.valid) {
        setResult(data);
      } else {
        setError("Invalid Certificate ID. This certificate could not be verified or has been revoked.");
      }
    } catch (e) {
      setError("An error occurred while verifying the certificate.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const runVerify = async () => {
      if (initialCode) {
        await handleVerify(initialCode);
      }
    };
    runVerify();
  }, [initialCode]);



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Certificate</h1>
          <p className="text-gray-500 mt-2">Enter the Certificate ID or scan the QR code to verify its authenticity.</p>
        </div>

        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            value={code} 
            onChange={e => setCode(e.target.value)}
            placeholder="Enter Certificate ID..."
            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <button 
            onClick={() => handleVerify(code)}
            disabled={isLoading || !code}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-2xl flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in duration-300">
            <XCircle size={48} className="text-red-500" />
            <div>
              <h3 className="font-bold text-lg mb-1">Verification Failed</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle size={56} className="text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-black text-2xl mb-1 text-green-700 dark:text-green-400">Valid Certificate</h3>
              <p className="text-sm opacity-80 mb-6">This certificate is authentic and verifiable.</p>
              
              <div className="bg-white/60 dark:bg-black/20 p-4 rounded-xl text-left space-y-3 w-full max-w-sm mx-auto">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-60">Issued To</div>
                  <div className="font-medium text-lg">{result.studentName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-60">Achievement</div>
                  <div className="font-medium">{result.course}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-60">Category</div>
                  <div className="font-medium">{result.category}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-60">Issue Date</div>
                  <div className="font-medium">{new Date(result.issueDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
