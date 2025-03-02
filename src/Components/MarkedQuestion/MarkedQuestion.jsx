import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/Sidebar";
import { useParams } from "react-router-dom";

export default function MarkedQuestion() {
  const [marksBySystem, setMarksBySystem] = useState({});
  const [systemNames, setSystemNames] = useState([]);
  const [openSystems, setOpenSystems] = useState({});
  const { yearId } = useParams()

  const authToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODQ2NjQ4LCJpYXQiOjE3NDAyNDE4NDYsImp0aSI6IjU0ZTVkNWJlN2Q3ZDRkMjk4OTYzNjhmYmJmNTlkMjkxIiwidXNlcl9pZCI6NjZ9.sZRJuReyOg4ZaIK-Z4cMhcgS2svPKOLbaAcF4I1oSF4";
  const API_BASE_URL = "https://ahmedmahmoud10.pythonanywhere.com";

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/marks/`, {
        headers: {
          Authorization: authToken,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch marks");
      const data = await res.json();
      
    
      const grouped = data.reduce((acc, mark) => {
        const sysName = mark.system_name;
        if (!acc[sysName]) {
          acc[sysName] = [];
        }
        acc[sysName].push(mark);
        return acc;
      }, {});
      
      setMarksBySystem(grouped);
      setSystemNames(Object.keys(grouped));
    } catch (err) {
      console.error(err);
    }
  };
  
  const toggleSystem = (systemName) => {
    setOpenSystems((prev) => ({
      ...prev,
      [systemName]: !prev[systemName],
    }));
  };

  const navigateToQuestion = () => {
    window.location.href = `/test/${yearId}/`;
  };

  const formatDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <div className="flex md:ms-72 min-h-screen bg-gradient-to-r from-blue-200 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <Sidebar />
      <div className="p-4 w-full">
        {systemNames.map((systemName) => (
          <div
            key={systemName}
            className="mb-4 bg-white border rounded-lg overflow-hidden w-full"
          >
            <div
              onClick={() => toggleSystem(systemName)}
              className="cursor-pointer p-4 bg-white text-center text-green-600 border-b font-medium w-full"
            >
              {systemName}
            </div>

            {openSystems[systemName] && marksBySystem[systemName] && (
              <div className="p-4">
                {marksBySystem[systemName].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marksBySystem[systemName].map((mark) => (
                      <div key={mark.id} className="border rounded-lg p-4">
                        <div className="font-bold text-xl mb-2">{mark.name}</div>
                        <div className="text-blue-600 font-bold text-xl mb-1">
                          #{mark.id}
                        </div>
                        <div className="text-gray-600 text-sm mb-3">
                          {formatDate()}
                        </div>
                        
                        <div className="flex mb-3">
                          <div className="mr-4">
                            <span className="font-medium">Test</span>
                            <div className="bg-green-600 text-white rounded px-2 py-1 text-sm">
                              #{mark.test}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Question</span>
                            <div className="bg-blue-600 text-white rounded px-2 py-1 text-sm">
                              #{mark.question}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => navigateToQuestion(mark.test, mark.question)}
                          className="bg-blue-100 text-blue-600 flex items-center justify-center w-full py-2 rounded"
                        >
                          <span className="mr-2">▶</span> View Question
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No marks for this system.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
        
        {systemNames.length === 0 && (
          <div className="text-center text-gray-500 py-8">No systems found.</div>
        )}
      </div>
    </div>
  );
}
