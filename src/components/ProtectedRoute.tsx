
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Gem } from "lucide-react";
import { toast } from "sonner";
import { ACTIVE, FREE_TRIAL, isFirstLogin, markFirstLoginComplete } from "@/services/subscriptionService";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, subscriptionStatus, refreshSubscriptionStatus } = useAuth();
  const [localLoading, setLocalLoading] = useState(false); // Start with false to avoid excessive "checking" state
  const [authCheckTimeout, setAuthCheckTimeout] = useState(false);
  
  // Get first-time user status from localStorage
  const firstTimeUser = isFirstLogin();
  const isPremium = subscriptionStatus === ACTIVE;
  // For first-time users, we force the free trial status regardless of DB setting
  const isFreeTrial = subscriptionStatus === FREE_TRIAL || firstTimeUser;
  
  useEffect(() => {
    // If this is a first-time user, log it and ensure subscription status is refreshed
    if (firstTimeUser && user) {
      console.log("First-time user detected in ProtectedRoute, giving free trial access");
      // Force a refresh of the subscription status to ensure free trial is properly set
      refreshSubscriptionStatus();
      // We don't mark first login complete here - that only happens when they use the trial
    }
  }, [firstTimeUser, user, refreshSubscriptionStatus]);
  
  // Only set loading state if auth is loading and we have no user yet
  useEffect(() => {
    if (isLoading && !user) {
      // Only show loading for a very short time
      setLocalLoading(true);
      
      // Very short delay for better UX
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 50); // Extremely short delay
      
      return () => clearTimeout(timer);
    } else {
      // If we have a user or loading is done, immediately remove loading state
      setLocalLoading(false);
    }
  }, [isLoading, user]);
  
  // Handle component unmount
  useEffect(() => {
    return () => {
      setLocalLoading(false);
    };
  }, []);
  
  // Set a timeout to prevent infinite loading - shortened for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localLoading) {
        setLocalLoading(false);
        setAuthCheckTimeout(true);
        
        // If still loading after timeout, show toast to user
        if (isLoading && !user) {
          toast.error("Authentication taking longer than expected. Please refresh if this persists.");
        }
      }
    }, 500); // Very short timeout
    
    return () => clearTimeout(timer);
  }, [isLoading, localLoading, user]);
  
  // If loading timeout occurred but user is defined, still show the content
  if (authCheckTimeout && user) {
    return <>{children}</>;
  }
  
  // For first-time users, skip the loading state entirely for better UX
  if (firstTimeUser) {
    console.log("First-time user detected in ProtectedRoute, bypassing loading state");
    return <>{children}</>;
  }
  
  // If we have a user but auth is still finalizing, show content anyway
  if (user && isLoading) {
    return <>{children}</>;
  }
  
  // If still in initial loading state but not for too long, show a loading indicator
  if (localLoading && isLoading && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-fashion-accent border-t-transparent rounded-full"></div>
        <p className="text-fashion-text/70 mt-2">Loading your profile...</p>
        {(isPremium || isFreeTrial) && (
          <div className="flex items-center gap-2 mt-4">
            <Gem className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {isPremium ? "Loading Premium Content" : "Free Trial Active"}
            </span>
          </div>
        )}
      </div>
    );
  }
  
  // If not logged in after loading is complete, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // User is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
