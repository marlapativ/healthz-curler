import React, { useContext } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ConfigContext } from '../context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type ConfigSelectionProps = {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ConfigSelectorFlyout({ children, open, onOpenChange }: ConfigSelectionProps) {
  const { activeConfig, configurations, setConfig } = useContext(ConfigContext)
  const [selectedConfig, setSelectedConfig] = React.useState<string>(activeConfig?.id || '')

  function save() {
    const updatedConfig = configurations.find((config) => config.id === selectedConfig)
    onOpenChange?.(false)
    if (updatedConfig && updatedConfig.id !== activeConfig?.id) {
      setConfig(updatedConfig)
    }
  }

  return (
    <div>
      <Dialog modal open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>Configuration Selection</DialogTitle>
            <DialogDescription>Make changes to your config. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="p-2 flex items-center justify-center">
            <Select
              defaultValue={selectedConfig}
              onValueChange={(value) => {
                setSelectedConfig(value)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select backend" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Backend</SelectLabel>
                  {configurations.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => save()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
