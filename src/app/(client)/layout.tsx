import NavbarMount from "@/components/layout/NavbarMount";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0a0a0a]">
      <CartProvider>
        <NavbarMount />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppWidget />
      </CartProvider>
    </div>
  );
}
