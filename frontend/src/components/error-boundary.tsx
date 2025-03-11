'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('Error caught by ErrorBoundary:', error)
		console.error('Component stack:', errorInfo.componentStack)
	}

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className='p-4 border border-red-300 bg-red-50 rounded-md'>
					<h2 className='text-lg font-medium text-red-800 mb-2'>Something went wrong</h2>
					<p className='text-red-700 mb-4'>{this.state.error?.message || 'An unexpected error occurred'}</p>
					<details className='mt-2'>
						<summary className='text-sm text-red-700 cursor-pointer'>Technical details</summary>
						<pre className='mt-2 text-xs bg-red-100 p-2 rounded overflow-auto'>
							{this.state.error?.stack || 'No stack trace available'}
						</pre>
					</details>
					<button
						className='mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
						onClick={() => this.setState({ hasError: false, error: null })}
					>
						Try again
					</button>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
