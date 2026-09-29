import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import FeaturedProjects from "./components/FeaturedProjects";
import WhyCodirung from "./components/WhyCodirung";
import TechnologyUniverse from "./components/TechnologyUniverse";
import ContactFooter from "./components/ContactFooter";
import AdminPanel from "./pages/AdminPanel";

function App() {

  const isAdminRoute = window.location.pathname.startsWith("/admin");

     if (isAdminRoute) {
    return <AdminPanel />;
  }
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main>
        <Hero />

        <Services />

        <FeaturedProjects />

         <WhyCodirung />

         <TechnologyUniverse />

         <ContactFooter />  

      
      </main>
    </div>
  );
}

export default App;