import React from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import { selectBrand, selectConfig } from '../../../slices'
import {
  Content,
  Main,
  PageTitle,
  PageContent,
  HeaderDefault,
  PageContainer,
} from '../..'

const Terms = () => {
  const { accessibility: config } = useSelector(selectConfig)
  const { title: siteTitle } = useSelector(selectBrand)

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle title='Terms & Conditions'/>
            <PageContent style={{ textAlign: 'left', marginTop: '3rem' }}>
              <h4 id='general-terms'>General Conditions</h4>
              <p>
                Please review these Terms of Use prior to using the mr.com or
                mrktbox.com websites and associated services (the “Services”),
                as you are deemed to accept and be bound by these Terms of Use
                in accessing any of the Services.
              </p>
              <p>
                MRKTBOX Inc. ("MRKTBOX") reserves the right to change these
                Terms of Use, in whole or in part, at any time without notice.
                Accordingly, you should always review this page prior to
                accessing any of the Services in order to ensure that you have
                an understanding of the current terms of use under which you are
                permitted access to this website.
              </p>
              <p>
                Should you disagree in any manner with these Terms of Use, you
                are required to immediately discontinue your use of the
                Services.
              </p>
              <h4>Registration</h4>
              <p>
                When registering for an account, you agree to provide accurate
                and current information about yourself as requested and to
                promptly update such information as necessary to ensure that it
                is kept accurate and complete. You agree to be responsible for:
                (a) the accuracy of all information that you provide to us; (b)
                maintaining the confidentiality of any passwords or other
                account identifiers that you choose or that are otherwise
                assigned to you as a result of any registration or purchase made
                through the website; and (c) all activities that occur under
                such password(s) or account(s). Further, you agree to notify us
                of any unauthorised use of your password or account of which
                you are or become aware of MRKTBOX shall not be responsible or
                liable, directly or indirectly, in any way for any loss or
                damage of any kind incurred as a result of, or in connection
                with, your failure to comply with this section, or for any delay
                in shutting down your account after you have reported a breach
                of security to us.
              </p>
              <h4>Placing an Order</h4>
              <p>
                All dollar amounts on the websites are in Canadian dollars.
              </p>
              <p>
                By completing the checkout and submitting an order through
                mrktbox.com or dundurnmarket.com, you are agreeing to pay, in
                full, the prices of the items selected and all applicable taxes,
                either by credit card or other permitted payment method.
              </p>
              <p>
                In order to complete an order, you may be required to provide
                certain additional information that is required to process your
                order. If you do not complete or improperly complete your order,
                it may not be accepted or acknowledged. We reserve the right to
                change the permitted methods of payment at any time.
              </p>
              <p>
                During the authorization process when you submit your order,
                your card is validated and must have enough available funds for
                the transaction to be approved. Upon approval, the order will be
                prepared for delivery. If you fail to pay any fees or charges
                when due, we reserve the right to charge such amount directly
                to the credit card as provided by you at the time you submitted
                your order. You are responsible and liable for any fees,
                including legal costs and collection costs, that we may incur in
                its efforts to collect any unpaid balances from you.
              </p>
              <p>
                You may cancel your order or modify the order (including adding
                or removing products, changing quantities, or changing order
                delivery details) via the website or mobile app up until the day
                indicated on our sites prior to the delivery date selected (the
                “Cut-off time”).
              </p>
              <p>
                If an order is cancelled after the Cut-off Time, MRKTBOX
                reserves the right to charge a cancellation fee of $25 for all
                cancellations by the customer.
              </p>
              <h4>Intended Use and Restrictions</h4>
              <p>
                The material on the mrktbox.com website and associated services
                is owned or licensed by MRKTBOX and is intended to be viewed by
                users in Ontario only. As the websites are business and
                commercial sites, access to the websites is not intended for use
                and may not be legally accessed by persons under the age of
                sixteen (16) years old.
              </p>
              <p>
                MRKTBOX makes no claim that the information located on the
                mrktbox.com or websites is appropriate for or may be downloaded
                legally by users from outside of Ontario.
              </p>
              <p>
                Subject to the MRKTBOX Privacy Policy that restricts the use of
                personal data, any material, information or ideas that you as a
                user transmit or post on the mrktbox.com or dundurnmarket.com
                websites by any means whatsoever will be treated as
                non-confidential and non-proprietary, and may be disseminated or
                used by MRKTBOX for any purpose it deems appropriate.
              </p>
              <p>
                Users accessing the Services are advised that it is prohibited
                to post or transmit on or via the Services any unlawful,
                threatening, libellous, defamatory, scandalous, inflammatory,
                obscene, pornographic or profane material or any material that
                could constitute or encourage conduct that could be considered a
                criminal offence or violation of any law.
              </p>
              <h4>Copyright</h4>
              <p>
                MRKTBOX or the entity from which MRKTBOX licences copyrighted
                material is the copyright owner of the website design, text and
                graphics, and the selection and arrangement of such elements as
                part of the Services. Any reproduction, distribution,
                republication, posting, or transmission of the Services in any
                form or by any means without the express prior written approval
                of MRKTBOX and/or the licensee is strictly prohibited.
              </p>
              <p>
                MRKTBOX grants to you as a user of the Services permission to
                lawfully access and use the services available on the
                mrktbox.com website(s) and to download, archive and print in
                hard copy, portions of the website(s) for personal use only,
                provided that you do not modify the materials and that you
                retain all proprietary notices contained in the materials on
                such downloaded, archived or printed materials. Users are
                strictly prohibited from selling any downloaded, archived or
                printed portions of the website(s) viewed.
              </p>
              <p>
                MRKTBOX permission to you terminates automatically, without any
                need of notification of such termination, if you breach any of
                these Terms of Use.
              </p>
              <h4>Trademarks</h4>
              <p>
                “MRKTBOX” and the mrktbox.com domain name, “MRKTBOX” and the
                mrktobx.com domain name, the logos, all page headers, custom
                graphics and button icons are service marks, trademarks and/or
                trade dress owned by MRKTBOX. In addition, there are numerous
                other trademarks, product names, company names, logo service
                marks, and/or trade dress indicated on the websites that are
                the property of their respective owners and are displayed by
                MRKTBOX under licence therefrom. You are prohibited from using
                any trademarked materials without the express prior written
                permission of MRKTBOX and/or the licensor.
              </p>
              <h4>
                Warranties Related to the Use of the Website and Associated
                Services
              </h4>
              <p>
                Subject to the MRKTBOX return of goods policy, the information,
                materials and services contained on the mrktbox.com and
                dundurnmarket.com sites, including but not limited to, the
                graphics, links and other items, are being provided to you on an
                "as is” and “as available” basis with no warranty. MRKTBOX does
                not warrant or guarantee the accuracy, adequacy or completeness
                of this information and materials, and expressly disclaims
                liability for any errors and/or omissions in this information
                and materials. To the maximum extent permitted by law, MRKTBOX
                disclaims all representations and warranties of any kind,
                whether expressed, implied or statutory, including, without
                limitation, the implied warranties of title, non-infringement,
                merchantability, and fitness for a particular purpose.
              </p>
              <p>
                As well, MRKTBOX does not warrant, guarantee or make any
                representations whatsoever regarding the security of accounts,
                or that this site is free from destructive materials including,
                but not limited to, computer viruses, hackers, or other
                technical sabotage. Further, MRKTBOX does not warrant, guarantee
                or make any representations that access to the mrktbox.com
                website will be fully accessible, current and/or accurate at
                all times, uninterrupted, or error-free. You acknowledge and
                accept that your use of the websites is at your sole and entire
                risk.
              </p>
              <p>
                Items listed on the mrktbox.com website may not be available or
                in-stock at all times for purchase on the website(s) or at one
                of the MRKTBOX stores. MRKTBOX reserves the right to correct,
                at any time, any pricing errors on the website(s) or in MRKTBOX
                stores. While the websites are updated regularly, prices,
                selection and availability, including the availability of
                promotional offers, may vary and are subject to change without
                notice. MRKTBOX will not be responsible for any loss or damages
                arising from such updates or changes
              </p>
              <p>
                In cases where we custom-cut, or select variable weight items
                (such as certain meats or produce or other items priced by
                weight (ie, kg/grams), the per item price you see on the
                websites is estimated based on the weight you select on the
                website. The final price of these items will be based on the
                same price per weight indicated on the website when you
                completed your checkout and submitted your order, but the final
                price is determined once we have prepared and weighed your
                order, and will appear on the invoice at the time of the
                delivery. For such products, the prices you pay are always based
                on the actual final weight of your products. If you are not
                satisfied with the final price and weight, you have the rights
                to remove the product from your order.
              </p>
              <p>
                Without limiting the generality of the forgoing, MRKTBOX
                disclaims any and all warranties and conditions - express or
                otherwise - for, nor shall MRKTBOX be held responsible for the
                quality of, any merchandise displayed on the mrktbox.com
                website.
              </p>
              <h4>Promotions</h4>
              <p>
                We may make various promotional offers from time to time. Some
                offers may be informational, web-based only and not available as
                an in-store offer or promotion. Not all offers and/or promotions
                available in store may be available on the website. We ask that
                you review the guidelines associated with each special offer, as
                they will differ.
              </p>
              <p>
                If you redeem any coupon, rewards points or gift cards, this
                will be reflected at checkout and is subject to validation and
                any redemption requirements. Manufacturers’ coupons and
                warranties are the responsibility of the individual
                manufacturers. Coupons offered by the manufacturers may each
                have relevant information about the duration and limitations of
                the coupon.
              </p>
              <p>
                For any of our coupons, in the event we have inadvertently made
                a typographical error on any coupon or special offer, we reserve
                the right to suspend redemption or terminate altogether the
                coupon or offer.
              </p>
              <p>
                We may also offer our customers the opportunity to participate
                in contests, sweepstakes or other promotions as decided by us.
                In each case, the promotion may have additional terms and
                conditions which apply in addition to these terms and
                conditions. Please review the terms and conditions associated
                with the particular promotion to determine your eligibility and
                any participation requirements.
              </p>
              <h4>Indemnification</h4>
              <p>
                By accessing any of the Services, you agree to defend, indemnify
                and hold MRKTBOX harmless from and against any and all loss,
                actions, claims, damages, costs and expenses, including legal
                fees and disbursements on a full indemnity basis, arising from
                or related to your use of this Site or any breach of this
                Agreement. This provision shall survive the termination of this
                Agreement and remain in full force and effect.
              </p>
              <h4>Limitation of Liability</h4>
              <p>
                By accessing any of the Services, you acknowledge, accept and
                agree that in no event shall MRKTBOX be liable for any damages,
                including without limitation any and all direct or indirect,
                special, incidental, compensatory, exemplary or consequential
                damages, losses or expenses, including without limitation lost
                or misdirected orders, lost profits, lost registrations, lost
                goodwill, or lost or stolen programs or other data, howsoever
                caused and under any theory of liability arising out of or in
                connection with (1) the use of the mrktbox.com or
                dundurnmarket.com site or the inability to use these sites by
                any party; (2) any failure or performance, error, omission,
                interruption, defect, delay in operation or transmission;
                and/or (3) line or system failure or the introduction of a
                computer virus, or other technical sabotage, even if MRKTBOX, its
                employees or representatives thereof, are advised of the
                possibility or likelihood of such damages, losses or expenses.
              </p>
              <h4>General Terms</h4>
              <p>
                MRKTBOX reserves the right to correct any inaccuracies or
                typographical errors in the information posted on the mrktbox.com
                website, and shall have no liability for such errors.
                Information may be changed or updated without notice and prices
                and availability of goods and services are subject to change
                without notice.
              </p>
              <p>
                In the event that any provision(s) contained within these Terms
                of Use is/are held to be invalid or unenforceable for any
                reason, such invalidity or unenforceability shall not affect the
                remainder of these Terms of Use, and these Terms of Use shall be
                construed and enforced as if the invalid or unenforceable
                term(s) or provision(s) had not been included in these Terms of
                Use.
              </p>
              <p>
                MRKTBOX failure to insist upon or enforce strict performance of
                any term(s) or provision(s) contained herein shall not be
                construed as a waiver of any term, provision, right or obligation.
              </p>
              <p>
                These Terms of Use constitute the entire agreement between
                MRKTBOX and you and govern your use of the Services, superseding
                any prior agreements between MRKTBOX and you (including, but not
                limited to, any prior versions of the Terms of Use).
              </p>
            </PageContent>
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

Terms.displayName = 'Terms'
export default Terms
