import axios from 'axios';
import React, { useEffect, useState } from 'react';

const useCheckConversation = (contactId) => {
  const [hasConversation, setHasConversation] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkConversation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/chats/checkconversation/${contactId}`
      );
      setIsLoading(false);
      setHasConversation(response.data);
      if (response.data) setConversation(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    checkConversation();
  }, []);

  return { hasConversation, conversation, isLoading };
};

export default useCheckConversation;
