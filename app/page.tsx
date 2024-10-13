import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.svg";
import LandingImg from "@/assets/main.svg";

export default function Home() {
  return (
    <main>
      <header className="max-w-6xl mx-auto px-4 sm:px-8 py-6 mb-10">
        <Image src={Logo} alt="logo" />
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 min-h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center">
        <div>
          <h1 className="capitalize text-4xl md:text-7xl font-bold">
            job <span className="text-primary">tracking</span> app
          </h1>
          <p className="leading-loose max-w-md mt-4 ">
            Welcome to Jobify, the ultimate tool to streamline your job search.
            Track applications, monitor progress, and organize your job
            prospects with ease. Create a personalized profile and get real-time
            updates as you manage your career journey. Simplify your job search
            and stay organized with Jobify.
          </p>
          <Button asChild className="mt-4">
            <Link href="/add-job">Get Started</Link>
          </Button>
        </div>
        <Image src={LandingImg} alt="landing" className="hidden lg:block " />
      </section>
    </main>
  );
}
