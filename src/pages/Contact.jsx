import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Contact() {
    return (
        <div className="app-root">
            <Header />
            <main className="container">
                <section className="card">
                    <h1 className="section-title">Contact Us</h1>
                    <p>
                        Have questions or feedback? We'd love to hear from you!
                    </p>
                    <ul>
                        <li>Email: <a href="mailto:support@myutilitytools.com">support@myutilitytools.com</a></li>
                        <li>Twitter: <a href="https://twitter.com/myutilitytools">@myutilitytools</a></li>
                    </ul>
                    <p>
                        We'll do our best to respond within 24–48 hours.
                    </p>
                </section>
            </main>
            <Footer />
        </div>

    );
}
