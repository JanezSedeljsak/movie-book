import { useState } from "react";
import FallbackImage from '@/assets/fallback.jpg';

interface ImageProps {
    src: string,
    style?: Object
}

export default function Image(props: ImageProps) {
    const [imgSrc, setImgSrc] = useState(props.src);
    const handleError = () => {
        setImgSrc(FallbackImage);
    };

    return (
        <img 
            src={imgSrc} 
            alt="Image does not exist!" 
            onError={handleError}
            style={{ 
                objectFit: 'cover',
                ...props.style
            }}
        />
    );
}