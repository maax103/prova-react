import { createContext, useLayoutEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  isAuth: false,
  isSeller: false,
  toggleSeller: () => { },
  makeLogin: (token: string) => { },
  logout: () => { },
});

export function AuthContextProvider({ children }: { children: JSX.Element }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const checkAuth = (hash: string) => {
    if (hash === "null") return { isValid: false };
    const { isValid } = { isValid: true }; //fetch servidor;
    return { isValid: isValid };
  };

  const auth = useMemo(
    () => ({
      isAuth: isAuth,
      makeLogin: (token: string) => {
        setIsAuth(true);
        localStorage.setItem("auth-token", token);
      },
      logout: () => {
        setIsAuth(false);
        localStorage.setItem("auth-token", "");
        auth.isSeller && setIsSeller(false);
        localStorage.setItem("seller", '');
      },
      isSeller: isSeller,
      toggleSeller: () => { 
        !isSeller ? localStorage.setItem('seller', 'true') : localStorage.setItem('seller', '')
        setIsSeller(!isSeller) 
      }
    }),
    [isAuth, isSeller]
  );

  useLayoutEffect(() => {
    const localToken = String(localStorage.getItem("auth-token"));
    if (localToken) {
      const { isValid } = checkAuth(localToken);
      isValid ? setIsAuth(true) : setIsAuth(false);
    }
    const localSeller = localStorage.getItem('seller')
    localSeller === 'true' && setIsSeller(true)
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
