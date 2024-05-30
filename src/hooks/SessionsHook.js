import { cookies } from "next/headers";
import { useState, useEffect } from "react";

function useSession() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_ME);

    if (token) {
      // Validate token (implement your validation logic here)
      // This is a critical step to prevent unauthorized access
      // Consider using a library like `jsonwebtoken` for secure validation
      const isValid = validateToken(token); // Replace with your validation logic
      if (isValid) {
        const userData = decodeToken(token); // Replace with your token decoding logic
        setUser(userData);
        setIsAuthenticated(true);
      }
    }
    setIsLoading(false);
  }, []);

  return { user, isLoading, isAuthenticated };
}

export default useSession;
