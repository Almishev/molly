import Right from "@/components/icons/Right";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Не е това,<br />
          което си<br />
          <span className="text-blue-600">
            мислиш
          </span>
        </h1>
        <p className="my-6 text-white text-md">
          Гиросът е липсващото парче, което прави всеки ден завършен, малка, но вкусна радост в живота.
          Доставка в град <span className="text-blue-600 font-bold">Гоце Делчев </span>
           и ресторант за бързо хранене в 
           <span className="text-yellow-400 font-bold"> София</span> сърцето на 
            <span className="text-red-600 font-bold" > Студентски град </span>- улица Джон Ленън № 4.
        </p>
        <div className="flex gap-4 text-sm">
          <Link href="/menu" className="bg-yellow-400 uppercase items-center gap-2 text-black px-4 py-2 rounded-full inline-flex hover:bg-yellow-500 hover:text-blue-600 transition-colors">
            Поръчай сега
            <Right />
          </Link>
          <Link href="/#about" className="items-center border-0 gap-2 py-2 text-white font-semibold inline-flex hover:text-yellow-400 transition-colors">
            Научи повече
            <Right />
          </Link>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image 
          src={'/meal.png'} 
          width={400}
          height={300}
          className="object-contain drop-shadow-2xl"
          alt={'Вкусни гироси и дюнери от Molly Food'} 
          priority={true}
        />
      </div>
    </section>
  );
}