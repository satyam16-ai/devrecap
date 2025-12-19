import { Github, Twitter, Linkedin, Mail, Heart, Instagram } from 'lucide-react';
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-900 bg-slate-950 pt-16 pb-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Logo size={40} showText={true} />
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Building the developer identity layer. Turn your commits into career assets and showcase your coding journey with style.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                            <li><a href="#hall-of-fame" className="hover:text-blue-400 transition-colors">Hall of Fame</a></li>
                            <li><a href="/dashboard" className="hover:text-blue-400 transition-colors">Create Card</a></li>
                        </ul>
                    </div>
                    {/* Legal Column */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            <li><a href="/refund" className="hover:text-blue-400 transition-colors">Refund Policy</a></li>
                            <li><a href="/shipping" className="hover:text-blue-400 transition-colors">Shipping Policy</a></li>
                            <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    {/* Connect Column */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <SocialLink href="https://github.com/satyam16-ai" icon={<Github className="w-5 h-5" />} />
                            <SocialLink href="https://x.com/Satyam_ai" icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink href="https://www.instagram.com/https.satyam.ai/" icon={<Instagram className="w-5 h-5" />} />
                            <SocialLink href="https://www.linkedin.com/in/satyam--ai/" icon={<Linkedin className="w-5 h-5" />} />
                            <SocialLink href="mailto:satyamtiwariworks@gmail.com" icon={<Mail className="w-5 h-5" />} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2025 DevRecap. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by <a href="#" className="text-slate-300 hover:text-white transition-colors">Satyam</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group"
        >
            <span className="group-hover:scale-110 transition-transform duration-300">
                {icon}
            </span>
        </a>
    )
}
