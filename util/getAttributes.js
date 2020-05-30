/**
 * Utility function used for passing through any attributes on a functional
 * component, while also grabbing the `data-v-{x}` attribute created by scoped
 * styles.
 * @param {Object} context - See
 *   https://vuejs.org/v2/guide/render-function.html#Functional-Components
 * @param {Object?} options - Additional properties to merge
 */
const getAttributes = (context, options = {}) => {
  const { data, parent } = context;
  return {
    ...(parent.$options._scopeId ? { [parent.$options._scopeId]: '' } : {}),
    ...data.attrs,
    ...options,
  };
};

export default getAttributes;
