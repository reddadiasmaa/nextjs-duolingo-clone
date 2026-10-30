"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="w-full max-w-[420px] p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center">
      <Image src="/mascot.svg" height={80} width={80} alt="Mascot" className="mb-4" />
      <h1 className="text-2xl font-extrabold text-neutral-700 mb-2">
        Bon retour !
      </h1>
      <p className="text-sm text-neutral-500 mb-6 text-center">
        Connectez-vous pour continuer votre apprentissage
      </p>

      {error && (
        <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-4">
        <div>
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="votre@email.com"
            className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:outline-none transition font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
            Mot de passe
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:outline-none transition font-medium"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          variant="secondary"
          className="w-full mt-2"
          disabled={isPending}
        >
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-neutral-500">
        Pas encore de compte ?{" "}
        <Link href="/sign-up" className="text-green-600 font-bold hover:underline">
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

