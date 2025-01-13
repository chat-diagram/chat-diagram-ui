import Image from "next/image";
import logo from "./logo.png";

export const LocalIcons = {
  SystemLogo: ({
    className,
    width,
    height,
    style,
  }: {
    className?: string;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }) => (
    <Image
      width={width || 32}
      height={height || 32}
      src={logo.src}
      alt="logo"
      className={className}
      style={style}
    />
  ),
};
