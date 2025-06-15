
import { useCallback } from 'react';
import { mockValidators } from '@/config/validators';

export interface DelegationInfo {
  validator: string;
  amount: number;
  rewards: number;
  isActive: boolean;
}

export const useDelegationData = () => {
  const fetchDelegationData = useCallback(async (address?: string): Promise<DelegationInfo[]> => {
    if (!address) return [];

    try {
      // Mock delegation data - in production, this would query Core's delegation API
      const mockDelegations: DelegationInfo[] = [
        {
          validator: mockValidators[0].address,
          amount: 5.0,
          rewards: 0.42,
          isActive: true
        },
        {
          validator: mockValidators[1].address,
          amount: 3.0,
          rewards: 0.28,
          isActive: true
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockDelegations;
    } catch (error) {
      console.error('Error fetching delegation data:', error);
      return [];
    }
  }, []);

  return { fetchDelegationData };
};
