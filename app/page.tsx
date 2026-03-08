"use client";

import { useState } from "react";
import {
  MapPin,
  TrendingDown,
  Users,
  Bell,
  Shield,
  BarChart3,
  Search,
  Send,
  ChevronDown,
  ChevronUp,
  Droplets,
  Star,
  ArrowRight,
  Menu,
  X,
  ThumbsUp,
  Clock,
  Zap,
} from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Hyperlocal Pricing",
      desc: "See oil prices reported by your neighbours, street by street. Know exactly what people near you are paying.",
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Price Trend Alerts",
      desc: "Track price movements over weeks and months. Get notified when prices drop in your area so you can buy at the right time.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Powered",
      desc: "Real prices from real people. No middlemen, no inflated quotes — just honest data from your community.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Reports",
      desc: "Our smart verification system flags outliers and rewards consistent contributors with trust badges.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Supplier Comparison",
      desc: "Compare what different suppliers are charging across your county. Make informed decisions with real data.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Group Buy Alerts",
      desc: "Join forces with neighbours to negotiate bulk discounts. Bigger orders mean better prices for everyone.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Report Your Price",
      desc: "After your oil delivery, submit the price you paid, your area, and the supplier. Takes 30 seconds.",
      icon: <Send className="w-8 h-8" />,
    },
    {
      num: "02",
      title: "Explore the Map",
      desc: "Browse the interactive map to see what others are paying in your town, county, or across the country.",
      icon: <Search className="w-8 h-8" />,
    },
    {
      num: "03",
      title: "Get Alerts",
      desc: "Set up price drop notifications for your area. We'll ping you when it's a good time to order.",
      icon: <Bell className="w-8 h-8" />,
    },
    {
      num: "04",
      title: "Save Money",
      desc: "Use real community data to negotiate better prices or join group buys with your neighbours.",
      icon: <TrendingDown className="w-8 h-8" />,
    },
  ];

  const testimonials = [
    {
      name: "Sinéad O'Brien",
      location: "Co. Donegal",
      text: "I saved €120 on my last fill just by waiting for the price drop alert. This is a game-changer for rural Ireland.",
      rating: 5,
    },
    {
      name: "Pádraig Murphy",
      location: "Co. Galway",
      text: "We organised a group buy with 8 neighbours through the app. Got 6 cent per litre off — that's nearly €60 each on 1000L.",
      rating: 5,
    },
    {
      name: "Karen Doyle",
      location: "Co. Meath",
      text: "Finally some transparency in oil pricing. I used to just ring around and hope for the best. Now I know exactly what's fair.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "Is OilPriceLocal free to use?",
      a: "Yes! The basic plan is completely free. You can browse the map, report prices, and get weekly price summaries at no cost. Pro and Teams plans unlock real-time alerts, historical analytics, and group buy features.",
    },
    {
      q: "How do you verify that prices are accurate?",
      a: "We use a multi-layer verification system: community voting, statistical outlier detection, and receipt upload verification for Pro users. Consistently accurate reporters earn trust badges that highlight their submissions.",
    },
    {
      q: "What areas does OilPriceLocal cover?",
      a: "We're launching across all 26 counties in Ireland, with particular focus on rural areas where heating oil is most common. We plan to expand to Northern Ireland and the UK in 2026.",
    },
    {
      q: "Can suppliers use OilPriceLocal?",
      a: "Absolutely. Suppliers can claim a profile, respond to group buy requests, and advertise competitive prices directly to local customers. It's a win-win — more visibility for suppliers, better prices for consumers.",
    },
    {
      q: "How is my privacy protected?",
      a: "We never share your exact address. Reports are shown at townland/area level only. Your personal details are never visible to other users or suppliers unless you explicitly opt in.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Droplets className="w-8 h-8 text-amber-600" />
              <span className="text-xl font-bold text-gray-900">
                OilPrice<span className="text-amber-600">Local</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">FAQ</a>
              <a href="#waitlist" className="bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors">
                Join Waitlist
              </a>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileMenu && (
            <div className="md:hidden pb-4 space-y-3">
              <a href="#features" className="block text-sm text-gray-600 hover:text-amber-600">Features</a>
              <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-amber-600">How It Works</a>
              <a href="#pricing" className="block text-sm text-gray-600 hover:text-amber-600">Pricing</a>
              <a href="#faq" className="block text-sm text-gray-600 hover:text-amber-600">FAQ</a>
              <a href="#waitlist" className="block bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium text-center">
                Join Waitlist
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Launching across Ireland
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Know the <span className="text-amber-600">real price</span> of heating oil in your area
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Stop ringing around for quotes. See what your neighbours actually paid — updated in real-time on an interactive map. Community-powered pricing transparency.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#waitlist"
                  className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/25"
                >
                  Get Early Access
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-all border border-gray-200"
                >
                  See How It Works
                </a>
              </div>
            </div>
            {/* Map mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
                <div className="bg-gray-100 rounded-xl p-6 relative overflow-hidden" style={{ minHeight: 360 }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 opacity-60" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Search className="w-4 h-4 text-gray-400" />
                      <div className="bg-white rounded-lg px-3 py-1.5 text-sm text-gray-500 flex-1 shadow-sm">
                        Search your eircode or town...
                      </div>
                    </div>
                    {[
                      { top: "25%", left: "30%", price: "€0.89/L", color: "bg-green-500" },
                      { top: "40%", left: "55%", price: "€0.94/L", color: "bg-amber-500" },
                      { top: "15%", left: "65%", price: "€0.91/L", color: "bg-green-500" },
                      { top: "55%", left: "25%", price: "€0.97/L", color: "bg-red-500" },
                      { top: "60%", left: "70%", price: "€0.88/L", color: "bg-green-500" },
                      { top: "35%", left: "80%", price: "€0.93/L", color: "bg-amber-500" },
                    ].map((pin, i) => (
                      <div key={i} className="absolute" style={{ top: pin.top, left: pin.left }}>
                        <div className={`${pin.color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap`}>
                          {pin.price}
                        </div>
                        <div className={`w-2 h-2 ${pin.color} rounded-full mx-auto mt-0.5`} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-sm z-10">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Price Range</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> Low</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" /> Mid</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" /> High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "€0.91", label: "Avg price/litre today" },
              { value: "2,400+", label: "Price reports this month" },
              { value: "26", label: "Counties covered" },
              { value: "€140", label: "Avg savings per fill" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to get the best oil price
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powered by your community. Built for rural Ireland.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How OilPriceLocal works</h2>
            <p className="mt-4 text-lg text-gray-600">Four simple steps to smarter heating oil purchases.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 h-full">
                  <span className="text-5xl font-bold text-amber-100">{s.num}</span>
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center my-4">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-amber-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What early users are saying</h2>
            <p className="mt-4 text-lg text-gray-600">Real feedback from people across Ireland.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple, fair pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free", price: "€0", period: "forever", desc: "Perfect for casual users",
                features: ["Browse the price map", "Report prices", "Weekly price summary email", "Community trust badges"],
                cta: "Get Started", popular: false,
              },
              {
                name: "Pro", price: "€4.99", period: "/month", desc: "For savvy homeowners",
                features: ["Everything in Free", "Real-time price drop alerts", "Historical price analytics", "Receipt upload verification", "Supplier ratings access", "Priority support"],
                cta: "Join Waitlist", popular: true,
              },
              {
                name: "Teams", price: "€19.99", period: "/month", desc: "For estates & communities",
                features: ["Everything in Pro", "Group buy organiser tools", "Bulk order coordination", "Community dashboard", "Supplier negotiation support", "Dedicated account manager"],
                cta: "Contact Us", popular: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 ${plan.popular ? "bg-amber-600 text-white shadow-xl shadow-amber-600/25 ring-4 ring-amber-600/20 scale-105" : "bg-white border border-gray-200"}`}>
                {plan.popular && (
                  <span className="inline-block bg-white text-amber-600 text-xs font-bold px-3 py-1 rounded-full mb-4">Most Popular</span>
                )}
                <h3 className={`text-xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                <p className={`text-sm mt-1 ${plan.popular ? "text-amber-100" : "text-gray-500"}`}>{plan.desc}</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? "text-amber-100" : "text-gray-500"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <ThumbsUp className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-amber-200" : "text-amber-600"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#waitlist" className={`block text-center py-3 rounded-full font-medium text-sm transition-colors ${plan.popular ? "bg-white text-amber-600 hover:bg-amber-50" : "bg-amber-600 text-white hover:bg-amber-700"}`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to know about OilPriceLocal.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Waitlist */}
      <section id="waitlist" className="py-20 lg:py-28 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Droplets className="w-12 h-12 mx-auto mb-6 text-amber-200" />
          <h2 className="text-3xl sm:text-4xl font-bold">Stop overpaying for heating oil</h2>
          <p className="mt-4 text-lg text-amber-100 max-w-xl mx-auto">
            Join thousands of Irish homeowners getting the best prices. Sign up for early access and be the first to know when we launch in your area.
          </p>
          {submitted ? (
            <div className="mt-8 bg-white/20 backdrop-blur rounded-2xl p-6 max-w-md mx-auto">
              <ThumbsUp className="w-10 h-10 mx-auto mb-3 text-amber-200" />
              <p className="font-semibold text-lg">You&apos;re on the list!</p>
              <p className="text-amber-100 text-sm mt-1">We&apos;ll notify you when OilPriceLocal launches in your area.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required className="flex-1 px-5 py-3.5 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-300" />
              <button type="submit" className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">Join Waitlist</button>
            </form>
          )}
          <div className="mt-6 flex items-center justify-center gap-6 text-amber-200 text-sm">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> No spam</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Launching Q2 2026</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 3,200+ signups</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-6 h-6 text-amber-500" />
                <span className="text-lg font-bold text-white">OilPrice<span className="text-amber-500">Local</span></span>
              </div>
              <p className="text-sm leading-relaxed">Community-powered heating oil price transparency for Ireland. Know what your neighbours pay.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} OilPriceLocal. All rights reserved. Made in Ireland.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
