import Footer from './components/Footer';
import Header from './components/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-black w-full h-screen center flex flex-col">
            <Header />
            <div className="bg-gray-200 flex-1 flex flex-col">
                <main className="main">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
