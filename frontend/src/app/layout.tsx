import FlowbiteContext from "./components/FlowbiteContext"
import DefaultNavbar from "./components/Navbar"
import "./globals.css";

export const metadata = {
  title: "Homebroker Simulator",
  description: "A homebroker simulator using Nextjs, Nestjs and Go",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 h-screen flex flex-col">
        <DefaultNavbar />
        <FlowbiteContext>{children}</FlowbiteContext>
      </body>
    </html>
  );
}