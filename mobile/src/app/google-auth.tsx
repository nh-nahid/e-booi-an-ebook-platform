import React, { useEffect } from "react";
import { router } from "expo-router";

import { Loading, Screen } from "@/components/ui";

// The Google sign-in redirect (ebooi://google-auth?code=...) lands here when the
// OS hands the link to the app. The sign-in itself is finished by the in-app
// browser session in AuthProvider.loginWithGoogle, so just move on.
export default function GoogleAuthReturn() {
  useEffect(() => {
    const t = setTimeout(() => router.replace("/"), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <Screen>
      <Loading />
    </Screen>
  );
}
