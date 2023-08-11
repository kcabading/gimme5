import { Outlet} from "react-router-dom";

import Nav from '@/components/layouts/Nav'
import Footer from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/toaster"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useBoundStore } from "@/store";

export default function Root() {
	console.log('ROOT render')
    const { user } = useAuthenticator()
	
    const userName =  useBoundStore.getState().userName
	const updateProfile = useBoundStore((state) => state.updateProfile)
	
	if (!userName && user) {
		console.log('updating user')
		updateProfile({ userName : user.username!})
	}	

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