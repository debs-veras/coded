import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { validateToken } from '../services/auth.service';
import Loading from '../components/Loading';
import { useUserStore } from '../hooks/useUserStore';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const storage = useUserStore();
  const access = storage.user?.access;
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function validate() {
      const response = await validateToken();
      if (response.success && response.data) setIsValid(true);
      else {
        storage.clearAuth();
        setIsValid(false);
      }
    }

    validate();
  }, [access]);

  if (isValid === null) return <Loading />;
  if (!isValid) return <Navigate to="/login" replace />;
  return children;
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const storage = useUserStore();
  const user = storage.user;
  const access = storage.user?.access;
  if (!access) return <Navigate to="/login" replace />;
  if (!user || !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;
  return <>{children}</>;
}
