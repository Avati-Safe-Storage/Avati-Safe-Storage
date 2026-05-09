import { MapPin, Phone, Mail, Instagram, Youtube, Linkedin } from "lucide-react";
import logoImg from "../../imports/image.png";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-[#0B1F3A] to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <img
              src={logoImg}
              alt="Avati Safe Storage"
              className="h-16 mb-4"
            />
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for secure, climate-controlled storage solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg mb-4 text-[#D4AF37]">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg mb-4 text-[#D4AF37]">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <span className="text-gray-400">#429/5, 8th Main, N.R.I. layout, Kalkere, Horamavu Post, Bangalore - 560043</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-gray-400">+91 80955 89888</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-gray-400">contact@avatistorage.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg mb-4 text-[#D4AF37]">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D4AF37] transition-all group">
                <Instagram className="w-5 h-5 group-hover:text-black" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D4AF37] transition-all group">
                <Youtube className="w-5 h-5 group-hover:text-black" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D4AF37] transition-all group">
                <Linkedin className="w-5 h-5 group-hover:text-black" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2026 Avati Safe Storage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
