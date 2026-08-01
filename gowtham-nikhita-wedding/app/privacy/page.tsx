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
      <p>This Privacy Policy describes how Gowtham Ramesh (&ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, and protects personal information submitted through this wedding website (<strong>gowthamandnikhita.com</strong>) in connection with our wedding event on February 17–18, 2027.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Information We Collect</h2>
      <p>We collect the following information directly from guests:</p>
      <ul style={{ paddingLeft: 24, marginTop: 8 }}>
        <li>Name and phone number (optional, so we can reach you about wedding logistics)</li>
        <li>Email address (optional, for RSVP confirmation)</li>
        <li>RSVP responses and meal preferences</li>
      </ul>
      <p style={{ marginTop: 12 }}>We do not collect information through cookies, tracking pixels, or any automated data collection beyond standard server logs.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>How We Use Your Information</h2>
      <p>Your personal information is used solely to coordinate our wedding event — sending invitations, collecting RSVPs, and providing guests with event details. We do not use your information for any marketing or commercial purpose.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Sharing</h2>
      <p><strong>We do not sell, rent, share, or disclose your personal information or phone number to any third parties for marketing or any other purpose.</strong></p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Retention</h2>
      <p>Personal information and phone numbers are retained only for the duration of the wedding event and its immediate follow-up communications. Data will not be used beyond that purpose.</p>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: 36, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at the email below.</p>

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
