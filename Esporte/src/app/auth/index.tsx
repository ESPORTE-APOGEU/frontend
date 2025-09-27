import { Redirect, Stack } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as React from "react";

export default function PublicLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [dest, setDest] = React.useState<string | any>(null);

  React.useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      console.log("nao esta logado");
      setDest("/auth/sign-in");
      return;
    }

    (async () => {
      // 1) token “fresco”
      const getFresh = async () =>
        await getToken({ template: "backend", skipCache: true });

      const tryFetch = async () => {
        const jwt = await getFresh();
        if (!jwt) throw new Error("Sem JWT do Clerk");
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/users/me`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        // Retry em 401 com outro token fresco
        if (res.status === 401) {
          const jwt2 = await getFresh();
          if (!jwt2) return res;
          return await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/users/me`,
            { headers: { Authorization: `Bearer ${jwt2}` } }
          );
        }
        return res;
      };

      try {
        const res = await tryFetch();
        if (res.ok) {
          setDest("/auth/home");
        } else if (res.status === 404) {
          // não há perfil no backend ainda -> completar cadastro
          setDest("/auth/criarConta");
        } else if (res.status === 401) {
          // ainda sem auth válida -> volte ao sign-in
          setDest("/auth/sign-in");
        } else {
          // fallback
          setDest("/auth/sign-in");
        }
      } catch (e) {
        setDest("/auth/sign-in");
      }
    })();
  }, [isLoaded, isSignedIn]);
  console.log(dest);
  if (!isLoaded || (isSignedIn && !dest)) return null;
  if (dest) return <Redirect href={dest} />;
  return <Stack />;
}
