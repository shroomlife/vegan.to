import { useRoute, useRouter } from 'vue-router'
import { scrollToHash, scrollToTop } from '@/utils/scroll'

/**
 * RouterLink ignores a click on the location you are already on. Visitors still
 * expect the logo to bring them to the top and "Zahlen" to scroll to the numbers,
 * so same-location clicks scroll manually.
 */
export function useAnchorNavigation() {
  const router = useRouter()
  const route = useRoute()

  function onNavClick(to: string): void {
    const target = router.resolve(to)
    if (target.fullPath !== route.fullPath) return
    if (target.hash) {
      scrollToHash(target.hash)
    } else {
      scrollToTop()
    }
  }

  return { onNavClick }
}
