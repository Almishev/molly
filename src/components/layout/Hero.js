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
        <p className="my-6 text-white text-sm">
          Гиросът е липсващото парче, което прави всеки ден завършен, малка, но вкусна радост в живота
        </p>
        <div className="flex gap-4 text-sm">
          <Link href="/menu" className="bg-[#4169E1] uppercase items-center gap-2 text-white px-4 py-2 rounded-full inline-flex hover:bg-[#3a5ecc]">
            Направи поръчка
            <Right />
          </Link>
          <Link href="/#about" className="items-center border-0 gap-2 py-2 text-primary font-semibold inline-flex hover:text-[#e6cb30] transition-colors">
            Научи повече
            <Right />
          </Link>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image 
          src={'/giros.jpg'} 
          fill={true}
          className="object-contain"
          alt={'giros'} 
        />
      </div>
    </section>
  );
}