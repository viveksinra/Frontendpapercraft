'use client';

import Link from 'next/link';
import { Sparkles, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Question Bank', href: '/auth/jwt/sign-up' },
    { label: 'Online Testing', href: '/auth/jwt/sign-up' },
  ],
  resources: [
    { label: 'Help Centre', href: '#' },
    { label: 'Documentation', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <span className="font-semibold text-lg text-foreground">
                Paper<span className="text-gradient-static">Craft</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The complete assessment platform for schools, tutoring centres, and educational organisations.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="mailto:hello@papercraft.app"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PaperCraft. All rights reserved.</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <span className="text-red-500">&hearts;</span> for educators
          </p>
        </div>
      </div>
    </footer>
  );
}
