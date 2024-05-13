// import { BRAND } from "@/types/brand";
// import Image from "next/image";

// const brandData: BRAND[] = [
//   {
//     logo: "/images/brand/brand-01.svg",
//     name: "Google",
//     visitors: 3.5,
//     revenues: "5,768",
//     sales: 590,
//     conversion: 4.8,
//   },
//   {
//     logo: "/images/brand/brand-02.svg",
//     name: "Twitter",
//     visitors: 2.2,
//     revenues: "4,635",
//     sales: 467,
//     conversion: 4.3,
//   },
//   {
//     logo: "/images/brand/brand-03.svg",
//     name: "Github",
//     visitors: 2.1,
//     revenues: "4,290",
//     sales: 420,
//     conversion: 3.7,
//   },
//   {
//     logo: "/images/brand/brand-04.svg",
//     name: "Vimeo",
//     visitors: 1.5,
//     revenues: "3,580",
//     sales: 389,
//     conversion: 2.5,
//   },
//   {
//     logo: "/images/brand/brand-05.svg",
//     name: "Facebook",
//     visitors: 3.5,
//     revenues: "6,768",
//     sales: 390,
//     conversion: 4.2,
//   },
// ];

// const TableOne = () => {
//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
//         Top Channels
//       </h4>

//       <div className="flex flex-col">
//         <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
//           <div className="p-2.5 xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Source
//             </h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Visitors
//             </h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Revenues
//             </h5>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Sales
//             </h5>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Conversion
//             </h5>
//           </div>
//         </div>

//         {brandData.map((brand, key) => (
//           <div
//             className={`grid grid-cols-3 sm:grid-cols-5 ${
//               key === brandData.length - 1
//                 ? ""
//                 : "border-b border-stroke dark:border-strokedark"
//             }`}
//             key={key}
//           >
//             <div className="flex items-center gap-3 p-2.5 xl:p-5">
//               <div className="flex-shrink-0">
//                 <Image src={brand.logo} alt="Brand" width={48} height={48} />
//               </div>
//               <p className="hidden text-black dark:text-white sm:block">
//                 {brand.name}
//               </p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-black dark:text-white">{brand.visitors}K</p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-meta-3">${brand.revenues}</p>
//             </div>

//             <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
//               <p className="text-black dark:text-white">{brand.sales}</p>
//             </div>

//             <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
//               <p className="text-meta-5">{brand.conversion}%</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TableOne;
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const TableOne = () => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.accessToken) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/projects', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        setProjects(response.data.projects); // Assuming the response structure includes { projects: [] }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, [session?.accessToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">My Projects</h4>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left leading-4 text-blue-500 tracking-wider">Name</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left leading-4 text-blue-500 tracking-wider">State</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left leading-4 text-blue-500 tracking-wider">Completion</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{project.nom}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{project.etat}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{project.completion}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableOne;

