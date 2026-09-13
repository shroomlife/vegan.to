// Module augmentation: this file must stay a module (the import does that),
// otherwise the declaration would replace vue-router's own types.
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Document title set after each navigation */
    title?: string
    /** Meta description, also copied into the Open Graph tags */
    description?: string
  }
}
