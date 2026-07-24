import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy · Gowtham & Nikhita',
  robots: 'index, follow',
}

export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px 80px', fontFamily: 'Georgia, serif', lineHeight: 1.8, color: '#1a1a1a' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#666', marginBottom: 40, fontSize: '0.9rem' }}>
        Gowtham &amp; Nikhita Wedding · gowthamandnikhita.com · Effective June 2026
      </p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</h2>
      <p>This Privacy Policy describes how Gowtham Ramesh (&ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, and protects personal information submitted through this wedding website (<strong>gowthamandnikhita.com</strong>) and any SMS communications sent in connection with our wedding event on February 17–18, 2027.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Information We Collect</h2>
      <p>We collect the following information directly from guests:</p>
      <ul style={{ paddingLeft: 24, marginTop: 8 }}>
        <li>Name and phone number (provided directly by guests for SMS communications)</li>
        <li>Email address (optional, for RSVP confirmation)</li>
        <li>RSVP responses and meal preferences</li>
      </ul>
      <p style={{ marginTop: 12 }}>We do not collect information through cookies, tracking pixels, or any automated data collection beyond standard server logs.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SMS Messaging Program</h2>
      <p>Guests who opt in via the consent checkbox on our RSVP form agree to receive SMS text messages from Gowtham Ramesh regarding our wedding event. Messages may include:</p>
      <ul style={{ paddingLeft: 24, marginTop: 8 }}>
        <li>Initial wedding invitation with RSVP link</li>
        <li>RSVP deadline reminders</li>
        <li>Day-of logistics and event updates</li>
      </ul>
      <p style={{ marginTop: 12 }}><strong>Message frequency:</strong> Low — typically 1 to 3 messages total. This is not a recurring subscription service.</p>
      <p style={{ marginTop: 8 }}><strong>Message and data rates may apply</strong> depending on your mobile carrier and plan.</p>
      <p style={{ marginTop: 12 }}>
        <strong>To opt out:</strong> Reply <strong>STOP</strong> to any SMS message at any time. You will receive a confirmation and no further messages will be sent.<br />
        <strong>For help:</strong> Reply <strong>HELP</strong> to any message or email us at <a href="mailto:gowtham7ramesh@gmail.com" style={{ color: '#8B6838' }}>gowtham7ramesh@gmail.com</a>.
      </p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>How We Use Your Information</h2>
      <p>Your personal information is used solely to coordinate our wedding event — sending invitations, collecting RSVPs, and providing guests with event details. We do not use your information for any marketing or commercial purpose.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Sharing</h2>
      <p><strong>We do not sell, rent, share, or disclose your personal information or phone number to any third parties for marketing or any other purpose.</strong> Phone numbers collected for SMS messaging will not be shared with third parties.</p>
      <p style={{ marginTop: 8 }}>We use Twilio as our SMS delivery provider solely for the purpose of sending the messages described above. Twilio acts as a data processor and is bound by its own privacy policies.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Retention</h2>
      <p>Personal information and phone numbers are retained only for the duration of the wedding event and its immediate follow-up communications. Data will not be used beyond that purpose.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at the email below. To stop receiving SMS messages, reply <strong>STOP</strong> to any message.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h2>
      <p>
        Gowtham Ramesh<br />
        <a href="mailto:gowtham7ramesh@gmail.com" style={{ color: '#8B6838' }}>gowtham7ramesh@gmail.com</a><br />
        gowthamandnikhita.com
      </p>

      <p style={{ marginTop: 48, fontSize: '0.85rem', color: '#999' }}>
        Also see our <a href="/terms" style={{ color: '#8B6838' }}>Terms &amp; Conditions</a>.
      </p>
    </main>
  )
}
