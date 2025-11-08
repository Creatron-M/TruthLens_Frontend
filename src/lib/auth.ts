/**
 * Authentication utilities for wallet-based access control
 */

/**
 * Verify if wallet is connected and redirect accordingly
 * @param isConnected - Current wallet connection status
 * @param account - Current wallet account
 * @param targetPath - The path user wants to access (default: /dashboard)
 * @returns boolean - true if can proceed, false if should show connection prompt
 */
export function verifyWalletAccess(
  isConnected: boolean,
  account: string | null,
  targetPath: string = "/dashboard"
): boolean {
  // If wallet is connected and has account, allow access
  if (isConnected && account) {
    return true;
  }

  // If not connected, deny access to protected routes
  return false;
}

/**
 * Handle navigation to dashboard with wallet verification
 * @param isConnected - Current wallet connection status
 * @param account - Current wallet account
 * @param router - Next.js router instance
 * @param targetPath - Target dashboard path
 */
export function navigateWithWalletCheck(
  isConnected: boolean,
  account: string | null,
  router: any,
  targetPath: string = "/dashboard"
) {
  if (verifyWalletAccess(isConnected, account, targetPath)) {
    router.push(targetPath);
  } else {
    // Show wallet connection prompt or stay on current page
    return false;
  }
}

/**
 * Get appropriate href based on wallet status
 * Returns dashboard link if connected, null if not (to trigger connection)
 */
export function getProtectedHref(
  isConnected: boolean,
  account: string | null,
  targetPath: string = "/dashboard"
): string | null {
  if (verifyWalletAccess(isConnected, account, targetPath)) {
    return targetPath;
  }
  return null; // Will be handled by click handler instead
}
