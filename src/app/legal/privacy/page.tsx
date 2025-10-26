'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name and email address when you create an account</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Horse data you upload (names, pedigrees, performance records)</li>
                  <li>Usage data and analytics to improve our service</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Data Minimization</h3>
                <p className="text-gray-700">
                  We only collect data that is necessary for our service. We do not collect more information than needed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Provide and improve our equine data services</li>
                <li>Generate AI-powered breeding recommendations</li>
                <li>Send you important updates about your horses</li>
                <li>Process payments and manage your subscription</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Sharing and Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">We DO NOT sell your personal data</h3>
                <p className="text-gray-700 mb-4">
                  We may share data only in these limited circumstances:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>With your explicit consent</li>
                  <li>With service providers who help us operate (Supabase, Stripe, etc.)</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In anonymized, aggregated form for research</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Your Rights (GDPR/CCPA Compliant)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Access & Portability</h3>
                  <p className="text-gray-700">Download all your data in CSV/PDF format</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Correction</h3>
                  <p className="text-gray-700">Update or correct your information anytime</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Deletion</h3>
                  <p className="text-gray-700">Request complete deletion of your account and data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Opt-out</h3>
                  <p className="text-gray-700">Unsubscribe from marketing emails anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>All data encrypted in transit and at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure (Supabase, Vercel)</li>
                <li>Regular backups with encryption</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. AI and Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Automated Processing</h3>
                <p className="text-gray-700 mb-4">
                  We use AI to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Audit and verify horse data for accuracy</li>
                  <li>Generate breeding recommendations</li>
                  <li>Predict health risks and performance trends</li>
                  <li>Scrub public data sources (Equibase, AQHA)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Opt-out of AI Processing</h3>
                <p className="text-gray-700">
                  You can opt-out of AI processing in your account settings. This may limit some features.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  We use essential cookies for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Authentication and security</li>
                  <li>Remembering your preferences</li>
                  <li>Basic analytics to improve our service</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Optional Cookies</h3>
                <p className="text-gray-700">
                  You can opt-out of non-essential cookies in your browser settings or our cookie preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                For privacy-related questions or to exercise your rights:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@horse.ai</p>
                <p><strong>Data Protection Officer:</strong> dpo@horse.ai</p>
                <p><strong>Response Time:</strong> Within 30 days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may update this privacy policy. We'll notify you of significant changes via email or in-app notification.
                Your continued use of our service constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
