import Link from 'next/link';
import DefaultLayout from "@/components/Layouts/simple";
import "@/css/style.css";

export default async function Home() {


  return (
    <DefaultLayout>
   <div >
      <h1>Hello !</h1>
      <p>Welcome to TACHETY App.</p>
      <Link href="/login">
      
          <button>Login</button>
      
      </Link>
      </div>
    </DefaultLayout>
 
  );
}