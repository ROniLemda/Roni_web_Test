"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { deleteProject } from "@/app/actions/projects" // Import the server action

interface DeleteProjectButtonProps {
  projectId: string
  projectName: string
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleDelete = async () => {
    setIsLoading(true)
    setMessage("")
    const result = await deleteProject(projectId)
    if (result.success) {
      setMessage(result.message)
      // Optionally, you might want to refresh the list or remove the item from state
    } else {
      setMessage(result.message)
    }
    setIsLoading(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isLoading}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">מחק פרויקט</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
          <AlertDialogDescription>
            פעולה זו תמחק לצמיתות את הפרויקט &quot;{projectName}&quot;. לא ניתן לבטל פעולה זו.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>ביטול</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? "מוחק..." : "מחק"}
          </AlertDialogAction>
        </AlertDialogFooter>
        {message && <p className="text-center text-sm mt-2 text-red-500">{message}</p>}
      </AlertDialogContent>
    </AlertDialog>
  )
}
