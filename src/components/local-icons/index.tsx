import Image from "next/image";
import logo from "./logo.png";

export const LocalIcons = {
  SystemLogo: ({ className }: { className: string }) => (
    <Image
      width={32}
      height={32}
      src={logo.src}
      alt="logo"
      className={className}
    />
  ),
};
