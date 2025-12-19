import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden flex flex-col">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex-1 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Cancellation and Refund Policy
                </h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="mb-6">DevRecap offers digital, non-tangible products.</p>

                    <p className="mb-6">Once a premium recap card has been generated or downloaded, the purchase is considered complete and non-refundable.</p>

                    <p className="mb-6">If a payment is successful but the premium card cannot be generated due to a technical issue, users may contact us for support. In such cases, we may provide a retry or issue a refund at our discretion.</p>

                    <p className="mb-6">Cancellations are not applicable once the service has been delivered.</p>

                    <p className="mb-6">For any refund-related queries, please contact us.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
