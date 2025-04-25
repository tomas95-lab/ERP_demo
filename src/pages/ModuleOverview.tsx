import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { BadgeDollarSign, FileText, Users, Settings, FolderKanban, Building2, ScrollText, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const moduleData = {
  financials: {
    icon: BadgeDollarSign,
    description: "Manage your financial operations, track expenses and handle invoices efficiently.",
    color: "text-green-500",
    routes: [
      { 
        title: "Expenses", 
        path: "/financials/expenses", 
        description: "Track and manage all expenses",
        icon: BarChart3,
        badge: "Active"
      },
      { 
        title: "Invoices", 
        path: "/financials/invoices", 
        description: "Handle customer invoices and payments",
        icon: FileText,
        badge: "New"
      }
    ]
  },
  projects: {
    icon: FolderKanban,
    description: "Overview of all your projects and their current status.",
    color: "text-blue-500",
    routes: [
      { 
        title: "All Projects", 
        path: "/projects/all", 
        description: "View and manage project portfolio",
        icon: ScrollText,
        badge: "Active"
      }
    ]
  },
  suppliers: {
    icon: Building2,
    description: "Manage your supplier relationships and orders in one place.",
    color: "text-purple-500",
    routes: [
      { 
        title: "All Suppliers", 
        path: "/suppliers/all", 
        description: "Complete supplier directory",
        icon: Users,
        badge: "Updated"
      },
      { 
        title: "Purchase Orders", 
        path: "/suppliers/orders", 
        description: "Track and manage orders",
        icon: ScrollText,
        badge: "Active"
      }
    ]
  },
  settings: {
    icon: Settings,
    description: "Configure system settings and manage user access.",
    color: "text-orange-500",
    routes: [
      { 
        title: "General Settings", 
        path: "/settings/general", 
        description: "System configuration options",
        icon: Settings
      },
      { 
        title: "User Management", 
        path: "/settings/users", 
        description: "Manage user permissions",
        icon: Users,
        badge: "Admin"
      }
    ]
  }
}

export default function ModuleOverview() {
  const location = useLocation()
  const currentModule = location.pathname.split('/')[1]
  const module = moduleData[currentModule as keyof typeof moduleData]
  
  if (!module) return null

  const ModuleIcon = module.icon

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <ModuleIcon className={`h-10 w-10 ${module.color}`} />
        <div>
          <h1 className="text-4xl font-bold capitalize">{currentModule}</h1>
          <p className="text-muted-foreground mt-1">{module.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {module.routes.map((route, index) => {
          const Icon = route.icon
          return (
            <motion.div
              key={route.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={route.path}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                          <Icon className={`h-5 w-5 ${module.color}`} />
                        </div>
                        <CardTitle>{route.title}</CardTitle>
                      </div>
                      {route.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {route.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{route.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
