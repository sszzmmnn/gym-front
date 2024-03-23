import { useLoaderData } from 'react-router-dom'
import axios from '../api/axios';

interface ICoach {
  name: string,
  email: string,
  phone: string
}

export const CoachDetails = () => {
  const coach: ICoach = useLoaderData() as ICoach;

  return (
    <div className="coach-details">
      <h3>{coach.name}: Details</h3>
      <p>Full Name: {coach.name}</p>
      <p>E-mail: {coach.email}</p>
      <p>Phone number: {coach.phone || 'Not provided'}</p>
    </div>
  )
}

export const coachDetailsLoader = async ({ params }: { params: any }) => {
  const { id }: { id: string } = params;

  const res = await axios.get('/coach/' + id);

  return res.data;
}