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
        <div className="text-white max-w-2xl mx-auto mt-4 flex flex-col gap-4">
          <p>
            Добре дошли в GREEK GYROS &ldquo;MOLLY Гоце Делчев&rdquo;  -  Място, от което можете да поръчате автентичен гирос, бургери, салати и десерти. Да се насладите на приятна обстановка и вежлив персонал. Нашата история започва с желанието и упоритостта на двама души,
             които вървят ръка за ръка заедно, както в живота, така и в желанието 
             да пресъздадат продукт от Гърция в родното им място България, а именно в град
              Гоце Делчев. От непрестанния им упорит труд можете да се насладите
               на продукта и в София, Студентски град, улица Джон Ленън 4!
          </p>
          <p>
            Горди сме да ви посрещнем в нашите три обекта в България:
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">София</h3>
              <p className="text-sm">Насладете се на нашите специалитети в сърцето на Студентски град. <br />  ул. Джон Ленън 4</p>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Благоевград</h3>
              <p className="text-sm">Открийте автентичния вкус на гръцката кухня във Вашият град.  <br />  ул. Славянска 83</p>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Гоце Делчев</h3>
              <p className="text-sm">Единственият ни обект с доставка до вашия дом! Поръчайте онлайн или на място. <br />  ул. Серес 17</p>
            </div>
          </div>
          <p>
          Потопете се в света на &ldquo;MOLLY Гоце Делчев&rdquo;, където всяко ястие е създадено с любов и страст. Нашата история започва с желанието да споделим с вас неповторими вкусове и кулинарни изживявания, които ще ви накарат да се усмихнете.
          </p>
          <p>Използваме само най-свежите и качествени продукти, за да гарантираме, че всяка хапка е истинско удоволствие. От класически гирос до иновативни кулинарни шедьоври, нашето меню е създадено, за да задоволи всеки вкус.</p>
          <p>Присъединете се към нашето семейство и се насладете на вкусна храна, уютна атмосфера и незабравими моменти.</p>
        
          <p className="font-semibold text-yellow-400">
            Вече предлагаме доставка в град Гоце Делчев! Поръчайте любимата си храна онлайн и ще я доставим бързо и топла до вашия дом.
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={'Не се колебайте'}
          mainHeader={'Свържете се с нас'}
        />
        <div className="mt-8 flex flex-col items-center gap-4">
          <a className="text-4xl underline text-white hover:text-yellow-400 transition-colors" href="tel:00359893071717">
            0893071717
          </a>
          <p className="text-white">За доставки: 10:00 - 22:00 <br />Работно време на място: 09:00 - 01:00</p>
          <div className="flex gap-4 text-white">
            <a href="viber://chat?number=%2B359893071717" className="hover:text-yellow-400 transition-colors">
              Viber
            </a>
            <span>|</span>
            <a href="https://www.facebook.com/gyros.gotsedelchev.molly" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
              Facebook
            </a>
            <span>|</span>
            <a href="https://www.instagram.com/gyrosgotsedelchevmolly" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
