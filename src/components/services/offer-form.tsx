"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { Service } from "@/lib/types"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const createFormSchema = (servicePrice: number) => z.object({
  price: z.coerce.number()
    .min(servicePrice * 0.5, { message: "Offer seems too low." })
    .max(servicePrice * 2, { message: "Offer seems too high." }),
  message: z.string().min(10, {
    message: "Please provide a brief message about your needs.",
  }).max(500),
})

type OfferFormProps = {
  service: Service;
}

export function OfferForm({ service }: OfferFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const formSchema = createFormSchema(service.price);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: service.price,
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(values)
    setTimeout(() => {
        setLoading(false);
        toast({
            title: "Offer Sent!",
            description: `Your offer of $${values.price} has been sent to ${service.expert.name}.`,
        })
        form.reset();
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Offer</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">$</span>
                  <Input type="number" step="1" className="pl-7" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                The listed price is ${service.price}. You can negotiate.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message to {service.expert.name}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about your project, timeline, and any specific requirements."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Offer
        </Button>
      </form>
    </Form>
  )
}
