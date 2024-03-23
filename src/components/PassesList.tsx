import { useNavigate, createSearchParams } from 'react-router-dom';
import { IPass } from '../types/types';

interface Props {
  passes: IPass[]
}

const PassesList = (props: Props) => {
  const navigate = useNavigate();
  const passes = props.passes;

  const Checkout = (id: string) => {
    const params = {passId: id};
    navigate({
      pathname: '/checkout',
      search: `?${createSearchParams(params)}`
    })
  }

  return (
    <div className='passes list'>
      <b>Passes List</b>
      <table>
        <thead>
          <tr>
            <th>Pass Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
        { passes && passes.map((item, index) => (
          <tr key={index}>
            <td>{ item.name }</td>
            <td className='pass-button'>
              <button onClick={() => Checkout(item._id)}>{ `${ (item.price / 100).toFixed(2) }` }</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default PassesList