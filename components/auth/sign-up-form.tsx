"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { register } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const isPasswordValid = hasLength && hasUpper && hasNumber && hasSymbol;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await register(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="w-full max-w-[440px] p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center">
      <Image src="/mascot.svg" height={80} width={80} alt="Mascot" className="mb-4" />
      <h1 className="text-2xl font-extrabold text-neutral-700 mb-2">
        Créer un compte
      </h1>
      <p className="text-sm text-neutral-500 mb-6 text-center">
        Rejoignez Lingo et commencez à apprendre gratuitement
      </p>

      {error && (
        <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-4">
        <div>
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
            Nom ou Pseudo
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Votre nom"
            className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:outline-none transition font-medium"
          />
        </div>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ex: Secret@2026"
            className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:outline-none transition font-medium"
          />

          {/* Critères de sécurité */}
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-y-1.5 text-xs">
            <span className="font-bold text-neutral-600 mb-0.5">Le mot de passe doit contenir :</span>
            
            <div className={`flex items-center gap-x-2 ${hasLength ? "text-green-600 font-semibold" : "text-neutral-500"}`}>
              {hasLength ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 text-neutral-400" />}
              <span>Au moins 8 caractères</span>
            </div>

            <div className={`flex items-center gap-x-2 ${hasUpper ? "text-green-600 font-semibold" : "text-neutral-500"}`}>
              {hasUpper ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 text-neutral-400" />}
              <span>Au moins une lettre majuscule (A-Z)</span>
            </div>

            <div className={`flex items-center gap-x-2 ${hasNumber ? "text-green-600 font-semibold" : "text-neutral-500"}`}>
              {hasNumber ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 text-neutral-400" />}
              <span>Au moins un chiffre (0-9)</span>
            </div>

            <div className={`flex items-center gap-x-2 ${hasSymbol ? "text-green-600 font-semibold" : "text-neutral-500"}`}>
              {hasSymbol ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 text-neutral-400" />}
              <span>Au moins un symbole spécial (ex: @, #, $, %, !)</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          variant="secondary"
          className="w-full mt-2"
          disabled={isPending || !isPasswordValid}
        >
          {isPending ? "Création en cours..." : "Commencer l'aventure"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-neutral-500">
        Vous avez déjà un compte ?{" "}
        <Link href="/sign-in" className="text-green-600 font-bold hover:underline">
          Se connecter
        </Link>
      </div>
    </div>
  );
};
