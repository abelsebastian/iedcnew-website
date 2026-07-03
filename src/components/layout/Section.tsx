import type { ReactNode } from "react";

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function Section({ id, className = "", children }: Props) {
  return (
    <section id={id} className={`container mx-auto px-6 lg:px-12 ${className}`}>
      {children}
    </section>
  );
}
