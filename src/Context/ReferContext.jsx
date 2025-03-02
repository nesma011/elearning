import React, { createContext, useContext, useState } from 'react';
import ReferFriendModal from '../Components/Invitation/ReferFriendModal'; // Update the path as needed

// Create a context
const ReferFriendModalContext = createContext();

// Create a provider component
export const ReferFriendModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ReferFriendModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ReferFriendModal isOpen={isModalOpen} onClose={closeModal} />
    </ReferFriendModalContext.Provider>
  );
};

// Create a custom hook to use the context
export const useReferFriendModal = () => {
  const context = useContext(ReferFriendModalContext);
  if (!context) {
    throw new Error('useReferFriendModal must be used within a ReferFriendModalProvider');
  }
  return context;
};