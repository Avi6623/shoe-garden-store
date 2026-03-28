import { MapPin, Phone, Mail, Copyright } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 pt-16 pb-8">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <Link href="/" className="text-2xl font-black tracking-tighter mb-6 inline-block">
              SHOE <span className="text-brand-accent">GARDEN</span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
              Engineered for performance. Designed for the streets. Experience the next generation of premium footwear.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest">Shop</h4>
            <ul className="space-y-3 text-sm text-brand-muted font-medium">
              <li><Link href="/products?category=new" className="hover:text-brand-accent transition-colors">New Releases</Link></li>
              <li><Link href="/products?category=men" className="hover:text-brand-accent transition-colors">Men</Link></li>
              <li><Link href="/products?category=women" className="hover:text-brand-accent transition-colors">Women</Link></li>
              <li><Link href="/products?category=sneakers" className="hover:text-brand-accent transition-colors">Sneakers</Link></li>
              <li><Link href="/products?category=crocs" className="hover:text-brand-accent transition-colors">Crocs</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest">Contact Us</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-full text-brand-accent">
                  <MapPin size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm mb-1 uppercase tracking-wider">Store Location</h5>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    Nai Bazar Purani Baasti<br />
                    272002
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-full text-brand-accent">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1 uppercase tracking-wider">Mobile</h5>
                    <a href="tel:9125933101" className="text-brand-muted text-sm hover:text-brand-accent transition-colors">
                      +91 9125933101
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-full text-brand-accent">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1 uppercase tracking-wider">Email</h5>
                    <a href="mailto:kasodhanvikas@gmail.com" className="text-brand-muted text-sm hover:text-brand-accent transition-colors">
                      kasodhanvikas@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-sm font-medium text-brand-muted flex items-center gap-1.5">
              <Copyright size={14} /> {new Date().getFullYear()} Shoe Garden. All rights reserved.
            </p>
            <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-accent transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm font-bold tracking-widest uppercase text-brand-secondary/80">
            Prop: <span className="text-brand-primary dark:text-white">Vaibhav Gupta</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
