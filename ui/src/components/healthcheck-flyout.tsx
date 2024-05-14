import React from 'react'
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
import { HealthCheck } from '../types/healthcheck'
import { Label } from '@radix-ui/react-label'

type HealthCheckFlyoutProps = {
  healthcheck?: HealthCheck
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function HealthCheckFlyout({ children, open, onOpenChange, healthcheck }: HealthCheckFlyoutProps) {
  const [current, setCurrent] = React.useState<HealthCheck | undefined>(healthcheck)

  function save() {
    onOpenChange?.(false)
    setCurrent((prev) => {
      if (prev) {
        return {
          ...prev,
          name: 'Updated Health Check'
        }
      }
      return { name: 'New Health Check', url: '', protocol: 'http', port: 80, id: '1', interval: 10 }
    })
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
            <DialogTitle>{healthcheck ? 'Update ' : 'Add '} Health Check</DialogTitle>
            <DialogDescription>
              {healthcheck ? 'Update ' : 'Add '} health check with your config. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="p-2 flex items-center justify-center">
            <Label>{current?.name}</Label>
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
