import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Error caught in boundary:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
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
            
            <h1 className="text-3xl font-bold text-red-500 mb-4">Oops!</h1>
            <p className="text-xl text-gray-700 mb-6">This Page is not available now, please try again</p>
            
            <div className="flex justify-center space-x-4 mb-6">
              <span className="text-3xl animate-spin">🔄</span>
              <span className="text-3xl">⚠️</span>
              <span className="text-3xl animate-pulse">⏳</span>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;