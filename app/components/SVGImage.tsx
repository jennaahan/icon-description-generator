import React from 'react'
import Image from 'next/image'

interface SvgImageProps {
  src: string,
  alt: string,
  width: number,
  height: number
}

const SvgImage: React.FC<SvgImageProps> = ({ src, alt, width, height }) => {
  const encodedSvg = encodeURIComponent(src)
  const imgSrc = `data:image/svg+xml;charset=UTF-8,${encodedSvg}`

  return <Image src={imgSrc} alt={alt} width={width} height={height}></Image>
}

export default SvgImage