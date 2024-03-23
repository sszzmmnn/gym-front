import { useLoaderData, Link } from "react-router-dom"
import axios from "../api/axios";

export const Coaches = () => {
  const coaches: { id: string, name: string }[] = useLoaderData() as { id:string, name: string }[];
  console.log(coaches);

  return (
    <div className="coaches">
      <h3>Coaches</h3>
      {coaches && 
        coaches.map((coach, i) => (
          <p key={i}>
              <b>{coach.name}</b>
              <Link to={coach.id}>See Info</Link>
          </p>
        ))
      }
    </div>
  )
}

export const coachesLoader = async () => {
  const res = await axios.get('/coach');
  return res.data;
}