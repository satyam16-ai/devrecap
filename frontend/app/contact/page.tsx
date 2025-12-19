import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden flex flex-col">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex-1 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Contact Us
                </h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="mb-6">If you have any questions, issues, or concerns regarding DevRecap or its services, you can contact us at:</p>

                    <div className="mb-6 p-6 bg-slate-900 rounded-lg border border-slate-800">
                        <p className="mb-2"><strong className="text-white">Email:</strong> <a href="mailto:support@devrecap.site" className="text-blue-400 hover:underline">support@devrecap.site</a></p>
                        <p><strong className="text-white">Website:</strong> <a href="https://devrecap.site" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://devrecap.site</a></p>
                    </div>

                    <p className="mb-6">We aim to respond to all queries within a reasonable timeframe.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
