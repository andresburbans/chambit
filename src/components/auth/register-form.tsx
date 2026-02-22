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
import Link from "next/link"
import { Loader2, User, Briefcase, AlertCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
// Firebase Imports
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["client", "expert"], { required_error: "You need to select a role." }),
})

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Update Auth Profile (Display Name)
      await updateProfile(user, {
        displayName: values.name
      });

      // 3. Parse name into firstName / lastName (Progressive Name Pattern)
      // Strategy: split on first space. User can correct in profile settings later.
      const trimmedName = values.name.trim();
      const spaceIdx = trimmedName.indexOf(" ");
      const firstName = spaceIdx === -1 ? trimmedName : trimmedName.slice(0, spaceIdx).trim();
      const lastName = spaceIdx === -1 ? "" : trimmedName.slice(spaceIdx + 1).trim();

      // 4. Create Firestore User Document — strictly typed against shared/types.ts User
      // Note: onUserCreate Cloud Function also runs on the server as a safety net (merge:true).
      // We write here too so the client sees data immediately without waiting for the trigger.
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: values.email,
        displayName: values.name,
        firstName,
        lastName,
        avatarUrl: user.photoURL || "",
        role: values.role,

        // Profile — empty until user fills in profile settings
        phone: "",
        cc: "",
        birthYear: 0,
        fcmToken: "",

        // Preferences
        preferredCategories: [],
        expertPopupDismissals: 0,

        // Geolocation — empty until user grants GPS permission
        h3Res9: "",
        country: "CO",                       // Default: Colombia
        // geozoneId omitted — set later when expert links to a geozone

        // Access control — auto-enabled for Colombia
        isExpertEnabled: true,

        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      }, { merge: true }); // merge:true is safe — avoids race condition with the Cloud Function

      // 4. Redirect
      router.push("/dashboard");

    } catch (err: any) {
      console.error("Registration error:", err);
      // Map Firebase error codes to user-friendly messages
      let message = "Something went wrong. Please try again.";
      if (err.code === 'auth/email-already-in-use') {
        message = "This email is already in use.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password is too weak.";
      } else if (err.code === 'auth/invalid-email') {
        message = "Invalid email address.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Alex Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>I am a...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormItem>
                    <FormLabel className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                      field.value === 'client' && "border-[#34af00] bg-green-50"
                    )}>
                      <FormControl>
                        <RadioGroupItem value="client" className="sr-only" />
                      </FormControl>
                      <User className={cn("mb-3 h-6 w-6", field.value === 'client' ? "text-[#34af00]" : "text-gray-500")} />
                      Client
                      <FormDescription className="text-xs text-center leading-normal mt-1">I need to hire for a project.</FormDescription>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                      field.value === 'expert' && "border-[#34af00] bg-green-50"
                    )}>
                      <FormControl>
                        <RadioGroupItem value="expert" className="sr-only" />
                      </FormControl>
                      <Briefcase className={cn("mb-3 h-6 w-6", field.value === 'expert' ? "text-[#34af00]" : "text-gray-500")} />
                      Expert
                      <FormDescription className="text-xs text-center leading-normal mt-1">I'm looking for work.</FormDescription>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="w-full bg-[#34af00] hover:bg-[#2d9600] text-white" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#34af00] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </Form>
  )
}
