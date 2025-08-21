import Footer from "../components/Footer";
import Header from "../components/Header";

export default function About() {
  return (
    <div className="app-root">
      <Header/>
    <main className="container">
      <section className="card">
        <h1 className="section-title">About Us</h1>
        <p>
          Welcome to <strong>My Utility Tools</strong>! We provide a suite of
          handy web tools to help you resize, compress, and convert images,
          all in one place. Our goal is to make digital tasks easier, faster,
          and more efficient.
        </p>
        <p>
          Whether you’re a designer, developer, or just someone who wants to
          optimize images quickly, our tools are simple, reliable, and free
          to use.
        </p>
      </section>
    </main>
    <Footer/>
    </div>
  );
}
