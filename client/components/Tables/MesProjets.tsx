"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from 'next/link';  // Import Link from Next.js



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
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left leading-4 text-blue-500 tracking-wider">Tasks</th>

          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{project.nom}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{project.etat}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{project.completion}%</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <Link className="text-blue-500 hover:text-blue-800" href={`/projects/${project._id}/tasks`}>
                 Show Tasks
                </Link>
              </td>          
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableOne;

