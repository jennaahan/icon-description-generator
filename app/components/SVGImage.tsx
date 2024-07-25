import React from 'react';

interface SvgImageProps {
  svgString: string;
  alt?: string;
}

const SvgImage: React.FC<SvgImageProps> = ({ svgString, alt }) => {
  const encodedSvg = encodeURIComponent(svgString);
  const imgSrc = `data:image/svg+xml;charset=UTF-8,${encodedSvg}`;

  return <img src={imgSrc} alt={alt} />;
};

export default SvgImage;