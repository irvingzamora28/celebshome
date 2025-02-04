import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white dark:bg-indigo-800 dark:text-white">
      <h1 className="text-3xl text-indigo-600 font-bold mb-8 dark:text-white">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl text-indigo-600 font-semibold mb-4 dark:text-white">Data Collection</h2>
        <p className="text-indigo-900 dark:text-indigo-300 mb-4">
          We collect anonymous usage data through Google Analytics and serve
          personalized ads via Google AdSense. Our advertising partners may
          use cookies to serve relevant ads based on your browsing patterns.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-indigo-600 font-semibold mb-4 dark:text-white">Third-Party Services</h2>
        <ul className="list-disc pl-6 text-indigo-900 dark:text-indigo-300 space-y-2">
          <li>Google AdSense (Advertising)</li>
          <li>Google Analytics (Analytics)</li>
          <li>Vercel (Hosting)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-indigo-600 font-semibold mb-4 dark:text-white">Your Rights</h2>
        <p className="text-indigo-900 dark:text-indigo-300 mb-4">
          Under GDPR regulations, you have the right to request access to,
          correction, or deletion of your personal data. Contact us at
          privacy@celebshome.com for any requests.
        </p>
      </section>

      <div className="mt-12 border-t dark:border-indigo-700 pt-8">
        <Link href="/" className="text-indigo-600 dark:text-white hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
