
import Hero from "../components/Hero";
import About from "../components/About";
import Speakers from "../components/Speakers"
import Agenda from "../components/Agenda"
import Seminar from "../components/Seminar"
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import Registration from "../components/Registration";
import Chat from "../components/Chat"
// import Webinar from "../components/Webinar";
// import Registration from "../components/Registration";

const Home = () => {
  return (
    <div id="home">
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <section id="speakers"><Speakers /></section>
      <section id="agenda"><Agenda /></section>
      <section id="seminar"><Seminar /></section>
      <section id="faq"><Faq /></section>
      <section id="contact"><Contact /></section>
      <section id="registation"><Registration /></section>
      <section id="chat"><Chat /></section>




      {/* <section id="webinar"><Webinar /></section>
      <section id="registration"><Registration /></section> */}
    </div>
  );
};

export default Home;
