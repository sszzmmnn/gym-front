import { useNavigate, useLocation, createSearchParams } from 'react-router-dom'
import { IPass as Featured } from '../types/types'

interface Props {
  featured: Featured
}

const FeaturedPass = (props: Props) => {
  const navigate = useNavigate();

  const { featured } = props;
  const params = {passId: featured._id};

  const Checkout = () => {
    navigate({
      pathname: '/checkout',
      search: `?${createSearchParams(params)}`
    })
  }

  return (
    <div className='featured-pass'>
      <span>{ props.featured.name }</span>
      <button onClick={() => Checkout()}>{
      `${ (featured.price / 100).toFixed(2) }` 
      }</button>
    </div>
  )
}

export default FeaturedPass