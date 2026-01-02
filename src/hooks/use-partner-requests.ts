import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { API_URL } from '@/lib/constants';

export function usePartnerRequests() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/partner-requests?userId=${user.id}&type=received&status=pending`
        );
        const data = await response.json();
        
        if (data.success) {
          setUnreadCount(data.data.length);
        }
      } catch (error) {
        console.error('Failed to fetch partner requests count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Poll every 30 seconds for new requests
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return { unreadCount, loading };
}
