import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface MockAuthProviderProps {
  children: ReactNode;
}

export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Simulate auth rehydration
    const initAuth = async () => {
      console.log('🔄 Mock Auth: Initializing authentication...');
      
      // Check for existing token
      const existingToken = localStorage.getItem('authToken');
      const existingUser = localStorage.getItem('user');
      
      if (existingToken && existingUser) {
        try {
          const userData = JSON.parse(existingUser);
          setUser(userData);
          setToken(existingToken);
          console.log('✅ Mock Auth: User restored from localStorage', userData);
        } catch (error) {
          console.error('❌ Mock Auth: Error parsing stored user data', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } else {
        // Auto-login with mock user for development
        const mockUser: User = {
          id: 'mock-user-123',
          username: 'test_user',
          email: 'test@example.com',
          avatar: 'https://via.placeholder.com/40'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        console.log('✅ Mock Auth: Auto-logged in with mock user', mockUser);
      }
      
      setIsLoading(false);
    };

    // Simulate network delay
    setTimeout(initAuth, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      username: email.split('@')[0],
      email,
      avatar: 'https://via.placeholder.com/40'
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    setUser(mockUser);
    setToken(mockToken);
    
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setIsLoading(false);
    
    console.log('✅ Mock Auth: Login successful', mockUser);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('✅ Mock Auth: Logout successful');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a MockAuthProvider');
  }
  return context;
};

export default MockAuthProvider;
