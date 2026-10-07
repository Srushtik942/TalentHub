import { createContext, useContext, useState } from "react";

const SavedJobsContext = createContext(null);

export function SavedJobsProvider({children}){
    const [savedIds, setSavedIds] = useState([]);

    const isSaved =(id)=> savedIds.includes(id)

    const toggleSaved = async(jobId) =>{
        try{
            const token = localStorage.getItem('token');

            const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/applicant/jobs/${jobId}/bookmark`,
        {
             method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
        }
    )
    const data = await response.json().catch(()=> ({}))

    if(!response.ok) throw new Error(data?.message || "Failed to save job")

        setSavedIds((current)=>
        current.includes(jobId) ? current.filter((id)=> id !== jobId) : [...current, jobId]
    )
    }catch(error){
            console.error(error);
        }
    }
      return (
    <SavedJobsContext.Provider value={{ savedIds, setSavedIds, isSaved, toggleSaved }}>
      {children}
    </SavedJobsContext.Provider>
  )
}

export function useSavedJobs() {
  return useContext(SavedJobsContext)

}