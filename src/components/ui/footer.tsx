import { Button } from "@/components/ui/button"

interface FooterProps {
  logo: React.ReactNode
  brandName: string
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href: string
    label: string
  }>
  onPrivacyPolicyClick?: () => void
  onTermsOfServiceClick?: () => void
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  onPrivacyPolicyClick,
  onTermsOfServiceClick,
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-3 pt-8 sm:pb-4 sm:pt-10 md:pb-6 md:pt-12 lg:pb-8 lg:pt-24 bg-red-900 dark:bg-gray-800 text-foreground">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <a
            href="/"
            className="flex items-center gap-x-2"
            aria-label={brandName}
          >
            {logo}
            <span className="font-bold text-base sm:text-lg md:text-xl">{brandName}</span>
          </a>
          <ul className="flex list-none sm:mt-0 space-x-1.5 sm:space-x-2 md:space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-border mt-4 pt-4 sm:mt-5 sm:pt-5 md:mt-6 md:pt-6 grid grid-cols-10">
          <nav className="hidden sm:block lg:mt-0 lg:col-[4/11] col-[4/11]">
            <ul className="list-none flex flex-wrap -my-0.5 -mx-1.5 sm:-my-1 sm:-mx-2 justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-0.5 mx-1.5 sm:my-1 sm:mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-[11px] sm:text-xs md:text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-0 lg:col-[4/11] col-[4/11]">
            <ul className="list-none flex flex-wrap -my-0.5 -mx-1.5 sm:-my-1 sm:-mx-2 md:-mx-3 justify-end">
              {onPrivacyPolicyClick && (
                <li className="my-0.5 mx-1.5 sm:my-1 sm:mx-2 md:mx-3 shrink-0">
                  <button
                    onClick={onPrivacyPolicyClick}
                    className="text-[11px] sm:text-xs md:text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
              )}
              {onTermsOfServiceClick && (
                <li className="my-0.5 mx-1.5 sm:my-1 sm:mx-2 md:mx-3 shrink-0">
                  <button
                    onClick={onTermsOfServiceClick}
                    className="text-[11px] sm:text-xs md:text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
              )}
            </ul>
          </div>
          <div className="mt-3 sm:mt-4 md:mt-6 text-[10px] sm:text-xs md:text-sm leading-5 sm:leading-6 text-muted-foreground lg:mt-0 lg:row-[1/3] lg:col-[1/4] row-[1/3] col-[1/4]">
            <div className="break-words sm:break-normal">{copyright.text}</div>
            {copyright.license && <div className="break-words sm:break-normal mt-1">{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  )
}
