import { useTheme } from '@/contexts/theme.context'
import { useSettings } from '@/contexts/settings.context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, ArrowLeft, ArrowRight, Moon, Sun } from 'lucide-react'

const themeOptions = [
  {
    value: 'custard' as const,
    name: 'Custard Light',
    description: 'Light custard theme with soft colors',
    icon: Sun,
  },
  {
    value: 'midnight' as const,
    name: 'Midnight Dark',
    description: 'Dark theme with midnight colors',
    icon: Moon,
  },
] as const

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { sidebarPosition, setSidebarPosition } = useSettings()

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold type-header">Settings</h1>
          <p className="type-secondary">Customize your workspace appearance</p>
        </div>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Theme</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred color scheme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon
              return (
                <div
                  key={option.value}
                  className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${theme === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80'
                    }`}
                  onClick={() => setTheme(option.value)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-background">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {theme === option.value && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Sidebar Position
          </CardTitle>
          <CardDescription>
            Choose which side the sidebar should appear on
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={sidebarPosition === 'left' ? 'default' : 'outline'}
              onClick={() => setSidebarPosition('left')}
              className="h-auto p-4 flex flex-col gap-2"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Left Sidebar</span>
            </Button>
            <Button
              variant={sidebarPosition === 'right' ? 'default' : 'outline'}
              onClick={() => setSidebarPosition('right')}
              className="h-auto p-4 flex flex-col gap-2"
            >
              <ArrowRight className="h-6 w-6" />
              <span>Right Sidebar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}