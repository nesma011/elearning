import React, { useState } from 'react';
import { Gift, X, Copy, Check } from 'lucide-react';

const ReferFriendModal = ({ isOpen, onClose }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [visits, setVisits] = useState(4); 
  const [friends, setFriends] = useState(0); 
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getInviteCode = async () => {
    if (inviteCode) return; // Don't fetch if we already have a code
    
    setLoading(true);
    setError(null);
    
    try {
      // First, get the code from the API
      const response = await fetch(`${API_BASE_URL}/invate/`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODQ2NjQ4LCJpYXQiOjE3NDAyNDE4NDYsImp0aSI6IjU0ZTVkNWJlN2Q3ZDRkMjk4OTYzNjhmYmJmNTlkMjkxIiwidXNlcl9pZCI6NjZ9.sZRJuReyOg4ZaIK-Z4cMhcgS2svPKOLbaAcF4I1oSF4'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get invite code');
      }
      
      const data = await response.json();
      // Get the code from the response
      setInviteCode(data.code || '');
      setLoading(false);
    } catch (err) {
      setError('Failed to generate invite link');
      setLoading(false);
    }
  };

  // Fetch the invite code when the modal opens
  React.useEffect(() => {
    if (isOpen) {
      getInviteCode();
    }
  }, [isOpen]);

  // Function to close modal
  const closeModal = () => {
    setCopied(false);
    onClose();
  };

  // Function to copy invite link
  const copyInviteLink = () => {
    const inviteLink = `${API_BASE_URL}/invite/${inviteCode}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        setError('Failed to copy link');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal content */}
      <div className="bg-white rounded shadow-lg w-full max-w-md">
        {/* Modal header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Refer a friend</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 flex flex-col items-center">
          <div className="mb-4">
            <Gift size={40} />
          </div>
          
          <h3 className="text-xl font-bold mb-4">Share Alex-MedLearn with your friends!</h3>
          
          <p className="text-center text-gray-600 mb-6">
            Activate and copy the referral link below to share Alex-medLearn 
            with your friends, giving them access to a free trial!
          </p>
          
          <div className="w-full">
            <p className="font-semibold mb-2">Link</p>
            
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="font-semibold">Visits: </span>
                <span className="bg-green-500 text-white rounded-full px-2 py-1">{visits}</span>
              </div>
              
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="font-semibold">Friends: </span>
                <span className="bg-green-500 text-white rounded-full px-2 py-1">{friends}</span>
              </div>
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={loading ? "Loading..." : `${API_BASE_URL}/invite/${inviteCode}`}
                readOnly
                className="flex-grow border border-gray-300 p-2 rounded-l"
              />
              <button
                onClick={copyInviteLink}
                className="bg-green-500 text-white px-4 py-2 rounded-r flex items-center"
                disabled={loading || !inviteCode}
              >
                {copied ? <Check size={18} className="mr-1" /> : <Copy size={18} className="mr-1" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferFriendModal;