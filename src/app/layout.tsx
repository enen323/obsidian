import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Root layout — locale layout handles the actual HTML structure
export default function RootLayout({ children }: Props) {
  return children;
}
