import { useDocumentTitle } from '../hooks/useUtils'
import ErrorState from '../components/feedback/ErrorState'

export default function NotFoundPage() {
  useDocumentTitle('صفحه پیدا نشد')
  return <ErrorState status={404} />
}
