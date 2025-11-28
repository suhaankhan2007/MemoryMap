import { createClient } from '@base44/sdk';

// Create a client with API key for backend integrations
export const base44 = createClient({
  appId: "6904215884463447580baa24", 
  apiKey: "4d2198770e9f42da86edce610e01268c", // API key for server-to-server calls like InvokeLLM
});