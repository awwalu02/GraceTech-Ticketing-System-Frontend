import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "IT Support Dashboard",
  description: "Ticket management dashboard for IT Support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
