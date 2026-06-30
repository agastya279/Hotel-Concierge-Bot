import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-border/40"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <AnimatedLogo size={28} animated={false} />
              <span className="font-display font-medium text-sm text-foreground">SEED Resort</span>
            </div>
          </Link>
          <Link href="/">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
        </div>
      </motion.header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: June 30, 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prose prose-sm max-w-none text-muted-foreground space-y-8"
        >
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Overview</h2>
            <p>
              SEED Resort is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use Aria, our AI concierge service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Chat messages:</strong> Conversations you have with Aria to provide concierge services.</li>
              <li><strong>Account info:</strong> If you create an account, we store your name, email, and profile information.</li>
              <li><strong>Usage data:</strong> Anonymized analytics about how the service is used to improve Aria.</li>
              <li><strong>Device info:</strong> Browser type and device characteristics for service optimization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Guest vs. Signed-In Users</h2>
            <p>
              <strong>Guest users:</strong> Conversations are processed in real-time but not permanently stored. Once you close the chat, the conversation history is not retained.
            </p>
            <p className="mt-2">
              <strong>Signed-in users:</strong> Your conversation history is saved to your account so you can access it across devices. You can delete individual conversations or your entire account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide concierge assistance and process your requests.</li>
              <li>To improve Aria's responses and service quality.</li>
              <li>To maintain conversation history for signed-in users.</li>
              <li>To send service-related notifications (only with your consent).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Security</h2>
            <p>
              We use industry-standard encryption and security practices. Conversation data is encrypted in transit (TLS) and at rest. Access is restricted to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Sharing</h2>
            <p>
              We do not sell, rent, or share your personal data with third parties for marketing purposes. Data is only shared with:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Resort staff when necessary to fulfill your requests (e.g., reservation team).</li>
              <li>Service providers who assist with hosting and infrastructure, bound by strict confidentiality agreements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal data and conversation history.</li>
              <li>Delete your account and all associated data.</li>
              <li>Export your conversation history.</li>
              <li>Opt out of non-essential communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Cookies &amp; Tracking</h2>
            <p>
              We use essential cookies for authentication and session management. Analytics cookies are optional and used only to improve the service. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Retention</h2>
            <p>
              Guest conversations are not retained. Signed-in user data is kept for as long as your account is active. Deleted data is permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Significant changes will be communicated via the service or email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              For privacy-related questions or data requests, please contact SEED Resort guest services.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
