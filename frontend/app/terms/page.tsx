import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden flex flex-col">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex-1 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Terms and Conditions
                </h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="mb-6">By accessing and using DevRecap, you agree to these Terms and Conditions.</p>

                    <p className="mb-6">DevRecap provides digital services that generate visual recap cards based on publicly available developer activity. Free and premium features may vary.</p>

                    <p className="mb-6">Premium purchases grant access to a single premium recap card per successful payment. Sharing, reselling, or attempting to bypass payment restrictions is not allowed.</p>

                    <p className="mb-6">DevRecap is provided “as is” without guarantees of uninterrupted availability or accuracy of third-party data sources.</p>

                    <p className="mb-6">We reserve the right to modify or discontinue any part of the service without prior notice.</p>

                    <p className="mb-6">Use of this website signifies your acceptance of these terms.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
