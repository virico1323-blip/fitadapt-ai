import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  ChevronRight,
  Dumbbell,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: Brain,
    title: "Adaptive AI Engine",
    description:
      "Our ML system learns your performance patterns and dynamically adjusts intensity after every session.",
  },
  {
    icon: TrendingUp,
    title: "Smart Progress Tracking",
    description:
      "Visualize weight trends, workout history, and goal predictions with precision analytics.",
  },
  {
    icon: Dumbbell,
    title: "Personalized Plans",
    description:
      "Weekly programs generated from your fitness goal, experience level, and physical profile.",
  },
  {
    icon: BarChart3,
    title: "Goal Prediction",
    description:
      "Get data-driven estimates for when you'll hit your target based on your actual progress rate.",
  },
  {
    icon: Activity,
    title: "Difficulty Feedback",
    description:
      "Rate each workout as Easy, Medium, or Hard — the system recalibrates your next session automatically.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data lives on the Internet Computer — fully decentralized, owned by you, always accessible.",
  },
];

const steps = [
  {
    num: "01",
    title: "Set Your Profile",
    description:
      "Enter your age, weight, height, fitness goal, and experience level. Takes under 2 minutes.",
    highlight: "Setup in minutes",
  },
  {
    num: "02",
    title: "Get Your Plan",
    description:
      "Our ML engine generates a tailored 7-day workout program optimized for your body and goals.",
    highlight: "AI-generated weekly plan",
  },
  {
    num: "03",
    title: "Track & Adapt",
    description:
      "Rate each session's difficulty. The system continuously recalibrates to keep you in the optimal challenge zone.",
    highlight: "Continuous adaptation",
  },
];

const stats = [
  { value: "5+", label: "Fitness Goals" },
  { value: "3", label: "Experience Levels" },
  { value: "7-day", label: "Weekly Plans" },
  { value: "100%", label: "Adaptive" },
];

export function HomePage() {
  const { isAuthenticated, login, isLoggingIn } = useAuth();

  return (
    <div className="fade-in">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Ambient background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-fitness-ai.dim_1200x600.jpg')",
          }}
          aria-hidden
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/75"
          aria-hidden
        />

        {/* Floating orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full opacity-10 float-orb pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.16 190), transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-52 h-52 rounded-full opacity-[0.07] float-orb pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.70 0.20 32), transparent 70%)",
            animationDelay: "3s",
          }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 right-1/6 w-40 h-40 rounded-full opacity-[0.06] float-orb pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.18 145), transparent 70%)",
            animationDelay: "1.5s",
          }}
          aria-hidden
        />

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-7">
                <Zap className="w-3.5 h-3.5" />
                <span>ML-Powered Fitness Intelligence</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              Train Smarter.{" "}
              <span className="gradient-text">Adapt Faster.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              FitAdapt AI generates personalized weekly workout plans that
              evolve with every session — powered by machine learning that
              responds to your effort, not a fixed template.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="gradient-primary border-0 text-primary-foreground glow-primary hover:opacity-90 transition-smooth font-semibold"
                    data-ocid="hero.go_to_dashboard_button"
                  >
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-border/60 hover:bg-secondary transition-smooth"
                    data-ocid="hero.start_workout_button"
                  >
                    <Link to="/workout-form">Start a Workout</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="gradient-primary border-0 text-primary-foreground glow-primary hover:opacity-90 transition-smooth font-semibold"
                    data-ocid="hero.connect_button"
                  >
                    {isLoggingIn ? "Connecting…" : "Get Started Free"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-border/60 hover:bg-secondary transition-smooth"
                    data-ocid="hero.how_it_works_button"
                  >
                    <a href="#how-it-works">See How It Works</a>
                  </Button>
                </>
              )}
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-border/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-display font-bold gradient-text">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Capabilities
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Built for real progress
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Every feature is designed around the feedback loop that drives
              genuine fitness gains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                className="bg-card border border-border/60 rounded-xl p-6 hover:border-primary/40 hover:bg-card/80 transition-smooth group cursor-default"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                data-ocid={`features.item.${i + 1}`}
              >
                <div className="w-11 h-11 rounded-lg gradient-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-smooth">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section
        id="how-it-works"
        className="py-28 bg-background relative overflow-hidden"
      >
        {/* Subtle decorative line */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, oklch(0.72 0.16 190) 0px, transparent 1px, transparent 80px)",
          }}
          aria-hidden
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Process
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Three steps from zero to a fully personalized, self-evolving
              workout program.
            </p>
          </motion.div>

          {/* Step cards with connectors */}
          <div className="relative flex flex-col md:flex-row items-start gap-6 md:gap-0 max-w-5xl mx-auto">
            {steps.map(({ num, title, description, highlight }, i) => (
              <div
                key={num}
                className="flex-1 flex flex-col md:flex-row items-start"
              >
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  data-ocid={`how_it_works.step.${i + 1}`}
                >
                  <div className="bg-card border border-border/60 rounded-2xl p-7 hover:border-primary/30 transition-smooth group h-full mx-2 md:mx-3">
                    {/* Step number */}
                    <div className="inline-flex items-center gap-2 mb-5">
                      <span className="text-4xl font-display font-bold gradient-text leading-none">
                        {num}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl mb-3">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {description}
                    </p>

                    {/* Highlight pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-subtle" />
                      {highlight}
                    </div>
                  </div>
                </motion.div>

                {/* Connector arrow (between steps, not after last) */}
                {i < steps.length - 1 && (
                  <motion.div
                    className="hidden md:flex items-center justify-center w-8 mt-16 shrink-0"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.25 }}
                    aria-hidden
                  >
                    <ChevronRight className="w-5 h-5 text-primary/50" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-28 bg-muted/20 relative overflow-hidden">
        {/* Glow accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.72 0.16 190), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Get Started
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-5">
              Start your journey today
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg leading-relaxed">
              Connect your Internet Identity and get your first AI-personalized
              workout plan in under 2 minutes. No subscription. No gimmicks.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="gradient-primary border-0 text-primary-foreground glow-primary hover:opacity-90 transition-smooth font-semibold px-8"
                    data-ocid="cta.start_journey_button"
                  >
                    <Link to="/workout-form">
                      Start Your Journey
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-border/60 hover:bg-secondary transition-smooth"
                    data-ocid="cta.dashboard_button"
                  >
                    <Link to="/dashboard">Open Dashboard</Link>
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="gradient-primary border-0 text-primary-foreground glow-primary hover:opacity-90 transition-smooth font-semibold px-8"
                  data-ocid="cta.connect_button"
                >
                  {isLoggingIn ? "Connecting…" : "Start Your Journey"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Social proof nudge */}
            <motion.p
              className="mt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Powered by Internet Computer ·{" "}
              <span className="text-primary">Fully decentralized</span> · Your
              data, your control
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
