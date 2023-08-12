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
	console.log('user', user)
	if (!userName && user) {
		console.log('updating user')
		updateProfile({ userName : user.username!, email: user.attributes?.email!})
	}	

    return (
      <>
        <Nav />
        <main className="sm:w-3/4 max-lg:px-4 items-center w-full m-auto pt-24 sm:pt-28">
            <Outlet />
        </main>
        <Toaster />
        <Footer />
      </>
    );
}