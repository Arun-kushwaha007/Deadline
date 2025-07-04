import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, DocumentTextIcon, ShieldCheckIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Registration
          </Link>
          
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <DocumentTextIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg">
            {/* Effective Date: January 1, 2024 */}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Introduction</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Welcome to CollabNest! These Terms of Service ("Terms") govern your use of our collaborative workspace platform. 
              By accessing or using CollabNest, you agree to be bound by these Terms. If you disagree with any part of these 
              terms, then you may not access the Service.
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
          This is not an official or registered website/service. These Terms of Service and Privacy Policy are provided 
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
          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                <strong>Important:</strong> These terms constitute a legally binding agreement between you and CollabNest.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">User Accounts</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are responsible for safeguarding your account credentials</li>
                <li>You must not share your account with unauthorized persons</li>
                <li>You must notify us immediately of any breach of security</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Acceptable Use Policy</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>You agree not to use CollabNest for any unlawful purpose or in any way that could damage, disable, or impair the service.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-300 font-semibold mb-2">Prohibited Activities:</h4>
                  <ul className="text-red-200 text-sm space-y-1">
                    <li>• Harassment or abuse of other users</li>
                    <li>• Sharing malicious content or malware</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Attempting to hack or compromise security</li>
                  </ul>
                </div>
                
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">Encouraged Uses:</h4>
                  <ul className="text-green-200 text-sm space-y-1">
                    <li>• Collaborative team projects</li>
                    <li>• Professional communication</li>
                    <li>• Educational activities</li>
                    <li>• Creative collaboration</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Privacy & Data Protection</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your privacy is important to us. We collect and use your information in accordance with our Privacy Policy. 
              By using our service, you consent to the collection and use of information as outlined in our Privacy Policy.
            </p>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              View Privacy Policy
              <ArrowLeftIcon className="w-4 h-4 rotate-180" />
            </Link>
          </section>

          {/* Service Availability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <GlobeAltIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Service Availability</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>We strive to provide reliable service, but cannot guarantee 100% uptime. We reserve the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or discontinue features with reasonable notice</li>
                <li>Perform maintenance that may temporarily affect service</li>
                <li>Suspend accounts that violate these terms</li>
                <li>Update these terms with advance notification</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚖️</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Limitation of Liability</h2>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm leading-relaxed">
                CollabNest is provided "as is" without warranties of any kind. We shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📧</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            </div>
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Email:</p>
                  <p className="text-orange-400">legal@collabnest.com</p>
                </div>
                <div>
                  <p className="text-gray-400">Address:</p>
                  <p className="text-gray-300">CollabNest Inc.<br />123 Innovation Drive<br />Tech City, TC 12345</p>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center pt-6 border-t border-gray-600">
            <p className="text-gray-400 text-sm">
              Last updated: January 1, 2024 • These terms are effective immediately upon posting
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/register"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-center"
          >
            I Accept - Continue Registration
          </Link>
          <Link
            to="/login"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;