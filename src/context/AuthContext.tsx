
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { api } from '@/services/api';

type User = {
  id: string;
  name: string;
  phone: string;
  address: string;
  can_rent_books: boolean;
  latitude?: number;
  longitude?: number;
  social_media?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (userData: RegisterData) => Promise<boolean>;
  login: (credentials: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export type LoginData = {
  phone: string;
  password: string;
};

export type RegisterData = {
  user: {
    password: string;
    name: string;
    phone: string;
  };
  library: {
    address: string;
    social_media?: string;
    can_rent_books: boolean;
    latitude?: number;
    longitude?: number;
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('bookmaster_token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/profile/');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If we can't fetch profile, token might be invalid
      setToken(null);
      localStorage.removeItem('bookmaster_token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Ensure phone number is in the correct format (998XXXXXXXXX)
      if (userData.user.phone) {
        userData.user.phone = userData.user.phone.replace(/\D/g, '');
        if (!userData.user.phone.startsWith('998')) {
          userData.user.phone = '998' + userData.user.phone;
        }
        userData.user.phone = userData.user.phone.slice(0, 12);
      }
      
      const response = await api.post('/auth/register-library/', userData);
      
      if (response.data && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('bookmaster_token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        await fetchUserProfile();
        toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Check for specific validation errors and display more helpful messages
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        if (errorData.phone && errorData.phone[0].includes('format')) {
          toast.error('Phone number must be in format: 998XXXXXXXXX (12 digits total)');
        } else if (errorData.phone && errorData.phone[0].includes('already exists')) {
          toast.error('This phone number is already registered');
        } else {
          toast.error('Ro\'yxatdan o\'tish muvaffaqiyatsiz yakunlandi');
        }
      } else {
        toast.error('Ro\'yxatdan o\'tish muvaffaqiyatsiz yakunlandi');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Ensure phone number is in the correct format
      if (credentials.phone) {
        credentials.phone = credentials.phone.replace(/\D/g, '');
        if (!credentials.phone.startsWith('998')) {
          credentials.phone = '998' + credentials.phone;
        }
        credentials.phone = credentials.phone.slice(0, 12);
      }
      
      const response = await api.post('/auth/login/', credentials);
      
      if (response.data && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('bookmaster_token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        await fetchUserProfile();
        toast.success('Tizimga muvaffaqiyatli kirdingiz');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 400 && error.response.data?.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else if (error.response?.status === 401) {
        toast.error('Invalid credentials');
      } else {
        toast.error('Tizimga kirishda xatolik yuz berdi');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await api.post('/auth/logout/');
      setUser(null);
      setToken(null);
      localStorage.removeItem('bookmaster_token');
      delete api.defaults.headers.common['Authorization'];
      toast.success('Tizimdan muvaffaqiyatli chiqib ketdingiz');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Tizimdan chiqib ketishda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.patch('/auth/profile/', profileData);
      
      if (response.data) {
        setUser(prev => prev ? { ...prev, ...response.data } : response.data);
        toast.success('Profil muvaffaqiyatli yangilandi');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Profilni yangilashda xatolik yuz berdi');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
