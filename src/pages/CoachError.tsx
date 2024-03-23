import { useRouteError } from "react-router-dom";
import { AxiosError } from "axios";

const CoachError = () => {
    const error: AxiosError | Error = useRouteError() as AxiosError | Error;
  return (
    <div className="coach-error">
        <h3>Something went wrong!</h3>
        <p>{error instanceof AxiosError && error.response?.data && error.response.data.error}</p>
        We failed to fetch data for coaches. Sorry about that. Please try again later.
    </div>
  )
}

export default CoachError