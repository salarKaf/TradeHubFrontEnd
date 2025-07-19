import ProductRow from './ProductRow';
import TableHeader from './TableHeader';
import { useParams } from 'react-router-dom';



const ProductsTable = ({ products, onDelete, loadingStatus, totalCount }) => {

    const { websiteId } = useParams();

    if (loadingStatus === "loading") {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader />
                <div className="px-6 py-8 text-center text-gray-500">
                    در حال دریافت محصولات...
                </div>
            </div>
        );
    }

    if (loadingStatus === "error") {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader />
                <div className="px-6 py-8 text-center text-red-500">
                    خطا در دریافت محصولات! لطفاً دوباره تلاش کنید.
                </div>
            </div>
        );
    }

    if (products.length === 0 && totalCount > 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader />
                <div className="px-6 py-8 text-center text-gray-500">
                    نتیجه‌ای برای جستجوی شما یافت نشد.
                </div>
            </div>
        );
    }

    if (products.length === 0 && totalCount === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader />
                <div className="px-6 py-8 text-center text-gray-500">
                    هنوز هیچ محصولی ثبت نشده است.
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
                        websiteId={websiteId}
                    />

                ))}
            </div>
        </div>
    );
};

export default ProductsTable;
