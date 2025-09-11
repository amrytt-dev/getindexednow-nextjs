import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="w-full max-w-md">
        <div className="w-full flex justify-center mb-8">
          <img src="/logo.svg" alt="GetIndexedNow Logo" className="h-12" />
        </div>

        <Card className="border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
            <CardDescription>
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-foreground/70 mb-6">
                Don't worry, it happens to the best of us. Let's get you back on
                track.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push("/")}
                className="w-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>

              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Looking for something specific?
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => router.push("/blog")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Blog
                </Button>
                <Button
                  onClick={() => router.push("/help-center")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
