import { ConstructionOutlined } from "@mui/icons-material";
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type TCartProduct = {
  name: string;
  amount: number;
};

export const CartContext = createContext({
  count: 0,
  getLocalStorageItems: () => [] as TCartProduct[],
  addItemsToLocalStorage: (items: string[] | string) => {},
  removeItemsFromLocalStorage: (items: string[] | string) => {},
  clearLocalStorage: () => {},
});

export function CartContextProvider({ children }: { children: JSX.Element }) {
  const [count, setCount] = useState(0);
  const cart = useMemo(
    () => ({
      count: count,
      getLocalStorageItems: () => {
        try {
          const local = localStorage.getItem("cart") || "[]";
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          return localCart;
        } catch (err) {
          return [];
        }
      },
      addItemsToLocalStorage: (items: string[] | string) => {
        const itemsArray = typeof items === "string" ? [items] : items;
        if (!itemsArray.length) return;
        const localItem = localStorage.getItem("cart");
        if (!localItem) {
          const products = itemsArray.map((item) => ({
            name: item,
            amount: 1,
          }));
          localStorage.setItem("cart", JSON.stringify(products));
          setCount((oldValue) => oldValue + 1);
          return;
        }
        try {
          const itemsAtCart: TCartProduct[] = JSON.parse(localItem);
          let arrayCopy = itemsArray;
          let products = itemsAtCart.map((item) => {
            if (arrayCopy.includes(item.name)) {
              const spliced = arrayCopy.splice(arrayCopy.indexOf(item.name));
              return {
                name: item.name,
                amount: item.amount + 1,
              };
            } else return item;
          });
          if (arrayCopy.length) {
            products = [
              ...products,
              ...arrayCopy.map((item) => ({ name: item, amount: 1 })),
            ];
          }
          localStorage.setItem("cart", JSON.stringify(products));
          setCount(products.length);
        } catch {
          setCount(0);
          localStorage.setItem("cart", "");
        }
      },
      removeItemsFromLocalStorage: (items: string[] | string) => {
        const arrayItems = typeof items === "string" ? [items] : items;
        if (!arrayItems.length) return;
        const localItem = localStorage.getItem("cart");
        if (localItem) {
          try {
            const itemsAtCart = JSON.parse(localItem);
            let products: any[] = [];
            itemsAtCart.forEach((item) => {
              if (arrayItems.includes(item.name)) {
                const amount = item.amount - 1;
                amount > 0 &&
                  products.push({ name: item.name, amount: amount });
              } else {
                products.push(item);
                setCount((oldValue) => oldValue - 1);
              }
            });
            const newLocalInfos = JSON.stringify(products);
            localStorage.setItem("cart", newLocalInfos);
            products.length !== count && setCount(products.length);
          } catch {
            localStorage.setItem("cart", "");
            setCount(0);
          }
        }
      },
      clearLocalStorage: () => {
        localStorage.setItem("cart", "");
        setCount(0);
      },
    }),
    [count]
  );

  useEffect(() => {
    const localToken = String(localStorage.getItem("cart"));
    try {
      const items = JSON.parse(localToken);
      setCount(items.length);
    } catch {}
  }, []);
  //@ts-ignore
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}
