"use client";
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useEffect, useCallback, useState, createContext, useContext } from 'react';
import React from 'react';

// Create context properly
const UserDetailContext = createContext<{
    userDetail: any;
    setUserDetail: (user: any) => void;
} | null>(null);

function Provider({ children }: any) {
    const createUser = useMutation(api.user.CreateNewUser);
    const [userDetail, setUserDetail] = useState<any>();
    
    console.log('🔄 Provider render - Development mode (no auth)');
    
    // For development: Create a mock user
    useEffect(() => {
        const createMockUser = async () => {
            try {
                const mockUserData = {
                    email: 'dev@example.com',
                    imageUrl: 'https://via.placeholder.com/150',
                    name: 'Development User'
                };
                
                console.log('📤 Creating mock user for development');
                const result = await createUser(mockUserData);
                console.log('✅ Mock user created:', result);
                setUserDetail(result);
                
            } catch (error) {
                console.log('ℹ️ Using existing user or mock data');
                // Set mock user data for development
                setUserDetail({
                    _id: 'dev-user-123',
                    email: 'dev@example.com',
                    name: 'Development User',
                    imageUrl: 'https://via.placeholder.com/150'
                });
            }
        };

        createMockUser();
    }, [createUser]);
     
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    );
}

export default Provider;

// Fixed context hook
export const useUserDetailContext = () => {
    const context = useContext(UserDetailContext);
    if (!context) {
        throw new Error('useUserDetailContext must be used within a Provider');
    }
    return context;
};