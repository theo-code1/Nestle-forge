import React from 'react';
import { 
  ImageIcon, 
  Scissors, 
  Minimize2, 
  Palette, 
  Upload,
  RefreshCw,
  Crop,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const imageTools = [
    { name: 'Background Remover', icon: Scissors, href: '/background-remover' },
    { name: 'Image Converter', icon: RefreshCw, href: '/image-converter' },
    { name: 'Image Compressor', icon: Minimize2, href: '/image-compressor' },
    { name: 'Color Palette Extractor', icon: Palette, href: '/color-palette' },
  ];

  const quickLinks = [
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'hello@imagetools.com', href: 'mailto:hello@imagetools.com' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'San Francisco, CA', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ImageTools
              </h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Professional image editing tools at your fingertips. Transform, enhance, and optimize your images with our powerful AI-driven solutions.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-slate-700 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Image Tools Section */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-400">Our Tools</h4>
            <ul className="space-y-4">
              {imageTools.map((tool) => (
                <li key={tool.name}>
                  <a
                    href={tool.href}
                    className="flex items-center gap-3 text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                  >
                    <tool.icon className="w-4 h-4 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="group-hover:text-blue-400 transition-colors duration-300">
                      {tool.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-400">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 block group"
                  >
                    <span className="group-hover:text-blue-400 transition-colors duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-400">Get in Touch</h4>
            <ul className="space-y-4">
              {contactInfo.map((contact) => (
                <li key={contact.text}>
                  <a
                    href={contact.href}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 group"
                  >
                    <contact.icon className="w-4 h-4 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="group-hover:text-blue-400 transition-colors duration-300">
                      {contact.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Newsletter Signup */}
            <div className="mt-8">
              <h5 className="text-sm font-medium mb-3 text-slate-200">Stay Updated</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2024 ImageTools. All rights reserved. Built with ❤️ for creators worldwide.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;