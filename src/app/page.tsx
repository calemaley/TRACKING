import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';

export default function AuthenticationPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <Logo className="mx-auto h-12 w-auto" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Scholastic Finance Tracker
        </h1>
        <p className="text-muted-foreground">
          Sign in to your account or create a new one to get started.
        </p>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                  Enter your email below to sign in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2 text-left">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input id="email-signin" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2 text-left">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input id="password-signin" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Sign In</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                  Enter your details below to create a new account.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2 text-left">
                    <Label htmlFor="name-signup">Full Name</Label>
                    <Input id="name-signup" placeholder="Jane Doe" />
                </div>
                <div className="grid gap-2 text-left">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2 text-left">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Sign Up</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
