import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6904215884463447580baa24", 
  apiKey: "4d2198770e9f42da86edce610e01268c", // Add the API key from your dashboard
  // requiresAuth: true // This is likely for user-based login, let's try with only the API key first.
});