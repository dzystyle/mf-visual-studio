import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/legal/terms')({
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20 font-sans">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight">ArTrail - 使用条款</h1>
        
        <div className="rounded-2xl border border-white/5 bg-[#0f0f12] p-8 md:p-12 shadow-2xl">
          <div className="prose prose-invert max-w-none space-y-8 text-white/70">
            <section>
              <h2 className="text-xl font-semibold text-white uppercase">TERMS OF SERVICE</h2>
              <p className="text-sm">Last Updated: August 18, 2025</p>
            </section>

            <section className="bg-white/5 p-6 rounded-xl border border-white/10 italic">
              <p>
                [SECTION 10 CONTAINS AN ARBITRATION CLAUSE AND CLASS ACTION WAIVER. BY AGREEING TO THESE TERMS, YOU AGREE (A) TO RESOLVE ALL DISPUTES (WITH LIMITED EXCEPTION) RELATED TO ARTRAIL.AI'S SERVICES AND/OR PRODUCTS THROUGH BINDING INDIVIDUAL ARBITRATION, WHICH MEANS THAT YOU WAIVE ANY RIGHT TO HAVE THOSE DISPUTES DECIDED BY A JUDGE OR JURY, AND (B) TO WAIVE YOUR RIGHT TO PARTICIPATE IN CLASS ACTIONS, CLASS ARBITRATIONS, OR REPRESENTATIVE ACTIONS, AS SET FORTH BELOW. YOU HAVE THE RIGHT TO OPT-OUT OF THE ARBITRATION CLAUSE AND THE CLASS ACTION WAIVER AS EXPLAINED IN SECTION 10.]
              </p>
            </section>

            <section>
              <p>Welcome to ArTrail.ai!</p>
              <p>
                This Terms of Service ("Terms") constitutes a legally binding document between you ("User" or "You") and ArTrail.ai ("ArTrail.ai," "we," "us," or "our") concerning your use of the ArTrail.ai video agent service (the "Service").
              </p>
              <p>
                Please read and fully understand all terms of this Terms before using the Service, especially those clauses that exclude or limit liability and those governing applicable law and dispute resolution. The Services are offered by ARTRAIL PTE. LTD. ("we", "us", or "our"), with its registered address at 60 PAYA LEBAR ROAD #11-53 PAYA LEBAR SQUARE SINGAPORE 409051, SINGAPORE. The associated company is ArTrail Limited, with its registered address at Suite 603, 6/F, Laws Comm Plaza, 788 Cheung Sha Wan Road, Hong Kong. By registering for, logging into, or using the Service, you signify that you have read, understood, and agree to be bound by all terms of this Terms. If you do not agree with any part of these Terms, please cease using the Service immediately.
              </p>
            </section>

            <section>
              <p>
                <strong>Changes.</strong> We may update these Terms of Service from time to time to reflect changes in legal, regulatory, operational requirements, our practices, and other factors. Please check these Terms of Service periodically for updates. [If any of the changes are unacceptable to you, you should cease interacting with us.] When required under applicable law, we will notify you of any changes to these Terms of Service. Any modifications to these Terms of Service will be effective upon our posting the modified version (or as otherwise indicated at the time of posting). [In all cases, your use of the Services after the effective date of any modified Terms of Service indicates your acknowledging that the modified Terms of Service applies to your interactions with the Services and our business.]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">1. WHO MAY USE THE SERVICES.</h2>
              <p>
                1.1 By accessing the Services, you confirm that you are at least 13 years old and meet the minimum age of digital consent in your country. If you are old enough to access the Services in your country but not old enough to have the authority to consent to our terms, your parent or guardian must agree to our terms on your behalf.
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
