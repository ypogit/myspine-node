import { HelmetOptions } from "helmet"

export const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    // Mitigate XXS and others attacks
    directives: {
      // Only page load scripts with a matching none value are allowed to execute
      scriptSrc: ["'self'", "'nonce-<random>'"],
      styleSrc: ["'self'", "'nonce-<random>'"],
      mediaSrc: ["'self'"],
      frameAncestors: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: { policy: 'require-corp' },
  /**
   * Controls what resources can be loaded x-origin
   * Requires CORS for all x-origin resources loaded within the page's content
   */
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  /**
   * Protect against x-origin window and iframes related attacks
   * Allow document to be accessed by documents from the same origin
   * And allow document from x-origin iframes to open popups
   */
  crossOriginResourcePolicy: { policy: 'same-origin' }, // Browser blocks no x-origin/ x-site requests to the same origin
  strictTransportSecurity: { 
    preload: true // Add HSTS policy to browser
  },
  xPoweredBy: false, // Remove xPowered by that Express.js sets by default and obscure tech stack slowing down the recon phase of the attack
  xFrameOptions: {
    action: 'sameorigin'
  }
}

/**
 *  
  Default CSP directives values
    default-src: 'self'
    base-uri: 'self'
    font-src: 'self' https: data:
    form-action: 'self'
    frame-ancestors: 'self'
    img-src: 'self' data:
    object-src: 'none'
    script-src: 'self'
    script-src-attr: 'none'
    style-src: 'self' https: 'unsafe-inline'
    upgrade-insecure-requests

  Default strictTransportSecurity values
    maxAge: 155520000 (180 days)
    includeSubdomains: true

  Other default options
    xContentTypeOptions: nosniff
    xDnsPrefetchControl: off
    xXssProtection: 0
    referrerPolicy: 'same-origin'
 */
