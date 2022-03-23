import { createContext } from 'react';

export const AuthContext = createContext(false);  //Default value for auth. Means certain pages wont be rendered without auth-log-in