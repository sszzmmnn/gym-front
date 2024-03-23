import { useState, useEffect } from 'react';
import useAxiosIntercept from '../hooks/useAxiosIntercept';
import { AxiosError } from 'axios';
import { IPass as SomeData } from '../types/types';

import FeaturedPass from '../components/FeaturedPass';
import PassesList from '../components/PassesList';

const Tickets = () => {
  const axiosIntercept = useAxiosIntercept();

  const [someData, setSomeData] = useState<SomeData[] | null>(null);
  const [featured, setFeatured] = useState<SomeData[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axiosIntercept.get('/pass');
        setSomeData(res.data);
        setFeatured(res.data.filter((pass: SomeData) => pass.featured === true));
      } catch(err) {
        if(err instanceof AxiosError) {
          console.log(err.response?.data?.error);
        }
        console.log(err);
      }
    }

    getData();
  }, [])

  return (
    <>
      {featured && 
      <div className="passes featured">
        <b>Featured Passes</b>
        {featured.map((item, index) => (
          <FeaturedPass key={index} featured={item} />
        ))}
      </div>
      }
      { someData && <PassesList passes={someData} /> }
    </>
  )
}

export default Tickets