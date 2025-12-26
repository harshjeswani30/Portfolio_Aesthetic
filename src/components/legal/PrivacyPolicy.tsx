import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicy({ open, onOpenChange }: PrivacyPolicyProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] px-6 py-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold mb-3">1. Introduction</h3>
              <p className="text-muted-foreground mb-3">
                Welcome to my portfolio website. I am committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how I collect, use, disclose, and safeguard your information when you visit my website.
              </p>
              <p className="text-muted-foreground">
                By using this website, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use this website.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Information I Collect</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">2.1 Information You Provide</h4>
                  <p className="text-muted-foreground">
                    When you contact me through the contact form or email, I may collect:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
                    <li>Your name</li>
                    <li>Your email address</li>
                    <li>Any message or content you send</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2.2 Automatically Collected Information</h4>
                  <p className="text-muted-foreground">
                    When you visit this website, certain information may be automatically collected, including:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. How I Use Your Information</h3>
              <p className="text-muted-foreground mb-3">
                I use the information I collect for the following purposes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve and optimize the website's performance and user experience</li>
                <li>To analyze website usage and trends</li>
                <li>To ensure the security and integrity of the website</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Information Sharing and Disclosure</h3>
              <p className="text-muted-foreground mb-3">
                I do not sell, trade, or rent your personal information to third parties. I may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> I may share information with trusted service providers who assist in operating the website, conducting business, or serving users, as long as they agree to keep this information confidential.</li>
                <li><strong>Legal Requirements:</strong> I may disclose information if required by law or in response to valid requests by public authorities.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Data Security</h3>
              <p className="text-muted-foreground">
                I implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and I cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Cookies and Tracking Technologies</h3>
              <p className="text-muted-foreground mb-3">
                This website may use cookies and similar tracking technologies to enhance your experience. Cookies are small data files stored on your device that help improve website functionality and analyze usage patterns.
              </p>
              <p className="text-muted-foreground">
                You can control cookie preferences through your browser settings. However, disabling cookies may affect the functionality of certain features on the website.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Your Rights</h3>
              <p className="text-muted-foreground mb-3">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to object to processing of your information</li>
                <li>The right to data portability</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, please contact me using the information provided in the contact section.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Third-Party Links</h3>
              <p className="text-muted-foreground">
                This website may contain links to third-party websites. I am not responsible for the privacy practices or content of these external sites. I encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">9. Children's Privacy</h3>
              <p className="text-muted-foreground">
                This website is not intended for individuals under the age of 13. I do not knowingly collect personal information from children under 13. If you believe I have collected information from a child under 13, please contact me immediately.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">10. Changes to This Privacy Policy</h3>
              <p className="text-muted-foreground">
                I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">11. Contact Information</h3>
              <p className="text-muted-foreground">
                If you have any questions or concerns about this Privacy Policy or my data practices, please contact me through the contact form on this website or via the email address provided in the contact section.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

