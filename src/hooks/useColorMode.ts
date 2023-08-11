'use client'

import { useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

function useColorMode() {
    const [colorMode, setColorMode] = useLocalStorage('colorMode', 'light')

    useEffect(() => {
        const darkMode = 'dark'
        const bodyClasses = document.body.classList        
        colorMode === 'dark' ? bodyClasses.add(darkMode) : bodyClasses.remove(darkMode)
    }, [colorMode])
    
    return {colorMode, setColorMode}
}

export default useColorMode