import { useState, useEffect } from 'react'
import useColorMode from "@/hooks/useColorMode"
import { Link } from 'react-router-dom'

import { AiOutlineMenu, AiOutlineClose, AiFillFacebook, AiFillInstagram}  from "react-icons/ai";
import { BsSun, BsMoon } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button } from '@/components/ui/button';

import { Cog, LogIn, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { getGuestUsername } from '@/lib/utils';

import logo from '@/assets/logo.png'

const Navigation = function () {

    const { authStatus, signOut, user } = useAuthenticator((context) => [
        context.user,
        context.signOut,
        context.authStatus
    ]);

    const navigate = useNavigate();

    function logOut() {
        signOut();
        navigate('/signin');
    }

    const [switcheEnabled, setSwitchEnabled] = useState(false)
    const [mobileNavEnabled, setMobileNavEnabled] = useState(false)
    const {setColorMode} = useColorMode()
    

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
            <nav className="w-full fixed backdrop-blur border-b border-slate-900/10 dark:border-slate-50/[0.06] bg-white/75 dark:bg-slate-900/75 max-lg:px-4 z-50">
                <div className="z-10 lg:z-50 flex items-center justify-between w-full lg:w-3/4 m-auto py-3">
                    <h1 className="text-red-500 font-extrabold text-lg dark:text-white">
                        <Link to="/"><img className='inline' src={logo} alt="logo" width={50}/>&nbsp; Gimme5</Link>
                    </h1>
                    <div className="flex max-sm:hidden dark:text-white font-semibold">
                        <Link className="ml-3 hover:text-amber-500" to="/play">Play</Link>
                        <Link className="ml-3 hover:text-amber-500" to="/questions">Questions</Link>
                        <Link to="/leaderboards" className="ml-3 hover:text-amber-500" >Leaderboards</Link>
                    </div>
                    <div className="flex max-sm:hidden dark:text-white items-center">
                        {
                        authStatus === 'authenticated' && user ?
                            <>
                                <span>Hi, <strong>{user.username?.substring(0,20)}</strong></span>
                                <Button onClick={() => logOut()} variant={'link'}><LogOut/> &nbsp; Logout</Button>
                            </>
                        :
                            <>
                                <span>Hi, <strong>{getGuestUsername()}</strong></span>
                                <Button onClick={() => navigate('/signin')} variant={'link'}>
                                    <><LogIn />&nbsp; Login</>
                                </Button>
                            </>
                        }
                        <Link className="mx-3 text-2xl" to="/settings" title='settings'><Cog/></Link>
                        <button className="p-3 rounded-md hover:text-black hover:bg-slate-100" onClick={toggleTheme}>
                           { switcheEnabled ? <Moon /> : <Sun /> }
                        </button>
                    </div>
                    <div className='flex gap-3 items-center sm:hidden'>
                        <span>Hi, <strong>{ authStatus === 'authenticated' && user ? user.username?.substring(0,20) : getGuestUsername()}</strong></span>
                    {
                        mobileNavEnabled
                        ? <X className="text-lg cursor-pointer dark:text-white" size={30} onClick={ () => setMobileNavEnabled(!mobileNavEnabled)} />
                        : <Menu className="text-lg cursor-pointer dark:text-white" size={30} onClick={ () => setMobileNavEnabled(!mobileNavEnabled)}/>
                    }
                    </div>
                </div>
            </nav>
            <nav className={`
                ${mobileNavEnabled ? 'right-0' : 'right-[100%]'}
                mt-[73px] w-full h-full fixed bg-slate-800/90 transition-right ease-in-out duration-200 sm:hidden p-5 text-white z-50`}>
                <div className="flex flex-col">
                    <div className="w-full flex text-xl">
                        {authStatus === 'unauthenticated' ? (
                        <Button onClick={() => handleNavClick('/signin')} variant={'secondary'}><LogIn/>&nbsp;Login</Button>
                        ) : (
                        <Button onClick={() => logOut()} variant={'secondary'}><LogOut/>&nbsp;Logout</Button>
                        )}
                    </div>
                    <button onClick={ () => handleNavClick('/play')} className="text-xl my-3 text-left">Play</button>
                    <button onClick={ () => handleNavClick('/questions')} className="text-xl my-3 text-left">Questions</button>
                    <button onClick={ () => handleNavClick('/leaderboards')} className="text-xl my-3 text-left">Leaderboards</button>
                    <button onClick={ () => handleNavClick('/settings')} className="text-xl my-3 text-left">Settings</button>
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