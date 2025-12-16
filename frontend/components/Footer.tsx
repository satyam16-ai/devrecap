import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 bg-slate-950 border-t border-slate-900 mt-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <Logo size={32} showText={true} className="mb-3 justify-center md:justify-start" />
                    <p className="text-slate-500 text-sm max-w-xs">
                        Building the developer identity layer. Turn your commits into career assets.
                    </p>
                </div>

                <div className="flex gap-8 text-sm text-slate-400">
                    <a href="#" className="hover:text-white transition">Privacy</a>
                    <a href="#" className="hover:text-white transition">Terms</a>
                    <a href="#" className="hover:text-white transition">Twitter</a>
                </div>

                <div className="text-xs text-slate-600">
                    © 2025 DevRecap.site
                </div>
            </div>
        </footer>
    );
}
