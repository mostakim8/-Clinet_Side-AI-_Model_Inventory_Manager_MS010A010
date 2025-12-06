import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SuccessModal = ({ onRedirect }) => {
    
    const [countdown, setCountdown] = useState(2.5);

    useEffect(() => {
        // navigation timer
        const redirectTimer = setTimeout(() => {
            if (onRedirect) {
                onRedirect(); 
            }
        }, 2500); 

        // update countdown
        const interval = setInterval(() => {
            setCountdown((prev) => {
                const newValue = prev - 0.1;
                return newValue > 0 ? newValue : 0;
            });
        }, 100); 

        return () => {
            clearTimeout(redirectTimer);
            clearInterval(interval);
        };
    }, [onRedirect]);


    return (
       
                    <DotLottieReact
                        src="https://lottie.host/79e4daa1-0183-417a-a0f2-d34a03409f91/kBBiudA69z.lottie" 
                        loop={false} 
                        autoplay
                    />
                
    );
};

export default SuccessModal;