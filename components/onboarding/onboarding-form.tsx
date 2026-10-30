"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { submitOnboarding } from "@/actions/user-onboarding";
import { Button } from "@/components/ui/button";

const languages = [
  { id: "Spanish", title: "Espagnol", flag: "/es.svg" },
  { id: "English", title: "Anglais", flag: "/en.svg" },
  { id: "Japanese", title: "Japonais", flag: "/jp.svg" },
];

const reasons = [
  { id: "etudes", label: "Études & Examens", icon: "🎓" },
  { id: "travail", label: "Carrière & Travail", icon: "💼" },
  { id: "voyage", label: "Voyage & Découverte", icon: "✈️" },
  { id: "culture", label: "Culture & Plaisir personnel", icon: "🧠" },
  { id: "famille", label: "Famille & Amis", icon: "💬" },
];

const educationLevels = [
  { id: "college", label: "Collège (6ème - 3ème)", icon: "🏫" },
  { id: "lycee", label: "Lycée (Tronc commun - Bac)", icon: "🎒" },
  { id: "licence", label: "Licence / Bac +3", icon: "🎓" },
  { id: "master", label: "Master / Ingénieur / Bac +5", icon: "📜" },
  { id: "doctorat", label: "Doctorat / Chercheur", icon: "🔬" },
  { id: "autre", label: "Autre / Professionnel", icon: "💼" },
];

export const OnboardingForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedReason, setSelectedReason] = useState("etudes");
  const [selectedLevel, setSelectedLevel] = useState("licence");
  const [age, setAge] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!age || Number(age) < 5 || Number(age) > 120) {
      setError("Veuillez renseigner un âge valide (entre 5 et 120 ans).");
      return;
    }

    const formData = new FormData();
    formData.append("age", age.toString());
    formData.append("targetLanguage", selectedLanguage);
    formData.append("learningReason", selectedReason);
    formData.append("educationLevel", selectedLevel);

    startTransition(async () => {
      const res = await submitOnboarding(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="w-full max-w-[620px] p-6 sm:p-8 bg-white rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center">
      <Image src="/mascot.svg" height={70} width={70} alt="Mascot" className="mb-2" />
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-700 text-center mb-2">
        Bienvenue parmi nous ! 👋
      </h1>
      <p className="text-sm text-neutral-500 mb-6 text-center max-w-[450px]">
        Aidez-nous à personnaliser votre expérience d&apos;apprentissage selon votre profil et vos objectifs.
      </p>

      {error && (
        <div className="w-full p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-6">
        {/* 1. Âge */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="text-sm font-bold text-neutral-700 flex items-center gap-x-2 mb-2">
            <span>🎂</span> Quel est votre âge ?
          </label>
          <input
            type="number"
            required
            min={5}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Ex: 21 ans"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-green-500 focus:outline-none transition font-medium text-neutral-700"
          />
        </div>

        {/* 2. Langue à apprendre */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="text-sm font-bold text-neutral-700 flex items-center gap-x-2 mb-3">
            <span>🌍</span> Quelle langue voulez-vous apprendre ?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition font-bold text-sm gap-y-2 ${
                  selectedLanguage === lang.id
                    ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                    : "border-slate-200 bg-white text-neutral-600 hover:bg-slate-100"
                }`}
              >
                <Image src={lang.flag} width={36} height={26} alt={lang.title} className="rounded-sm shadow-xs" />
                <span>{lang.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Pourquoi apprenez-vous ? */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="text-sm font-bold text-neutral-700 flex items-center gap-x-2 mb-3">
            <span>🎯</span> Pourquoi apprenez-vous cette langue ?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {reasons.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setSelectedReason(r.id)}
                className={`flex items-center gap-x-3 p-3 rounded-xl border-2 text-left transition font-semibold text-xs sm:text-sm ${
                  selectedReason === r.id
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-neutral-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-lg">{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Niveau d'études */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="text-sm font-bold text-neutral-700 flex items-center gap-x-2 mb-3">
            <span>📚</span> Quel est votre niveau d&apos;études ?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {educationLevels.map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`flex items-center gap-x-3 p-3 rounded-xl border-2 text-left transition font-semibold text-xs sm:text-sm ${
                  selectedLevel === lvl.id
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-neutral-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-lg">{lvl.icon}</span>
                <span>{lvl.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          variant="secondary"
          className="w-full mt-2 text-base font-extrabold uppercase tracking-wide"
          disabled={isPending}
        >
          {isPending ? "Enregistrement de votre profil..." : "C'est parti ! 🚀"}
        </Button>
      </form>
    </div>
  );
};

