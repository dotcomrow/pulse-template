import Footer from './footer/Footer';
import Header from './header/Header';
import Nav from './navigation/Nav';

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main className="mb-auto h-80">
                <div>
                    <div>
                        <Nav />
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}