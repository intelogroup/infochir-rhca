import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const NewsletterUnsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState("error");
        setErrorMsg("Lien invalide.");
        return;
      }
      const { data, error } = await supabase.functions.invoke("newsletter-unsubscribe", {
        body: { token },
      });
      if (error || !data?.ok) {
        setState("error");
        setErrorMsg(data?.error || error?.message || "Une erreur est survenue.");
        return;
      }
      setEmail(data.email);
      setState("success");
    };
    run();
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold mb-3 text-foreground">Newsletter Info Chir</h1>
        {state === "loading" && <p className="text-muted-foreground">Traitement en cours…</p>}
        {state === "success" && (
          <>
            <p className="text-foreground mb-2">Vous avez été désabonné avec succès.</p>
            {email && <p className="text-sm text-muted-foreground">{email}</p>}
          </>
        )}
        {state === "error" && (
          <>
            <p className="text-destructive mb-2">Désinscription impossible</p>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
          </>
        )}
      </div>
    </main>
  );
};

export default NewsletterUnsubscribe;
