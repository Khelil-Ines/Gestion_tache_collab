import Link from 'next/link';

export default async function Home() {


  return (
    <div >
      <h1>Hello !</h1>
      <p>Welcome to TACHETY App.</p>
      <Link href="/login">
      
          <button>Login</button>
      
      </Link>
      </div>
  );
}