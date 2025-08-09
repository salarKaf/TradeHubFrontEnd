import Header from '../Layouts/Header'
import ShowProduct from './InfoProduct';

const ShowProductaPage = () => {
  return (

    <div>

      <Header />

      <div className="flex h-screen ">

        <div className="flex-1 flex ">
          <div className="p-6  bg-[#FAF3E0] flex-1 overflow-auto">
            <ShowProduct></ShowProduct>

          </div>
        </div>
      </div>
    </div>
  );


};


export default ShowProductaPage;




