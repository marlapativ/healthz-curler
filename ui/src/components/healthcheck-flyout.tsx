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
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from './ui/form'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type HealthCheckFlyoutProps = {
  healthcheck?: HealthCheck
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function HealthCheckFlyout({ children, open, onOpenChange, healthcheck }: HealthCheckFlyoutProps) {
  const form = useForm<HealthCheck>({
    values: healthcheck,
    mode: 'onChange'
  })

  function save(data: HealthCheck) {
    data.active = Boolean(data.active)
    console.log(data)
    onOpenChange?.(false)
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
          <div className="py-2 flex">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(save)} className="space-y-8 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="w-[50%]">
                        <FormLabel>Active</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value ? 'true' : 'false'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select active status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select active status</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="w-[50%]">
                        <FormLabel>Active</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value ? 'true' : 'false'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select active status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select active status</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
