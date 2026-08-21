import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/legal/privacy')({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20 font-sans">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight">ArTrail - 隐私政策</h1>
        
        <div className="rounded-2xl border border-white/5 bg-[#0f0f12] p-8 md:p-12 shadow-2xl">
          <div className="prose prose-invert max-w-none space-y-8 text-white/70">
            <section>
              <h2 className="text-xl font-semibold text-white">ArTrail Privacy Policy</h2>
              <p className="text-sm">Last Updated Date: April 13, 2026</p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-white">Introduction</h3>
              <p>
                Welcome to ArTrail Platform ("ArTrail", or the "Platform"), which includes the ArTrail mobile application, desktop software, official website, and any other features, functionalities, or services provided now or in the future (collectively the "Services"). The Services are offered by ARTRAIL PTE. LTD. ("we", "us", or "our"), with its registered address at 60 PAYA LEBAR ROAD #11-53 PAYA LEBAR SQUARE SINGAPORE 409051, SINGAPORE. The associated company is ArTrail Limited, with its registered address at Suite 603, 6/F, Laws Comm Plaza, 788 Cheung Sha Wan Road, Hong Kong. We value your privacy and are committed to protecting your personal data. This Privacy Policy ("Policy") explains how we collect, use, share, and safeguard your personal information when you access or use the Services, including any site or platform that links to this Policy.
              </p>
            </section>

            <section>
              <p>This Policy describes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The types of personal information we collect and how we collect it;</li>
                <li>How we use your personal information and the legal bases for doing so;</li>
                <li>How we share your information and with whom;</li>
                <li>Your privacy rights under applicable laws, including GDPR and U.S. privacy laws (such as CCPA/CPRA);</li>
                <li>How we protect your information and how long we retain it.</li>
              </ul>
            </section>

            <section>
              <p>
                Please read carefully and fully this Policy before using or continuing to use our Services and, if necessary, make appropriate choices in accordance with the guidelines in this Policy. By accessing or using the Services, you acknowledge and agree to this Policy. If you do not agree, please do not use our Services. Please note that this Policy does not cover third-party products, services, websites, or content ("Third-Party Services"). These are subject to their own privacy policies, and we recommend reviewing their privacy statements before using them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">1. What Information We Collect</h2>
              <p>
                We may collect the following information from and about you, including information that you provide, automatically collected information, and information from other sources.
              </p>
              
              <h3 className="text-lg font-medium text-white mt-4">Information You Provide</h3>
              <p>
                When you interact with our Services, you may provide information directly to us, such as when you create an account, upload content, or contact support.
              </p>
            </section>
            
            <div className="pt-12 text-center text-xs text-white/20">
              © 2026 ARTRAIL PTE. LTD. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
