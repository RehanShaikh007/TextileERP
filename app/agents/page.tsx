"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Eye, Edit, Loader2, AlertTriangle, CheckCircle, Factory, User } from "lucide-react"
import Link from "next/link"

// Agent backend schema
interface Agent {
  _id: string
  agentId: string
  name: string
  factory: string
  createdAt: string
  updatedAt: string
}

interface AgentFormData {
  name: string
  factory: string
}

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add agent dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addingAgent, setAddingAgent] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)

  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    factory: "",
  })

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:4000/api/v1/agent")
        if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`)
        const data = await res.json()
        if (data.success) {
          setAgents(data.agents || [])
        } else {
          throw new Error(data.message || "Failed to fetch agents")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch agents")
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  // Handle add agent form change
  const handleInputChange = (field: keyof AgentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle add agent submission
  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingAgent(true)
    setAddError(null)
    setAddSuccess(false)

    try {
      if (!formData.name || !formData.factory) {
        throw new Error("All fields are required")
      }

      const payload = {
        name: formData.name,
        factory: formData.factory,
      }

      const res = await fetch("http://localhost:4000/api/v1/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || "Failed to add agent")
      }

      setAddSuccess(true)
      // refresh agent list
      const refreshRes = await fetch("http://localhost:4000/api/v1/agent")
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json()
        if (refreshData.success) setAgents(refreshData.agents || [])
      }

      // reset & close dialog
      setFormData({ name: "", factory: "" })
      setTimeout(() => {
        setIsAddDialogOpen(false)
        setAddSuccess(false)
      }, 1500)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add agent")
    } finally {
      setAddingAgent(false)
    }
  }

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.factory.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Agents</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading agents...
        </div>
      </SidebarInset>
    )
  }

  if (error) {
    return (
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Agents</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Agents</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Agents</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Agent</DialogTitle>
                <DialogDescription>Create an agent record</DialogDescription>
              </DialogHeader>

              {addSuccess && (
                <div className="bg-green-50 p-3 rounded text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Agent added successfully
                </div>
              )}
              {addError && (
                <div className="bg-red-50 p-3 rounded text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {addError}
                </div>
              )}

              <form onSubmit={handleAddAgent} className="space-y-3">
                <div>
                  <Label>Name *</Label>
                  <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                </div>
                <div>
                  <Label>Factory *</Label>
                  <Input value={formData.factory} onChange={(e) => handleInputChange("factory", e.target.value)} />
                </div>
                <Button type="submit" disabled={addingAgent} className="w-full">
                  {addingAgent ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding...</> : "Add Agent"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Agents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Agent List</CardTitle>
            <CardDescription>All registered agents</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Agent ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Factory</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      No agents found
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent) => (
                    <tr key={agent._id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{agent.agentId}</td>
                      <td className="p-3 flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" /> {agent.name}
                      </td>
                      <td className="p-3 flex items-center gap-2">
                        <Factory className="h-4 w-4 text-muted-foreground" /> {agent.factory}
                      </td>
                      <td className="p-3 flex gap-2">
                        <Link href={`/agents/${agent._id}`}>
                          <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        <Link href={`/agents/${agent._id}/edit`}>
                          <Button size="sm"><Edit className="h-4 w-4" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
