"use client";
import Image from "next/image";

type AvatarProps = {
  name: string;
  size?: number;
  src?: string;
};

export function Avatar({ name, size = 48, src }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className="cc-avatar"
      style={{ width: size, height: size, fontSize: size / 2.6 }}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name}'s avatar`}
          width={size}
          height={size}
          sizes={`${size}px`}
          unoptimized
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        initials || "?"
      )}
    </div>
  );
}
