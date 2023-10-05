// custom hook to get user data from firebase

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => { 
      // if user is logged in, user is an object, otherwise it's null
      setUser(user);
      setLoading(false);
    });
    return unsubscribe; // unsubscribe when component unmounts, to prevent memory leaks
  }, []);

  return { user, loading };
};

export default useUser;
