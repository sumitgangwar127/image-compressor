import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Terms() {
    return (
        <div className="app-root">
            <Header />
            <main className="container">
                <section className="card">
                    <h1 className="section-title">Terms of Service</h1>
                    <p>
                        By using <strong>My Utility Tools</strong>, you agree to our terms
                        and conditions. These tools are provided as-is without any warranties.
                    </p>
                    <p>
                        You may use the tools for personal and non-commercial purposes.
                        We reserve the right to update or discontinue any tool at any time.
                    </p>
                    <p>
                        Unauthorized redistribution, modification, or commercial use is
                        strictly prohibited.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
}
