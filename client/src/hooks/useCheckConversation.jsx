import axios from 'axios';
import React, { useEffect, useState } from 'react';

const useCheckConversation = (contactId) => {
  const [hasConversation, setHasConversation] = useState(false);
  const [conversation, setConversation] = useState(null);

  const checkConversation = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/chats/checkconversation/${contactId}`
      );
      setHasConversation(response.data);
      if (response.data) setConversation(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    checkConversation();
  }, []);

  return { hasConversation, conversation };
};

export default useCheckConversation;
