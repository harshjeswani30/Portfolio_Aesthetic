import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsOfService({ open, onOpenChange }: TermsOfServiceProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] px-6 py-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground mb-3">
                By accessing and using this portfolio website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your access to and use of this website. By using this website, you agree to comply with and be bound by these Terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Use License</h3>
              <p className="text-muted-foreground mb-3">
                Permission is granted to temporarily access and view the materials on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                This license shall automatically terminate if you violate any of these restrictions and may be terminated at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Intellectual Property Rights</h3>
              <p className="text-muted-foreground mb-3">
                All content, features, and functionality on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, are the property of the website owner or its content suppliers and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on this website without prior written permission.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. User Conduct</h3>
              <p className="text-muted-foreground mb-3">
                You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                <li>Harassing or causing distress or inconvenience to any person</li>
                <li>Transmitting obscene or offensive content</li>
                <li>Disrupting the normal flow of dialogue within the website</li>
                <li>Attempting to gain unauthorized access to any portion of the website</li>
                <li>Using automated systems to access the website without permission</li>
                <li>Introducing viruses, trojans, worms, or other malicious code</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Disclaimer</h3>
              <p className="text-muted-foreground mb-3">
                The materials on this website are provided on an 'as is' basis. The website owner makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="text-muted-foreground">
                Further, the website owner does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on this website or otherwise relating to such materials or on any sites linked to this website.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Limitations of Liability</h3>
              <p className="text-muted-foreground mb-3">
                In no event shall the website owner or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website, even if the website owner or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
              <p className="text-muted-foreground">
                Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Accuracy of Materials</h3>
              <p className="text-muted-foreground">
                The materials appearing on this website could include technical, typographical, or photographic errors. The website owner does not warrant that any of the materials on its website are accurate, complete, or current. The website owner may make changes to the materials contained on its website at any time without notice. However, the website owner does not make any commitment to update the materials.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Links to Third-Party Websites</h3>
              <p className="text-muted-foreground mb-3">
                This website may contain links to third-party websites that are not owned or controlled by the website owner. The website owner has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites.
              </p>
              <p className="text-muted-foreground">
                By using this website, you expressly relieve the website owner from any and all liability arising from your use of any third-party website. You acknowledge and agree that the website owner shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such third-party websites.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">9. Modifications to Terms</h3>
              <p className="text-muted-foreground">
                The website owner may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service. It is your responsibility to review these Terms periodically for any changes.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">10. Governing Law</h3>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">11. Severability</h3>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect and enforceable.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">12. Contact Information</h3>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact me through the contact form on this website or via the email address provided in the contact section.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

