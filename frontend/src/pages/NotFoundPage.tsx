import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { FileQuestion } from "lucide-react"

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-4">
            <div className="bg-muted p-4 rounded-full">
                <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <p className="text-muted-foreground">Page not found</p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline">
                Go back home
            </Button>
        </div>
    )
}
