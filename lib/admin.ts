import { auth } from "@/lib/auth";

export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return true;
};
