import { useQuery } from '@tanstack/react-query'
import { fetchArticle, fetchArticles } from '../api/articles'
import { keys } from '../../../shared/hooks/queryKeys'

const HOUR = 60 * 60 * 1000

export const useArticles = () =>
  useQuery({ queryKey: keys.articles, queryFn: ({ signal }) => fetchArticles(signal), staleTime: HOUR })

export const useArticle = (slug) =>
  useQuery({
    queryKey: keys.article(slug),
    queryFn: ({ signal }) => fetchArticle(slug, signal),
    staleTime: HOUR,
    retry: false,
  })
