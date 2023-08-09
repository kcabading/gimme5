import { Outlet} from "react-router-dom";

import Nav from '@/components/layouts/Nav'
import Footer from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/toaster"

export default function Root() {
    return (
      <>
        <Nav />
        <main className="flex flex-col items-center w-full m-auto dark:bg-slate-900 dark:text-white pt-24 sm:pt-28">
            <Outlet />
        </main>
        <Toaster />
        <Footer />
      </>
    );
  }