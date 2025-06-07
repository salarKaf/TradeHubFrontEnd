import ProductRow from './ProductRow';
import TableHeader from './TableHeader';




const ProductsTable = ({ products, onDelete }) => {
    if (products.length === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader />
                <div className="px-6 py-8 text-center text-gray-500">
                    محصولی با این نام پیدا نشد
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <TableHeader />
            <div className="divide-y divide-gray-200">
                {products.map((product) => (
                    <ProductRow 
                        key={product.id} 
                        product={product} 
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};7

export default ProductsTable;