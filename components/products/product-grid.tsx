'use client'

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const products = [
  { id: 1, name: "Product 1", description: "Description for Product 1", price: 19.99 },
  { id: 2, name: "Product 2", description: "Description for Product 2", price: 29.99 },
  { id: 3, name: "Product 3", description: "Description for Product 3", price: 39.99 },
  { id: 4, name: "Product 4", description: "Description for Product 4", price: 59.99 },
]

export function ProductGrid() {
  const [cart, setCart] = useState<number[]>([])

  const addToCart = (productId: number) => {
    setCart([...cart, productId])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{product.description}</p>
            <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => addToCart(product.id)}>Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

