import { useRef } from 'react';

type Options = {
    volume: number;
    playbackRate: number;
};

const useAudio = (src: string, { volume = 1, playbackRate = 1 }: Options) => {

    console.log('new hook')
    const sound = useRef(new Audio(src));
    sound.current.playbackRate = playbackRate;
    sound.current.volume = volume;

    return sound.current;
};

export default useAudio;
