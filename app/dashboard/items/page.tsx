'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Package, Search } from 'lucide-react'
import { CreateItemInput } from '@/types/item'
import { PageProvider } from '../providers'

interface Item {
  id: string
  name: string
  displayName: string
  sku: string | null
  unit: string | null
  taxPercent: string | null
  defaultCostPrice: string | null
  sellingPrice: string | null
  wholesalePrice1: string | null
  wholesalePrice2: string | null
  warrantyMonths: number | null
  freightIncluded: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState<CreateItemInput>({
    name: '',
    displayName: '',
    sku: '',
    unit: '',
    taxPercent: undefined,
    defaultCostPrice: undefined,
    sellingPrice: undefined,
    wholesalePrice1: undefined,
    wholesalePrice2: undefined,
    warrantyMonths: undefined,
    freightIncluded: false,
  })

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const url = search
        ? `/api/items?search=${encodeURIComponent(search)}`
        : '/api/items'
      const response = await fetch(url)
      const result = await response.json()
      if (result.success) {
        setItems(result.data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sku: formData.sku || undefined,
          unit: formData.unit || undefined,
          taxPercent: formData.taxPercent || undefined,
          defaultCostPrice: formData.defaultCostPrice || undefined,
          sellingPrice: formData.sellingPrice || undefined,
          wholesalePrice1: formData.wholesalePrice1 || undefined,
          wholesalePrice2: formData.wholesalePrice2 || undefined,
          warrantyMonths: formData.warrantyMonths || undefined,
        }),
      })
      const result = await response.json()
      if (result.success) {
        setOpen(false)
        setFormData({
          name: '',
          displayName: '',
          sku: '',
          unit: '',
          taxPercent: undefined,
          defaultCostPrice: undefined,
          sellingPrice: undefined,
          wholesalePrice1: undefined,
          wholesalePrice2: undefined,
          warrantyMonths: undefined,
          freightIncluded: false,
        })
        fetchItems()
      } else {
        alert(result.error?.message || 'Failed to create item')
      }
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Failed to create item')
    }
  }

  const pageActions = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <DialogDescription>Add a new item to your catalog</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name (Internal) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name (Customer) *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="pcs, kg, box, etc."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taxPercent">Tax %</Label>
                <Input
                  id="taxPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.taxPercent || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxPercent: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultCostPrice">Default Cost Price</Label>
                  <Input
                    id="defaultCostPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.defaultCostPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defaultCostPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sellingPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sellingPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wholesalePrice1">Wholesale Price 1</Label>
                  <Input
                    id="wholesalePrice1"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.wholesalePrice1 || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wholesalePrice1: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="wholesalePrice2">Wholesale Price 2</Label>
                  <Input
                    id="wholesalePrice2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.wholesalePrice2 || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wholesalePrice2: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warrantyMonths">Warranty (Months)</Label>
                  <Input
                    id="warrantyMonths"
                    type="number"
                    min="0"
                    value={formData.warrantyMonths || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warrantyMonths: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="freightIncluded"
                      checked={formData.freightIncluded}
                      onChange={(e) =>
                        setFormData({ ...formData, freightIncluded: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="freightIncluded">Freight Included</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
  )

  return (
    <PageProvider
      pageTitle="Items"
      pageDescription="Manage your product catalog"
      pageActions={pageActions}
      showSearch={false}
    >
      <div className="pt-16">
        <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items by name, display name, or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Items</CardTitle>
          <CardDescription>List of all items in your catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No items found. Create your first item to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Tax %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.displayName}</TableCell>
                    <TableCell>{item.sku || '-'}</TableCell>
                    <TableCell>{item.unit || '-'}</TableCell>
                    <TableCell>
                      {item.sellingPrice ? `₹${parseFloat(item.sellingPrice).toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>{item.taxPercent ? `${item.taxPercent}%` : '-'}</TableCell>
                    <TableCell>
                      <span className={item.isActive ? 'text-blue-600' : 'text-gray-500'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </PageProvider>
  )
}






