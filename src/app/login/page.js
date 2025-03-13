'use client';
import {signIn, useSession} from "next-auth/react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const router = useRouter();
  const {data: session} = useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace('/');
    }
  }, [session, router]);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);
    console.log('Започва процес на вход...');

    try {
      console.log('Опит за вход с:', { email });
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      console.log('Резултат от вход:', result);
      
      if (result?.error) {
        console.log('Грешка при вход:', result.error);
        toast.error('Грешни данни за вход');
        setLoginInProgress(false);
      } else {
        console.log('Успешен вход, пренасочване...');
        toast.success('Успешен вход!');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Възникна грешка при влизане');
      setLoginInProgress(false);
    }
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Вход
      </h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" name="email" placeholder="email" value={email}
               disabled={loginInProgress}
               onChange={ev => setEmail(ev.target.value)} />
        <input type="password" name="password" placeholder="password" value={password}
               disabled={loginInProgress}
               onChange={ev => setPassword(ev.target.value)}/>
        <button disabled={loginInProgress} type="submit">
          {loginInProgress ? 'Влизане...' : 'Вход'}
        </button>
        <div className="my-4 text-center text-gray-500">
          или влезте с
        </div>
        <button type="button" 
          onClick={() => {
            console.log('Започва вход с Google...');
            signIn('google', {callbackUrl: '/'});
          }}
          className="flex gap-4 justify-center">
          <Image src={'/google.png'} alt={''} width={24} height={24} />
          Вход с Google
        </button>


        <button type="button" 
          onClick={() => {
            console.log('Започва вход с Facebook...');
            signIn('facebook', {
              callbackUrl: '/',
              redirect: true,
            }).catch(error => {
              console.error('Facebook login error:', error);
              toast.error('Грешка при вход с Facebook');
            });
          }}
          className="flex gap-4 justify-center mt-2">
          <Image src={'/facebook.png'} alt={''} width={24} height={24} />
          Вход с Facebook
        </button>
      </form>
    </section>
  );
}