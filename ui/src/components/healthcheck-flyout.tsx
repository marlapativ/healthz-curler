import React, { useEffect } from 'react'
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
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from './ui/form'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ScrollArea } from './ui/scroll-area'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

type HealthCheckFlyoutProps = {
  healthcheck?: HealthCheck
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onHealthCheckSave: (healthcheck: HealthCheck) => Promise<HealthCheck>
}

function FormLabelWrapper({ label, isRequired }: { label: string; isRequired?: boolean }) {
  return (
    <FormLabel className="pl-1">
      {label}
      {isRequired ? <span className="pl-[2px] text-destructive">*</span> : null}
    </FormLabel>
  )
}

const getAuthMode = (healthCheck: HealthCheck | undefined) => {
  const auth = healthCheck?.auth
  if (!auth) return 'none'
  const apiKey = auth?.apiKey
  const username = auth?.username
  return apiKey ? 'apikey' : username ? 'username' : 'none'
}

export function HealthCheckFlyout({
  children,
  open,
  onOpenChange,
  healthcheck,
  onHealthCheckSave
}: HealthCheckFlyoutProps) {
  const [authMode, setAuthMode] = React.useState(getAuthMode(healthcheck))
  const form = useForm<HealthCheck>({
    mode: 'onChange'
  })

  useEffect(() => {
    let newHc = healthcheck
    if (!newHc) {
      newHc = {
        id: '',
        name: '',
        description: '',
        url: '',
        interval: 30000,
        expectedResponseCode: 200,
        timeout: 5000,
        method: 'GET',
        active: true,
        auth: undefined,
        executor: undefined
      }
    }
    form.reset(newHc)
    setAuthMode(() => getAuthMode(healthcheck))
  }, [healthcheck, form])

  function save(data: HealthCheck) {
    // Handle data manipulation
    data.active = Boolean(data.active)

    // Trigger parent save function
    onHealthCheckSave(data)
      .then(() => {
        onOpenChange?.(false)
      })
      .catch((e) => {
        console.error(e)
        // TODO: Show toast
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
          <ScrollArea className="p-2 flex rounded-md border w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(save)} id="healthcheck-form" className="space-y-2 w-full px-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelWrapper label="Name" isRequired />
                      <FormControl>
                        <Input {...field} placeholder="Name" required />
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
                      <FormLabelWrapper label="Description" />
                      <FormControl>
                        <Input {...field} placeholder="Description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelWrapper label="URL" isRequired />
                      <FormControl>
                        <Input {...field} placeholder="URL" required />
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
                      <FormItem className="w-6/12">
                        <FormLabelWrapper label="Active" isRequired />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interval"
                    render={({ field }) => (
                      <FormItem className="w-6/12">
                        <FormLabelWrapper label="Interval(ms)" isRequired />
                        <FormControl>
                          <Input {...field} type="number" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem className="w-4/12">
                        <FormLabelWrapper label="Method" />
                        <Select onValueChange={field.onChange} defaultValue={field.value ?? 'GET'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select request method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedResponseCode"
                    render={({ field }) => (
                      <FormItem className="w-4/12">
                        <FormLabelWrapper label="Expected Response code" />
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeout"
                    render={({ field }) => (
                      <FormItem className="w-4/12">
                        <FormLabelWrapper label="Timeout(ms)" />
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormItem className="">
                  <FormLabelWrapper label="Authentication Mode" />
                  <FormControl>
                    <RadioGroup
                      className="flex px-1"
                      onValueChange={setAuthMode}
                      value={authMode}
                      defaultValue={authMode}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="radio-none" />
                        <Label htmlFor="radio-none">None</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="username" id="radio-username" />
                        <Label htmlFor="radio-username">Username</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apikey" id="radio-apikey" />
                        <Label htmlFor="radio-apikey">API Key</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
                {authMode !== 'none' ? (
                  authMode === 'apikey' ? (
                    <FormField
                      control={form.control}
                      name="auth.apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabelWrapper label="API Key" />
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className="flex gap-6">
                      <FormField
                        control={form.control}
                        name="auth.username"
                        render={({ field }) => (
                          <FormItem className="w-[50%]">
                            <FormLabelWrapper label="Username" />
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="auth.password"
                        render={({ field }) => (
                          <FormItem className="w-[50%]">
                            <FormLabelWrapper label="Password" />
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )
                ) : (
                  <></>
                )}
                <FormField
                  control={form.control}
                  name="executor"
                  render={({ field }) => (
                    <FormItem className="w-6/12">
                      <FormLabelWrapper label="Executor" />
                      <FormControl>
                        <RadioGroup
                          className="flex px-1"
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? 'default'}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="r1" />
                            <Label htmlFor="r1">Default</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fetch" id="r2" />
                            <Label htmlFor="r2">Fetch</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="curl" id="r3" />
                            <Label htmlFor="r3">Curl</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </ScrollArea>

          <DialogFooter>
            <Button type="submit" form="healthcheck-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
