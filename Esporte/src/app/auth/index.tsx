// app/(public)/_layout.tsx  (exemplo)
import { Redirect, Stack } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as React from "react";

export default function PublicLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [dest, setDest] = React.useState<any>(null);

  React.useEffect(() => {
    console.log("aaaaaaaaaaaaaaaaa");
    if (!isLoaded){
      console.log("bbbbbbbb c");

      return;

    } 
    // Não logado -> continua no grupo público (login)
    console.log(isSignedIn);

    if (!isSignedIn) {
       console.log("cccccc");
      setDest("/auth/sign-in");
      return;
    }

    // Logado -> verifica se já tem perfil no backend
    (async () => {
      try {
        const jwt = await getToken({ template: "backend" });
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/users/${user!.id}`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        console.log(res);
        if (res.ok) {
          setDest("/auth/settings"); // ajuste p/ sua tela principal
        } else if (res.status === 404) {
          setDest("/auth/criarConta"); // precisa completar o cadastro
        } else {
          setDest("/auth/criarConta"); // fallback seguro
        }
      } catch {
        setDest("/auth/criarConta");
      }
    })();
  }, [isLoaded, isSignedIn]);

  // Evita flicker enquanto decide
  if (!isLoaded || (isSignedIn && !dest)) return null;

  if (dest){
    console.log("entrou aqui");
    return <Redirect href={dest} />;
  } 

  // Usuário NÃO logado -> telas públicas (login)
  return <Stack />;
}
