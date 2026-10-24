import { useRouteError } from 'react-router'
import { useDocumentTitle } from '../hooks/useUtils'
import Header from '../components/layout/Header'
import ErrorState from '../components/feedback/ErrorState'

export default function RouteErrorPage() {
  const error = useRouteError()
  useDocumentTitle('خطا')
  return (
    <>
      <Header />
      <main className="site-main">
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </main>
    </>
  )
}
