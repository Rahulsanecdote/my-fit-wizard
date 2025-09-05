import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading FitGenie AI...</p>
        </div>
      </div>
    );
  }

  // Redirect based on authentication status
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/auth" replace />;
};

export default Index;
