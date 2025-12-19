import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden flex flex-col">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex-1 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="mb-6">DevRecap respects your privacy.</p>

                    <p className="mb-6">We only collect the minimum information required to provide our services. This may include your name, email address, and authentication details when you sign in using Google or GitHub. We do not store your GitHub access tokens permanently.</p>

                    <p className="mb-6">Payment processing is handled securely by third-party payment gateways. DevRecap does not store your card or payment details.</p>

                    <p className="mb-6">We may temporarily process GitHub public data to generate your recap card. This data is not sold, shared, or used for advertising.</p>

                    <p className="mb-6">By using DevRecap, you agree to this Privacy Policy. We may update this policy from time to time.</p>

                    <p className="mb-6">If you have any questions, contact us using the details provided on the Contact Us page.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
