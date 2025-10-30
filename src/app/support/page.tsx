'use client'

import { usePage } from './usePage'
import { PageView } from './page.view'

export default function PagePage() {
  const vm = usePage()
  return <PageView {...vm} />
}

