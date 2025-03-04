import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Нашата история'}
          mainHeader={'За нас'}
        />
        <div className="text-white max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
          Потопете се в света на &ldquo;Molly&rdquo;, където всяко ястие е създадено с любов и страст. Нашата история започва с желанието да споделим с вас неповторими вкусове и кулинарни изживявания, които ще ви накарат да се усмихнете.
          </p>
          <p>Използваме само най-свежите и качествени продукти, за да гарантираме, че всяка хапка е истинско удоволствие. От класически гирос до иновативни кулинарни шедьоври, нашето меню е създадено, за да задоволи всеки вкус.</p>
          <p>Присъединете се към нашето семейство и се насладете на вкусна храна, уютна атмосфера и незабравими моменти.</p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={'Не се колебайте'}
          mainHeader={'Свържете се с нас'}
        />
        <div className="mt-8">
          <a className="text-4xl underline text-white" href="tel:00359893071717">
            0893071717
          </a>
        </div>
      </section>
    </>
  )
}
