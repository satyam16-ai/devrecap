import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden flex flex-col">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex-1 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Shipping and Delivery Policy
                </h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="mb-6">DevRecap does not ship physical products.</p>

                    <p className="mb-6">All premium services and recap cards are delivered digitally through the website after successful payment and authentication.</p>

                    <p className="mb-6">Delivery is typically instant. In rare cases, it may take a short time due to technical or third-party service delays.</p>

                    <p className="mb-6">If you do not receive access to your premium card after payment, please contact us for assistance.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
