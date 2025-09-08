import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  Users,
  Globe,
  Award,
  Target,
  Zap,
  Shield,
} from "lucide-react";
// Public page: no auth wrapper or dashboard header

export default function AboutUsPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth");
  };

  const stats = [
    {
      label: "Pages Indexed",
      value: "10M+",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      label: "Happy Customers",
      value: "500+",
      icon: <Users className="h-6 w-6" />,
    },
    {
      label: "Success Rate",
      value: "99.9%",
      icon: <Award className="h-6 w-6" />,
    },
    { label: "Uptime", value: "99.9%", icon: <Shield className="h-6 w-6" /> },
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Customer Success",
      description:
        "We measure our success by the success of our customers. Every feature we build is designed to help you achieve your goals.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation",
      description:
        "We constantly push the boundaries of what's possible in SEO automation, always staying ahead of industry trends.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Reliability",
      description:
        "Your success depends on our platform working flawlessly. We take that responsibility seriously with enterprise-grade reliability.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description:
        "We believe in building not just a product, but a community of SEO professionals who support and learn from each other.",
    },
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Former Google engineer with 15+ years in SEO and search technology.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Expert in scalable systems and search engine optimization algorithms.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Mike Rodriguez",
      role: "Head of Product",
      bio: "Product leader with deep experience in SaaS and marketing automation.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              About GetIndexedNow
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Revolutionizing{" "}
              <span className="text-blue-600">SEO Automation</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're on a mission to make SEO indexing faster, more reliable, and
              accessible to everyone. Our platform has helped thousands of
              businesses and agencies achieve their SEO goals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              To democratize SEO automation and make professional-grade indexing
              tools accessible to businesses of all sizes.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                      {value.icon}
                    </div>
                    {value.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{value.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The passionate people behind GetIndexedNow.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name}>
                <CardHeader className="text-center">
                  <img
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                    src={member.image}
                    alt={member.name}
                  />
                  <CardTitle className="mt-4">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Join Us?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Start your journey with GetIndexedNow and see the difference
              professional SEO automation can make.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                onClick={handleGetStarted}
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 text-blue-600 border-white hover:bg-white hover:text-blue-600"
                onClick={() => router.push("/contact-us")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
