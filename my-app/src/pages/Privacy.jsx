import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon, EyeIcon, CircleStackIcon, CogIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Registration
          </Link>
          
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Effective Date: January 1, 2024
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Our Commitment to Privacy</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              At CollabNest, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our collaborative workspace platform. We are committed to 
              protecting your personal data and being transparent about our practices.
            </p>
          </section>
         
          {/* Disclaimer Section */}
          <div className="mb-8">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">⚠️</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-amber-300 font-semibold text-lg">Project Disclaimer</h3>
                  <p className="text-amber-200 text-sm leading-relaxed">
                    <strong>Note:</strong> This is a project by  <a 
                        href="https://github.com/Arun-kushwaha007" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-100 font-medium hover:text-amber-50 underline decoration-amber-300 hover:decoration-amber-200 transition-all duration-200"
                      >
                        Arun Kushwaha
                      </a>
                    This is not an official or registered website/service. These Privacy Policy and Terms of Service are provided 
                    for user acknowledgment and educational purposes as part of a development project demonstration.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-amber-400 text-xs">📚 Educational Project</span>
                    <span className="text-amber-500">•</span>
                    <span className="text-amber-400 text-xs">🚧 Demo Purposes</span>
                    <span className="text-amber-500">•</span>
                    <span className="text-amber-400 text-xs">👨‍💻 Portfolio Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                <CircleStackIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h4 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  Personal Information
                </h4>
                <ul className="text-blue-200 text-sm space-y-2">
                  <li>• Name and email address</li>
                  <li>• Profile information you provide</li>
                  <li>• Account credentials (encrypted)</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
                  <span className="text-lg">💻</span>
                  Usage Information
                </h4>
                <ul className="text-green-200 text-sm space-y-2">
                  <li>• Log data and analytics</li>
                  <li>• Device and browser information</li>
                  <li>• IP address and location data</li>
                  <li>• Feature usage patterns</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                <CogIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p>We use the information we collect for the following purposes:</p>
              
              <div className="grid gap-4">
                <div className="bg-muted border border-border rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">🚀 Service Provision</h4>
                  <p className="text-muted-foreground text-sm">
                    To provide, maintain, and improve our collaborative workspace features, including task management, 
                    team communication, and project organization tools.
                  </p>
                </div>
                
                <div className="bg-muted border border-border rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">🔒 Security & Authentication</h4>
                  <p className="text-muted-foreground text-sm">
                    To verify your identity, secure your account, prevent fraud, and protect against unauthorized access 
                    to your personal and organizational data.
                  </p>
                </div>
                
                <div className="bg-muted border border-border rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">📈 Analytics & Improvement</h4>
                  <p className="text-muted-foreground text-sm">
                    To analyze usage patterns, optimize performance, and develop new features that enhance your 
                    collaboration experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                {/* <UserShieldIcon className="w-4 h-4 text-white" /> */}
              </div>
              <h2 className="text-2xl font-bold text-white">Information Sharing</h2>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-4">
              <h4 className="text-yellow-300 font-semibold mb-2">🛡️ Our Promise</h4>
              <p className="text-yellow-200 text-sm">
                We do not sell, trade, or rent your personal information to third parties. Your data is shared only in 
                the limited circumstances outlined below.
              </p>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <h4 className="font-semibold text-white">We may share your information when:</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You explicitly consent to the sharing</li>
                <li>Required by law or legal process</li>
                <li>Necessary to protect our rights or safety</li>
                <li>With service providers who help operate our platform (under strict agreements)</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Data Security</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>• End-to-end encryption for sensitive data</li>
                  <li>• Secure HTTPS connections</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Multi-factor authentication support</li>
                  <li>• Limited employee access to user data</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">🏆 Certifications</h4>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>• SOC 2 Type II Compliant</li>
                  <li>• GDPR Compliant</li>
                  <li>• ISO 27001 Certified</li>
                  <li>• Regular penetration testing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                <EyeIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your Privacy Rights</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-secondary/30 border border-primary/20 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Access & Control</h4>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• View your personal data</li>
                  <li>• Update your information</li>
                  <li>• Download your data</li>
                  <li>• Delete your account</li>
                </ul>
              </div>
              
              <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4">
                <h4 className="text-pink-300 font-semibold mb-2">Privacy Controls</h4>
                <ul className="text-pink-200 text-sm space-y-1">
                  <li>• Opt-out of communications</li>
                  <li>• Manage cookie preferences</li>
                  <li>• Control data sharing</li>
                  <li>• Request data portability</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies & Tracking */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🍪</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Cookies & Tracking</h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies to enhance your experience and analyze usage patterns.
            </p>
            
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-orange-300 font-semibold mb-2">Cookie Types</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-orange-200 font-medium">Essential</p>
                  <p className="text-orange-100">Required for basic functionality</p>
                </div>
                <div>
                  <p className="text-orange-200 font-medium">Analytics</p>
                  <p className="text-orange-100">Help us improve our service</p>
                </div>
                <div>
                  <p className="text-orange-200 font-medium">Preferences</p>
                  <p className="text-orange-100">Remember your settings</p>
                </div>
              </div>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                <GlobeAltIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">International Data Transfers</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of your state, province, 
              country, or other governmental jurisdiction. We ensure appropriate safeguards are in place to protect your 
              data in accordance with this Privacy Policy and applicable laws.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📧</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Contact Us About Privacy</h2>
            </div>
            <div className="bg-muted border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Privacy Officer:</p>
                  <p className="text-primary">privacy@collabnest.com</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data Protection:</p>
                  <p className="text-primary">dpo@collabnest.com</p>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Last updated: January 1, 2024 • We may update this policy and will notify you of significant changes
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/register"
            className="bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.01] shadow-lg hover:shadow-xl text-center"
          >
            I Understand - Continue Registration
          </Link>
          <Link
            to="/terms"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center"
          >
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;