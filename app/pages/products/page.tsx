import { ProductGrid } from "@/components/products/product-grid"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ProductGrid />
    </div>
  )
}

