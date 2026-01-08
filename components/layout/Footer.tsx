import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-50 border-t border-gray-200"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              University Examination System
            </span>
            <p className="mt-4 text-xs text-gray-500 max-w-sm leading-relaxed">
              This system is authorized for use by registered students and staff
              only. Unauthorized access or use of this system is strictly
              prohibited and may result in disciplinary action and/or criminal
              prosecution. All activities are monitored and recorded.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 tracking-wider uppercase">
              Legal & Compliance
            </h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  Security Statement
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 tracking-wider uppercase">
              Support
            </h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  Technical Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-xs text-center text-gray-400">
            &copy; {currentYear} University Examination System. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
