import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div>
        <h3>Not Found</h3>
        The page you are looking for does not exist<br/>
        Return to the<Link to='/'>Main Page</Link>
    </div>
  )
}

export default NotFound