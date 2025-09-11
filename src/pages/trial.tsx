import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { Zap, Check, ArrowLeft } from "lucide-react";

export default function TrialPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      toast({
        title: "Authentication System",
        description: "Please implement your own authentication system.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please implement your own authentication system.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                GetIndexedNow
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get 7 days of free access to all our premium features. No credit
            card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Trial Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Start your free trial and experience the power of GetIndexedNow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Start Free Trial"}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth" className="text-blue-600 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trial Benefits */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What You Get in Your Free Trial
              </h2>
              <p className="text-gray-600 mb-6">
                Experience all the features of our premium plans for 7 days,
                completely free.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-500 mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    1,000 Free Credits
                  </h3>
                  <p className="text-gray-600">
                    Submit up to 1,000 URLs for indexing during your trial
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-500 mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    All Premium Features
                  </h3>
                  <p className="text-gray-600">
                    Access to priority indexing, analytics, and more
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-500 mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Priority Support
                  </h3>
                  <p className="text-gray-600">
                    Get help from our support team during your trial
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-500 mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    No Credit Card Required
                  </h3>
                  <p className="text-gray-600">
                    Start your trial without providing payment information
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Trial Terms</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 7-day free trial period</li>
                <li>• 1,000 credits included</li>
                <li>• No automatic billing</li>
                <li>• Cancel anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Trusted by thousands of websites
          </h3>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">10,000+</div>
            <div className="text-gray-400">•</div>
            <div className="text-2xl font-bold text-gray-400">99.9%</div>
            <div className="text-gray-400">•</div>
            <div className="text-2xl font-bold text-gray-400">24/7</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Websites indexed • Uptime • Support
          </p>
        </div>
      </div>
    </div>
  );
}
