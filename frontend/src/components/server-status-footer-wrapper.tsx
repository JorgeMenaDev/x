'use client'

import { ServerStatusFooter } from './server-status-footer'

/**
 * Client component wrapper for the ServerStatusFooter
 * This helps with proper client/server component boundary
 */
export function ServerStatusFooterWrapper() {
	return <ServerStatusFooter />
}
