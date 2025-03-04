"use client";
import {signIn} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {'Content-Type': 'application/json'},
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setUserCreated(true);
      toast.success('Registration successful! Logging you in...');
      
      // Автоматический вход после успешной регистрации
      await signIn('credentials', {
        email, 
        password,
        callbackUrl: '/'
      });
    } else {
      setError(data.error || 'Error creating user');
      toast.error(data.error || 'Error creating user');
    }
    setCreatingUser(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Регистрация
      </h1>
      {userCreated && (
        <div className="my-4 text-center">
          User created.<br />
          Now you can{' '}
          <Link className="underline" href={'/login'}>Вход &raquo;</Link>
        </div>
      )}
      {error && (
        <div className="my-4 text-center text-red-500">
          {error}
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" placeholder="email" value={email}
               disabled={creatingUser}
               onChange={ev => setEmail(ev.target.value)} />
        <input type="password" placeholder="password" value={password}
               disabled={creatingUser}
               onChange={ev => setPassword(ev.target.value)}/>
        <button type="submit" disabled={creatingUser}>
          Регистрация
        </button>
        <div className="my-4 text-center text-gray-500">
          или влезте с
        </div>
        <button type="button"
          onClick={() => signIn('google', {callbackUrl:'/'})}
          className="flex gap-4 justify-center">
          <Image src={'/google.png'} alt={''} width={24} height={24} />
          Вход с Google
        </button>
        <button type="button"
          onClick={() => signIn('facebook', {callbackUrl:'/'})}
          className="flex gap-4 justify-center mt-2">
          <Image src={'/facebook.png'} alt={''} width={24} height={24} />
          Вход с Facebook
        </button>
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Имате ли регистрация?{' '}
          <Link className="underline" href={'/login'}>Вход &raquo;</Link>
        </div>
      </form>
    </section>
  );
}