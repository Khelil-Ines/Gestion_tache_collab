
import Dashboard from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import "@/css/style.css";



export default function UserDashboard() {
  return  (
    <>
      <DefaultLayout>
      <Dashboard />
      </DefaultLayout>
    </>
  );
}