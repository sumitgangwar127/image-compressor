import Footer from "../components/Footer";
import Header from "../components/Header";

export default function PrivacyPolicy() {
    return (
        <div className="app-root">

            <Header />
            <main className="container">
                <section className="card">
                    <h1 className="section-title">Privacy Policy</h1>
                    <p>
                        <strong>My Utility Tools</strong> respects your privacy. We do not
                        collect personal information unless you voluntarily provide it
                        (e.g., email for contact).
                    </p>
                    <p>
                        We do not share your data with third parties. Any cookies or
                        analytics used are strictly for improving site performance.
                    </p>
                    <p>
                        By using our tools, you consent to this privacy policy. We may
                        update it from time to time.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
}
