"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useAuth } from "@/lib/auth"
import { UserService } from "@/lib/services/user.service"
import { Loader2, MapPin, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const profileSchema = z.object({
    displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    bio: z.string().max(500).optional(),
    phone: z.string().optional(),
})

export function ProfileForm() {
    const { user, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName || "",
            bio: user?.expert?.bio || "",
            phone: user?.phone || "",
        },
    })

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        if (!user) return;
        setLoading(true);
        setMsg(null);

        try {
            await UserService.updateProfile(user.uid, {
                displayName: values.displayName,
                phone: values.phone || "",
                // bio lives inside the expert sub-object
                ...(values.bio ? { 'expert.bio': values.bio } : {}),
            });
            await refreshProfile();
            setMsg({ type: 'success', text: 'Profile updated successfully.' });
        } catch (error) {
            setMsg({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateLocation = () => {
        if (!navigator.geolocation || !user) {
            setMsg({ type: 'error', text: 'Geolocation is not supported by your browser.' });
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const h3Index = await UserService.updateLocation(user.uid, latitude, longitude);
                    await refreshProfile();
                    setMsg({ type: 'success', text: `Location updated! Secured on grid: ${h3Index}` });
                } catch (err) {
                    setMsg({ type: 'error', text: 'Failed to save location.' });
                } finally {
                    setLocationLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setMsg({ type: 'error', text: 'Unable to retrieve location. Please check permissions.' });
                setLocationLoading(false);
            }
        );
    };

    if (!user) return null;

    return (
        <div className="space-y-6">
            {msg && (
                <Alert variant={msg.type === 'error' ? "destructive" : "default"} className={msg.type === 'success' ? "border-[#34af00] text-[#34af00]" : ""}>
                    <AlertTitle>{msg.type === 'success' ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>{msg.text}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your public identity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+57 300 123 4567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tell us about yourself..." className="resize-none" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Brief description for your profile card.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={loading} className="bg-[#34af00] hover:bg-[#2d9600]">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Right Column: Location & Expert Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Location & Coverage</CardTitle>
                            <CardDescription>We use H3 geospatial indexing to protect your privacy.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Current Status</p>
                                    <div className="flex items-center gap-2">
                                        {user.h3Res9 ? (
                                            <>
                                                <Badge variant="outline" className="text-[#34af00] border-[#34af00] bg-green-50">Active</Badge>
                                                <span className="text-xs font-mono text-muted-foreground">{user.h3Res9}</span>
                                            </>
                                        ) : (
                                            <Badge variant="secondary">Not Set</Badge>
                                        )}
                                    </div>
                                </div>
                                <MapPin className={user.h3Res9 ? "text-[#34af00]" : "text-muted-foreground"} />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleUpdateLocation}
                                disabled={locationLoading}
                            >
                                {locationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                                Update Location
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                We only store your H3 cell index (approx. 100m radius), never your exact coordinates.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Expert Specific Settings (Placeholder for now) */}
                    {user.role === 'expert' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Expert Settings</CardTitle>
                                <CardDescription>Manage your professional visibility.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                                    Skills & Education management coming in Block 2.
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
