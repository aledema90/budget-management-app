import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user || null);
      setAuthLoading(false);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loginWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: "google" });

  const loginWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signupWithEmail = (email, password) =>
    supabase.auth.signUp({ email, password });

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
