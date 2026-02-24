import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Patient } from "../types/schema";
import { authService, activityLogService, patientService } from "../services/api";

interface SessionData {
  department?: string;
  sessionTime?: string;
  shift?: string;
  loginTime: string;
  expiryTime?: string;
}

interface AuthContextType {
  user: User | null;
  patient: Patient | null;
  sessionData: SessionData | null;
  login: (username: string, password: string, additionalData?: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setPatient: (patient: Patient | null) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem("user");
    const storedPatient = localStorage.getItem("patient");
    const storedSession = localStorage.getItem("sessionData");
    const token = localStorage.getItem("token");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // If the user is a patient and we don't have stored patient data, fetch it
      if (userData.role === 'patient' && !storedPatient) {
        fetchPatientData(userData.id);
      }
    }
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
    if (storedSession) {
      setSessionData(JSON.parse(storedSession));
    }

    // If we have a token but no user data, fetch user profile
    if (token && !storedUser) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      // Set token in localStorage
      localStorage.setItem("token", token);

      // Fetch user profile
      const { data, error } = await authService.getProfile();

      if (data) {
        // Set user data including profile image
        setUser({
          id: data._id,
          username: data.username,
          name: data.name,
          role: data.role,
          email: data.email,
          profileImage: data.profileImage // Include profile image
        });
        localStorage.setItem("user", JSON.stringify({
          id: data._id,
          username: data.username,
          name: data.name,
          role: data.role,
          email: data.email,
          profileImage: data.profileImage // Include profile image
        }));

        // If the user is a patient, fetch patient data
        if (data.role === 'patient') {
          await fetchPatientData(data._id);
        }

        // Log login activity
        await logActivity(data._id, "login", "User logged in successfully");
      } else {
        // If there's an error, clear the token
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientData = async (userId: string) => {
    try {
      // Fetch patient data based on user ID
      const { data, error } = await patientService.getByUserId(userId);

      if (data && !error) {
        setPatient(data);
        localStorage.setItem("patient", JSON.stringify(data));
      } else if (error) {
        console.error("Error fetching patient data:", error);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const logActivity = async (userId: string, action: string, details?: string) => {
    try {
      // Log activity to backend using the proper service
      await activityLogService.create({
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const login = async (username: string, password: string, additionalData?: any) => {
    setIsLoading(true);
    try {
      // Real authentication using backend API
      const { data, error } = await authService.login({ username, password });

      if (error) {
        console.error("Login API error:", error);
        throw new Error(error);
      }

      if (!data) {
        console.error("Invalid response from server");
        throw new Error("Invalid response from server");
      }

      // Set user data including profile image
      setUser({
        id: data._id,
        username: data.username,
        name: data.name,
        role: data.role,
        email: data.email,
        profileImage: data.profileImage // Include profile image
      });

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data._id,
        username: data.username,
        name: data.name,
        role: data.role,
        email: data.email,
        profileImage: data.profileImage // Include profile image
      }));

      // If the user is a patient, fetch patient data
      if (data.role === 'patient') {
        await fetchPatientData(data._id);
      }

      // Set session data if provided
      if (additionalData) {
        const now = new Date();
        const loginTime = now.toISOString();
        const sessionHours = additionalData?.sessionTime ? parseInt(additionalData.sessionTime) : 8;
        const expiryTime = new Date(now.getTime() + sessionHours * 60 * 60 * 1000).toISOString();

        const session = {
          department: additionalData?.department,
          sessionTime: additionalData?.sessionTime,
          shift: additionalData?.shift,
          loginTime,
          expiryTime
        };

        setSessionData(session);
        localStorage.setItem("sessionData", JSON.stringify(session));
      }

      // Log login activity
      await logActivity(data._id, "login", "User logged in successfully");

      // Don't redirect here, let the calling component handle navigation
      // This prevents losing the React context state during page reload
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user?.id) {
      await logActivity(user.id, "logout", "User logged out");
    }

    setUser(null);
    setPatient(null);
    setSessionData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("patient");
    localStorage.removeItem("sessionData");
    localStorage.removeItem("token");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, patient, sessionData, login, logout, isLoading, setPatient, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
