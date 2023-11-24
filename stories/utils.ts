export const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};
