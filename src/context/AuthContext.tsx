import { createContext, useLayoutEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  isAuth: false,
  login: () => { },
  logout: () => { }
})

export function AuthContextProvider({ children }: { children: JSX.Element }) {

  const [isAuth, setIsAuth] = useState(false)
  const checkAuth = (hash: string) => {
    if (hash === 'null') return { isValid: false, token: hash }
    const isValid = true //fetch servidor;
    return { isValid: isValid, token: hash };
  }
  const handleLogin = (user: string, password: string) => {
    const [isValid, token] =

      [true, 'any token']; //fetch servidor

    return { isValid: isValid, token: token }
  }
  const auth = useMemo(
    () => ({
      isAuth: isAuth,
      login: () => {
        const { isValid, token } = handleLogin('max', '123')
        if (isValid) {
          setIsAuth(true)
          localStorage.setItem('auth-token', token)
        }
      },
      logout: () => {
        setIsAuth(false)
        localStorage.setItem('auth-token', '')
      }
    }
    ), [isAuth])

  useLayoutEffect(() => {
    const localToken = String(localStorage.getItem('auth-token'))
    if (localToken) {
      const { isValid, token } = checkAuth(localToken)
      isValid ? setIsAuth(true) : setIsAuth(true)
    }
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
