import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const useHandleApiErrors = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleApiErrors = async (response: Response) => {
    if (response.status === 401) {
      await signOut();
      router.push("/");
      return false;
    }

    if (!response.ok) {
      router.push(`/error/${response.status}`);
      throw new Error(`Error: ${response.statusText}`);
    }

    return true;
  };

  return { handleApiErrors };
};

export default useHandleApiErrors;
