// ProductsTable.js
import ProductRow from './ProductRow';
import TableHeader from './TableHeader';
import { useParams } from 'react-router-dom';

const ProductsTable = ({ products, onDelete, loadingStatus, totalCount }) => {
    const { websiteId } = useParams();
    
    if (loadingStatus === "loading") {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <TableHeader />
                    <div className="px-6 py-8 text-center text-gray-500 min-w-[800px]">
                        در حال دریافت محصولات...
                    </div>
                </div>
            </div>
        );
    }
    
    if (loadingStatus === "error") {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <TableHeader />
                    <div className="px-6 py-8 text-center text-red-500 min-w-[800px]">
                        خطا در دریافت محصولات! لطفاً دوباره تلاش کنید.
                    </div>
                </div>
            </div>
        );
    }
    
    if (products.length === 0 && totalCount > 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <TableHeader />
                    <div className="px-6 py-8 text-center text-gray-500 min-w-[800px]">
                        نتیجه‌ای برای جستجوی شما یافت نشد.
                    </div>
                </div>
            </div>
        );
    }
    
    if (products.length === 0 && totalCount === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <TableHeader />
                    <div className="px-6 py-8 text-center text-gray-500 min-w-[800px]">
                        هنوز هیچ محصولی ثبت نشده است.
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <TableHeader />
                <div className="divide-y divide-gray-200 min-w-[800px]">
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
        </div>
    );
};

export default ProductsTable;