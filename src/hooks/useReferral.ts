import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getQpcContract } from '../utils/contract';

// Convert display ID (36145+) to real contract ID
const parseDisplayId = (displayId: string): string => {
  const numId = parseInt(displayId, 10);
  if (isNaN(numId) || numId < 36146) return displayId; // Keep as is if not our format
  return (numId - 36145).toString();
};

interface ReferrerInfo {
  id: string;
  address: string;
  isValid: boolean;
}

export const useReferral = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customReferrerId, setCustomReferrerId] = useState('');

  // Get referrer ID from URL parameter
  const referrerIdFromUrl = searchParams.get('ref');

  // Fetch referrer info by ID
  const fetchReferrerInfo = useCallback(async (referrerId: string): Promise<ReferrerInfo | null> => {
    if (!referrerId) return null;
    
    try {
      setIsLoading(true);
      const contract = await getQpcContract(false);
      if (!contract) {
        return null;
      }

      // Convert display ID to real contract ID
      const contractId = parseDisplayId(referrerId);
      console.log(`DEBUG: Display ID ${referrerId} -> Contract ID ${contractId}`);

      // Try to get user address by ID
      const userAddress = await contract.usersAddressById(contractId);
      console.log(`DEBUG: ID ${referrerId} -> Address: ${userAddress}`);
      
      if (userAddress && userAddress !== '0x0000000000000000000000000000000000000000') {
        // Verify user is registered
        const isRegistered = await contract.isUserRegistered(userAddress);
        console.log(`DEBUG: Address ${userAddress} isRegistered: ${isRegistered}`);
        
        // Additional check: try to get user data
        try {
          const userData = await contract.getUser(userAddress);
          console.log(`DEBUG: User data for ${userAddress}:`, {
            id: userData.id?.toString(),
            registrationTimestamp: userData.registrationTimestamp?.toString(),
            referrer: userData.referrer
          });
          
          // User is valid if has non-zero ID and registration timestamp
          const hasValidData = userData.id && userData.id.toString() !== '0' && 
                              userData.registrationTimestamp && userData.registrationTimestamp.toString() !== '0';
          
          if (isRegistered && hasValidData) {
            console.log(`DEBUG: ID ${referrerId} is VALID`);
            return {
              id: referrerId,
              address: userAddress,
              isValid: true
            };
          } else {
            console.log(`DEBUG: ID ${referrerId} is INVALID - isRegistered: ${isRegistered}, hasValidData: ${hasValidData}`);
          }
        } catch (getUserError) {
          console.log(`DEBUG: Error getting user data for ${userAddress}:`, getUserError);
        }
      }
      
      return {
        id: referrerId,
        address: '',
        isValid: false
      };
    } catch (error) {
      console.error('Error fetching referrer info:', error);
      return {
        id: referrerId,
        address: '',
        isValid: false
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load referrer info from URL on mount
  useEffect(() => {
    if (referrerIdFromUrl) {
      fetchReferrerInfo(referrerIdFromUrl).then(setReferrerInfo);
      setCustomReferrerId(referrerIdFromUrl);
    } else {
      setReferrerInfo(null);
      setCustomReferrerId('');
    }
  }, [referrerIdFromUrl, fetchReferrerInfo]);

  // Set custom referrer ID
  const setReferrer = useCallback(async (referrerId: string) => {
    setCustomReferrerId(referrerId);
    
    if (referrerId) {
      const info = await fetchReferrerInfo(referrerId);
      setReferrerInfo(info);
      
      // Update URL parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.set('ref', referrerId);
      setSearchParams(newParams, { replace: true });
    } else {
      setReferrerInfo(null);
      
      // Remove ref parameter from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('ref');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, fetchReferrerInfo]);

  // Clear referrer
  const clearReferrer = useCallback(() => {
    setReferrerInfo(null);
    setCustomReferrerId('');
    
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('ref');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Generate referral link for current user
  const generateReferralLink = useCallback((userId: string) => {
    const currentUrl = new URL(window.location.origin);
    currentUrl.searchParams.set('ref', userId);
    return currentUrl.toString();
  }, []);

  // Get referrer address for registration
  // Return empty string when no valid referrer so the caller uses contract.register()
  const getReferrerAddressForRegistration = useCallback(async (): Promise<string> => {
    if (referrerInfo?.isValid === true && referrerInfo.address) {
      return referrerInfo.address;
    }
    return '';
  }, [referrerInfo]);

  return {
    referrerInfo,
    isLoading,
    customReferrerId,
    setReferrer,
    clearReferrer,
    generateReferralLink,
    getReferrerAddressForRegistration,
    hasReferrer: !!referrerInfo?.isValid
  };
};
