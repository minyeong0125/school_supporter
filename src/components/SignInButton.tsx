import { signIn } from "@/auth";
import Image from "next/image";
export default function SignInButton() {
  return (
    <div className="flex flex-col gap-4 mt-10 items-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="flex items-center justify-center gap-4 rounded-lg pl-3 mb-4"
        >
          <Image src="/google-logo.webp" height={30} width={30} alt="google" />
          <span className="bg-blue-500 text-white px-4 py-3">
            Sign in with Google
          </span>
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="flex items-center justify-center gap-4 rounded-lg pl-3 mb-4"
        >
          <Image src="/github-logo.png" height={30} width={30} alt="github" />
          <span className="bg-blue-500 text-white px-4 py-3">
            Sign in with Github
          </span>
        </button>
      </form>
    </div>
  );
}
