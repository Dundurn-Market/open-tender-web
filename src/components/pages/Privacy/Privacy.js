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

const Privacy = () => {
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
            <PageTitle title='Privacy Policy'/>
            <PageContent style={{ textAlign: 'left', marginTop: '3rem' }}>
              <p>
                The Privacy Policy of MRKTBOX Inc. including its brick & mortar
                stores, MRKTBOX Inc. (“MRKTBOX”), is written to assist you to
                better understand how we collect, use and store personal
                information. Since we may use this personal information to
                improve your service experience with us, we are committed to
                protecting the privacy of your personal information and the
                details of your shopping behaviour and preferences.
              </p>
              <p>
                Please note that by accessing the mrktbox.com and associated
                services (the “Services”), you are agreeing to and are bound by
                the terms of this Privacy Policy and the MRKTBOX Terms of Use.
                This policy is a binding agreement between MRKTBOX and you as
                the user of the Services.
              </p>
              <p>
                As technology and privacy laws evolve, we reserve the right to
                occasionally update this policy and will advise users of such an
                update. Your continued use of the Services after such notice is
                given constitutes acceptance of the updated policy.
              </p>
              <p>
                Your personal information will remain confidential and will not
                knowingly be disclosed to or made available to anyone outside of
                our organisation except as set out in this Privacy Policy.
                Within our organisation, only those people that require access
                to your personal information for the purposes described below
                will have access to that information.
              </p>
              <h4>Collection of Information</h4>
              <p>
                MRKTBOX will collect only such personal information from you as
                may be required to permit us to fulfil the purposes set out
                below. Such information may include your name, address, email
                address, telephone number(s), age, gender, personal interests
                and shopping or product preferences. We may collect this
                information to authenticate your identity, to improve your
                shopping experience, to understand your preferences for the
                types of products and services that we offer, to administer our
                promotions, special offers and other programs to communicate
                with you and/or to process payment for our products and
                services.
              </p>
              <p>
                We may collect additional personal information from you from
                time to time. By providing such personal information to us, by
                using the Services and/or by participating in any programs that
                we may offer from time to time, you consent to our use of
                personal information disclosed by you for the purposes
                identified above.
              </p>
              <p>
                We may also log identifiable information including IP address,
                profile information, aggregate user data, and browser type, from
                users and visitors to the mrktbox.com website. This data is used
                to manage the website, track usage and improve the website
                services. This identifiable information may also be shared with
                third parties to provide more relevant services and notices to
                users. User IP addresses may be recorded for security and
                monitoring purposes.
              </p>
              <p>
                We may also use your email address to send updates, a newsletter
                or news regarding our products or services. We will provide you
                with the option to choose not to receive emails of this type,
                while still receiving emails relevant to your specific order(s).
              </p>
              <p>
                We are committed to honest and open communication and will make
                your personal information available to you upon request.
              </p>
              <h4>Children</h4>
              <p>
                MRKTBOX does not intend to collect any personal information from
                children under the age of sixteen. If a parent or guardian of a
                child who has provided us with such personal information wishes
                to have such information deleted from our records, he or she
                should contact us at the email address listed at the bottom of
                this Privacy Policy. We will then take all necessary measures to
                delete the child's personal information from our files.
              </p>
              <h4>Use of Cookies</h4>
              <p>
                Cookies are small amounts of data that may include a unique
                identifier. These are sent to your browser from a website and
                stored on your device. Each device that accesses our Services is
                assigned a different cookie by us. Specifically, MRKTBOX may use
                cookies to store visitors' preferences and to record session
                information, to ensure that visitors are not repeatedly offered
                the same page content and to customise newsletter, promotional,
                and Web page content based on browser type and user information.
                You may be able to configure your browser to accept or reject
                all or some cookies, or notify you when a cookie is set -- each
                browser is different, so check the "Help" menu of your browser
                to learn how to change your cookie preferences -- however, you
                may be required to enable cookies from us in order to use most
                functions on the mrktbox.com website.
              </p>
              <h4>Links</h4>
              <p>
                Any personal information that we do collect is for internal
                purposes only. We do not sell or share your personal information
                with any external organisation except to authorised electronic
                commerce service providers to process online payment, and to
                authorised call centres who will provide service to you in
                connection with our services and programs. You will be subject
                to the privacy policies of such service providers; however, we
                will strive to ensure that such policies offer a level of
                privacy protection of your personal information that is
                comparable to this policy.
              </p>
              <h4>Disclosure of Personal Information</h4>
              <p>
                Notwithstanding the above, MRKTBOX may disclose personal
                information to a third party if such disclosure is necessary:
                (1) to conform to legal requirements or to respond to a
                subpoena, search warrant or other legal process received by us,
                whether or not a response is required by applicable law(s); (2)
                to enforce the Terms of Use of any program or to protect our
                rights; or (3) to protect the safety of members of the public
                and users of the mrktbox.com website. We reserve the right to
                disclose personal information to any prospective successor in
                interest that is in good faith contemplating the acquisition of
                our business or substantially all of our assets. We further
                reserve the right to transfer all such personal information to
                such prospective successor in interest in the event of a sale,
                amalgamation, continuance or other transfer or conveyance of our
                business or substantially all of our assets.
              </p>
              <h4>Retention and Safeguarding Your Personal Information</h4>
              <p>
                MRKTBOX will retain your personal information for as long as it
                is required to fulfil our obligations to you as our customer. We
                will take all necessary and reasonable measures to safeguard
                that information from any unauthorised access. We use
                industry-standard encryption technology and advanced firewall
                systems to deter unwanted intruders.
              </p>
              <p>
                As even the most sophisticated systems can be vulnerable, our
                policy is to delete information on our system that would benefit
                anyone other than you and us. We use Braintree (a PayPal
                service), a to store and retain credit card information. As
                such, no credit card information is stored in any of our
                databases, thereby eliminating the possibility of improper or
                unauthorised access to your credit card information from our
                databases. Hard copies of your personal information are stored
                in a secure area at our offices and are only made available to
                authorised personnel.
              </p>
              <h4>
                Who Is Accountable to Ensure That Information Is Kept
                Confidential?
              </h4>
              <p>
                While our entire company is committed to respecting and
                safeguarding your personal privacy, MRKTBOX’s Privacy Officer is
                specifically responsible for ensuring that your personal
                information remains confidential.
              </p>
              <h4>Access to Your Personal Information Held by MRKTBOX</h4>
              <p>
                We are committed to keeping you informed and to ensuring the
                accuracy of your personal information. At your request, we will
                provide you with details of all of your personal information in
                our possession, what it is being used for, and to whom it has
                been disclosed. In some limited cases, we may be unable to
                access or provide some specific information. We will provide you
                with a reasonable rationale for any inability to release
                information.
              </p>
              <p>
                You may send us a written request requiring that your personal
                information be deleted from our databases, or you may request
                that your personal information be updated or corrected to
                rectify any inaccuracies.
              </p>
              <p>
                Ultimately, if you are dissatisfied with our Privacy Policy or
                the Services in general, you may discontinue use of the Services
                at any time and request that we delete your personal information
                from our systems.
              </p>
              <h4>Contacting Us</h4>
              <p>
                Should you have any questions or complaints about MRKTBOX's
                Privacy Policy or privacy practices, or should you wish to
                amend, delete or update your personal information, please
                contact us at hello@mrktbox.com, or at the following address:
                MRKTBOX Inc., 460 York Blvd, L8R 3J8, Hamilton, Ontario, Canada.
                All written requests will be reviewed by our Privacy Officer and
                will be responded to within a reasonable time frame.
              </p>
            </PageContent>
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

Privacy.displayName = 'Accessibility'
export default Privacy
