import React, { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    console.error("Route Error:", error);
    const reloadCount = sessionStorage.getItem("reloadCount") || 0;

    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", Number(reloadCount) + 1);
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
      setShowFallback(true); // خلاص جربنا الريفريش ومش نافع، نعرض الصفحة
    }
  }, [error]);

  if (!showFallback) return null; // متعرضش حاجة خالص لحد ما نقرر fallback

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6 relative">
          <img 
            src="/api/placeholder/400/300" 
            alt="Error illustration" 
            className="mx-auto rounded-lg" 
          />
          <div className="absolute -top-4 -right-4">
            <div className="text-5xl animate-bounce">😵</div>
          </div>
          <div className="absolute -bottom-4 -left-4">
            <div className="text-5xl animate-pulse">🛠️</div>
          </div>
        </div>

        {error?.status && (
          <div className="text-4xl font-bold text-gray-300 mb-2">{error.status}</div>
        )}
        
        <h1 className="text-3xl font-bold text-red-500 mb-4">{error?.statusText || "Oops!"}</h1>
        <p className="text-xl text-gray-700 mb-6">{error?.message || "This Page is not available now, please try again"}</p>
        
        <div className="flex justify-center space-x-4 mb-6">
          <span className="text-3xl animate-spin">🔄</span>
          <span className="text-3xl">⚠️</span>
          <span className="text-3xl animate-pulse">⏳</span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Try Again
          </button>
          
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
