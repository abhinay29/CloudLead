import React from "react";

function PlanFaq() {
  return (
    <>
      <section className="container mt-5">
        <h4 className="text-center mb-4">FAQs</h4>
        <div class="accordion" id="planFaqs">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                1. What is email deliverability of your data?
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- Around 95%+ for verified Emails & 60-80% for guessed emails.
                We don't keep any bounces on the platform.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                2. How updated is your database?
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- We update database every 3 months & no contact stays on the
                portal more than 90 days.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                3. What is custom data?
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- If you don't wish to subscribe annual subscription & keen to
                buy only one time contacts (Emails or direct dials), then you
                can opt custom data plan.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                4. Why monthly billing option not available for basic plan?
              </button>
            </h2>
            <div
              id="collapseFour"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- As per the new RBI regulations, we can’t support monthly
                recurring payments for Indian customers. Therefore, all India
                customers are billed annually.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-expanded="false"
                aria-controls="collapseFive"
              >
                5. Can I really unlock unlimited contacts in a month in basic
                plan?
              </button>
            </h2>
            <div
              id="collapseFive"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- Yes, but if you have unlocked too many contacts too fast, you
                need to take a little break so that our other customers don’t
                suffer. This is as per the fair usage policy of the portal.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseSix"
                aria-expanded="false"
                aria-controls="collapseSix"
              >
                6. What are "Guessed" category of mails?
              </button>
            </h2>
            <div
              id="collapseSix"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- This emails couldn't get verified. It can happen due to
                following reasons. <br />
                1. The company has activated "catchall" (a domain level
                configuration) - link- what is cathcall? <br />
                2. The company is using SPAM filters/security policies. <br />
                3. The person has recently left the organization.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseSeven"
                aria-expanded="false"
                aria-controls="collapseSeven"
              >
                7. What payment option you provide?
              </button>
            </h2>
            <div
              id="collapseSeven"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- Credit card, net banking, UPI, Debit card.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseEight"
                aria-expanded="false"
                aria-controls="collapseEight"
              >
                8. Why accuracy of direct dials is around 80%?
              </button>
            </h2>
            <div
              id="collapseEight"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- Our research team is continuously validating the direct dials
                & for millions of records it sometimes becomes error some to
                verify
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseNine"
                aria-expanded="false"
                aria-controls="collapseNine"
              >
                9. Can I unsubscribe anytime?
              </button>
            </h2>
            <div
              id="collapseNine"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#planFaqs"
            >
              <div class="accordion-body text-secondary">
                A- Yes. If you unsubscribe, You can still use the platform till
                your monthly/yearly billing cycle is completed & we won't charge
                you for the next month/year. Even if you unsubscribe, you
                default switch to “Free Forever” plan and can continue to use
                the platform without any fees. (For Indian customers, as per the
                newRBI regulations, the bank won't deduct any monthly recurring
                payments from you till the debit request is approved by you via
                an email/sms sent by the bank). Any disputes, you can always
                write/talk to us at{" "}
                <a href="mailto:sales@cloudlead.ai">sales@cloudlead.ai</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlanFaq;
