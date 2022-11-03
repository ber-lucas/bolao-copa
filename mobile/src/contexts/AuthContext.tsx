import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { createContext, ReactNode, useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string,
  avatarUrl: string,
}

export interface AuthContextDataProps {
  user: UserProps,
  isUserLoading: boolean,
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '276016499214-tfr4pvjumj0sjioi3uo5ol12k04dkp5b.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();

    } catch (error) {
      console.log(error)
      throw error;

    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_Token: string) {
    console.log('TOKEN DE ACESSO =>', access_Token)
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}