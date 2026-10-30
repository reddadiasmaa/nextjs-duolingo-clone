import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export const Header = async () => {
  const { userId } = await auth();

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <Link href="/" className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Lingo
          </h1>
        </Link>
        <div className="flex items-center gap-x-3">
          {userId ? (
            <form action={logout}>
              <Button size="lg" variant="ghost" type="submit">
                Déconnexion
              </Button>
            </form>
          ) : (
            <Button size="lg" variant="ghost" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
