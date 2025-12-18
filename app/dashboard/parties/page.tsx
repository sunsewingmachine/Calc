'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Users } from 'lucide-react'
import { CreatePartyInput } from '@/types/party'
import { PageProvider } from '../providers'

interface Party {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  taxNumber: string | null
  taxType: string | null
  partyTypes: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreatePartyInput>({
    name: '',
    phone: '',
    email: '',
    address: '',
    taxNumber: '',
    taxType: undefined,
    partyTypes: [],
  })
  const [selectedPartyType, setSelectedPartyType] = useState<string>('')

  useEffect(() => {
    fetchParties()
  }, [])

  const fetchParties = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/parties')
      const result = await response.json()
      if (result.success) {
        setParties(result.data)
      }
    } catch (error) {
      console.error('Error fetching parties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPartyType = () => {
    if (selectedPartyType && !formData.partyTypes.includes(selectedPartyType as any)) {
      setFormData({
        ...formData,
        partyTypes: [...formData.partyTypes, selectedPartyType as any],
      })
      setSelectedPartyType('')
    }
  }

  const handleRemovePartyType = (type: string) => {
    setFormData({
      ...formData,
      partyTypes: formData.partyTypes.filter((t) => t !== type),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.partyTypes.length === 0) {
      alert('Please select at least one party type')
      return
    }
    try {
      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          address: formData.address || undefined,
          taxNumber: formData.taxNumber || undefined,
          taxType: formData.taxType || undefined,
        }),
      })
      const result = await response.json()
      if (result.success) {
        setOpen(false)
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          taxNumber: '',
          taxType: undefined,
          partyTypes: [],
        })
        fetchParties()
      } else {
        alert(result.error?.message || 'Failed to create party')
      }
    } catch (error) {
      console.error('Error creating party:', error)
      alert('Failed to create party')
    }
  }

  const pageActions = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Party
        </Button>
      </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Party</DialogTitle>
              <DialogDescription>Add a new party (supplier, customer, employee, or general)</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="taxType">Tax Type</Label>
                  <Select
                    value={formData.taxType || ''}
                    onValueChange={(value) => setFormData({ ...formData, taxType: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gst">GST</SelectItem>
                      <SelectItem value="vat">VAT</SelectItem>
                      <SelectItem value="unregistered">Unregistered</SelectItem>
                      <SelectItem value="composite">Composite</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Party Types *</Label>
                <div className="flex gap-2 mt-2">
                  <Select value={selectedPartyType} onValueChange={setSelectedPartyType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select party type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddPartyType} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.partyTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.partyTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                      >
                        {type}
                        <button
                          type="button"
                          onClick={() => handleRemovePartyType(type)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
      pageTitle="Parties"
      pageDescription="Manage suppliers, customers, employees, and general parties"
      pageActions={pageActions}
    >
      <div className="pt-16">
        <Card>
        <CardHeader>
          <CardTitle>All Parties</CardTitle>
          <CardDescription>List of all parties in your system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : parties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No parties found. Create your first party to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Party Types</TableHead>
                  <TableHead>Tax Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parties.map((party) => (
                  <TableRow key={party.id}>
                    <TableCell className="font-medium">{party.name}</TableCell>
                    <TableCell>{party.phone || '-'}</TableCell>
                    <TableCell>{party.email || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {party.partyTypes.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{party.taxNumber || '-'}</TableCell>
                    <TableCell>
                      <span className={party.isActive ? 'text-blue-600' : 'text-gray-500'}>
                        {party.isActive ? 'Active' : 'Inactive'}
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



