'use client'

import { useState, useEffect } from 'react'
// import SigninButton from "../SigninButton"
// import { Switch } from '@headlessui/react'
import useColorMode from "@/hooks/useColorMode"
import { Link } from 'react-router-dom'
// import Image from "next/image"

import { AiOutlineMenu, AiOutlineClose, AiFillSetting, AiFillFacebook, AiFillInstagram}  from "react-icons/ai";
// import useIsLoggedIn from '@/hooks/useIsLoggedIn'
// import { useRouter } from "next/navigation"

import { BsSun, BsMoon } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button } from '@/components/ui/button';

const Navigation = function () {

    const { route, signOut } = useAuthenticator((context) => [
        context.route,
        context.signOut,
    ]);
    const navigate = useNavigate();

    function logOut() {
        signOut();
        navigate('/signin');
    }

    const [switcheEnabled, setSwitchEnabled] = useState(false)
    const [mobileNavEnabled, setMobileNavEnabled] = useState(false)
    const [colorMode, setColorMode] = useColorMode()
    console.log(colorMode)
    // const isLoggedIn = useIsLoggedIn()
    const isLoggedIn = true

    const handleNavClick = function(link: string) {
        setMobileNavEnabled(false)
        navigate(link)
    }

    const toggleTheme = function() {
        setSwitchEnabled(!switcheEnabled)
    }

    useEffect(() => {   
        setColorMode( switcheEnabled ? "dark" : "light")
    }, [switcheEnabled])

    return (
        <>
            <nav className="w-full fixed backdrop-blur border-b border-slate-900/10 dark:border-slate-50/[0.06] bg-white/75 dark:bg-slate-900/75 py-3 max-lg:px-4 z-50">
                <div className="z-10 lg:z-50 flex items-center justify-between w-full lg:w-3/4 m-auto">
                    <h1 className="text-black font-bold font-mont text-lg dark:text-white">
                        <Link to="/">Gimme 5</Link>
                    </h1>
                    <div className="flex max-sm:hidden dark:text-white">
                        <Link className="ml-3" to="/play">Play</Link>
                        <Link to="/leaderboards" className="ml-3" >Leaderboards</Link>
                    </div>
                    <div className="flex max-sm:hidden dark:text-white items-center">
                        {route !== 'authenticated' ? (
                        <Button onClick={() => navigate('/signin')}>Login</Button>
                        ) : (
                        <Button onClick={() => logOut()}>Logout</Button>
                        )}
                        
                        <Link className="mx-3 text-2xl" to="/settings"><AiFillSetting/></Link>
                        <button className="p-3 rounded-md hover:text-black hover:bg-slate-100" onClick={toggleTheme}>
                           { switcheEnabled ? <BsMoon /> : <BsSun /> }
                        </button>
                    </div>
                    {
                        mobileNavEnabled
                        ? <AiOutlineClose className="sm:hidden text-lg cursor-pointer dark:text-white" onClick={ () => setMobileNavEnabled(!mobileNavEnabled)} />
                        : <AiOutlineMenu className="sm:hidden text-lg cursor-pointer dark:text-white" onClick={ () => setMobileNavEnabled(!mobileNavEnabled)}/>
                    }
                </div>
            </nav>
            <nav className={`
                ${mobileNavEnabled ? 'right-0' : 'right-[100%]'}
                mt-[50px] w-full h-full fixed bg-slate-800/90 transition-right ease-in-out duration-200 sm:hidden p-5 text-white z-50`}>
                <div className="flex flex-col">
                    <div className="w-full flex text-xl">
                        <Button onClick={() => navigate('/signin')}>SignIn</Button>
                    </div>
                    { isLoggedIn && <button onClick={ () => handleNavClick('/play')} className="text-xl my-3 text-left">Play</button> }
                    <button onClick={ () => handleNavClick('/flags')} className="text-xl my-3 text-left">Flags</button>
                    <button onClick={ () => handleNavClick('/leaderboards')} className="text-xl my-3 text-left">Leaderboards</button>
                    <div className="text-xl flex justify-between my-3">
                        <label htmlFor="">Dark Mode</label>
                        <button className="ml-3 px-3 rounded-md hover:text-black hover:bg-slate-100" onClick={toggleTheme}>
                           { switcheEnabled ? <BsMoon /> : <BsSun /> }
                        </button>
                    </div>
                    <div className="social-icons flex justify-start text-4xl mt-3">
                        <a href="" className="github"><AiFillFacebook /></a>
                        <a href="" className="github ml-5"><AiFillInstagram /></a>
                    </div>
                </div>
            </nav>
        </>    
    )
}

export default Navigation