// src/hooks/useUsers.ts
import { useEffect, useState } from "react";
import { getUserById } from "../services/api";
import { User } from "../types/Users";

export const useUsers = (userIds: number[]) => {
  const [users, setUsers] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const uniqueIds = [...new Set(userIds)];

      for (const userId of uniqueIds) {
        if (!users[userId]) {
          try {
            const userData = await getUserById(userId);
            setUsers((prev) => ({
              ...prev,
              [userId]: userData,
            }));
          } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
          }
        }
      }

      setLoading(false);
    };

    if (userIds.length > 0) {
      fetchUsers();
    }
  }, [userIds, users]);

  return { users, loading };
};
