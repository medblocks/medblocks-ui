import {
  querySelectorAllDeep,
  querySelectorDeep,
} from 'query-selector-shadow-dom';
import type { AxiosInstance } from 'axios';
import type { SearchFunction } from '../codedtext/searchFunctions';
import type { StoragePlugin } from '../multimedia/mediaFunction';
import {
  count,
  transform,
  type ProcessedTree,
  type Tree,
} from '../../../utils';

interface MBElement extends HTMLElement {
  isMbElement?: boolean;
  isRepeatable?: boolean;
  path?: string;
  tagName: string;
}

export interface MBComposition {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}

interface MBElementConfig {
  TEXT_AREA?: string[];
  MB_VALUESET?: string[];
  // Add other config properties as needed
}
export const expandFhirValueSet = async (
  axios: AxiosInstance,
  valueSetUrl: string,
  query: string,
  fhirServer = '/fhir'
) => {
  const response = await axios.get(
    `${fhirServer}/ValueSet/$expand?url=${valueSetUrl}&filter=${query}`
  );
  const fhirValues = response.data.expansion?.contains;
  return fhirValues.map(
    (value: { code: string; display: string; system: string }) => ({
      code: value.code,
      value: value.display,
      terminology: value.system,
    })
  );
};

// Needs to be redefined to use the new search API
const searchPluginFromValueSet: SearchFunction = async options => {
  const { searchString, terminology, axios } = options;
  const searchTerm = searchString;
  const valueSetUri = terminology?.includes('$expand?url=')
    ? terminology.split('$expand?url=')[1]
    : terminology;
  if (!searchTerm || !valueSetUri) return [];
  try {
    const fhirValues = await expandFhirValueSet(
      axios as AxiosInstance,
      valueSetUri,
      searchTerm
    );
    return fhirValues;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (e: any) {
    console.error(e);
    if (e.response?.status === 404) {
      return e;
    }
    throw e;
  }
};

const storageAPI: StoragePlugin = {
  upload: async ({ file, axios }) => {
    const form = new FormData();
    form.append('file', file);
    form.append('key', `${Date.now()}-${encodeURIComponent(file.name)}`);
    form.append('type', file.type);
    const response = await axios.post('/api/s3', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const key = response.data.hashName;
    return key;
  },
  download: async ({ axios, key }) => {
    const response = await axios.get(`/api/s3?object=${key}`);
    return response.data;
  },
};

const storageApiPlugin = {
  storageAPI,
};
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function handleMediaPlugin(element: any) {
  // element.axios = axios; TODO
  element.base64 = true;
  element.plugin = storageApiPlugin;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function handleSearchPlugin(element: any, config: MBElementConfig) {
  element.terminology =
    element?.terminology === 'local'
      ? config?.MB_VALUESET || 'local'
      : element?.terminology;
  const valueSetUri = element?.terminology?.includes('$expand?url=')
    ? element?.terminology.split('$expand?url=')[1]
    : element?.terminology;

  if (valueSetUri) {
    element.plugin = searchPluginFromValueSet;
  }
  // This check may not be needed.
  // Checks if the value set is configured in the server.
  // If not, then value set not found error is shown automatically.
  // axios
  //   .get(`/fhir/ValueSet/$expand?url=${valueSetUri}`)
  //   .then((res) => {
  //     element.plugin = searchPluginFromValueSet;
  //   })
  //   .catch(() => {
  //     element.errorMessage = "Failed to fetch Value set";
  //   });
}
const healthCareFacilityContextNode = {
  id: '_health_care_facility',
  name: '_health_care_facility',
  rmType: 'PARTY_PROXY',
  min: 1,
  max: 1,
  aqlPath: '/_health_care_facility',
  inputs: [
    {
      suffix: 'id',
      type: 'TEXT',
    },
    {
      suffix: 'id_scheme',
      type: 'TEXT',
    },
    {
      suffix: 'id_namespace',
      type: 'TEXT',
    },
    {
      suffix: 'name',
      type: 'TEXT',
    },
    {
      suffix: 'function',
      type: 'TEXT',
    },
    {
      suffix: 'mode',
      type: 'TEXT',
    },
  ],
  inContext: true,
};

const participationContextNode = {
  id: '_participation',
  name: '_participation',
  rmType: 'PARTY_PROXY',
  min: 1,
  max: 1,
  aqlPath: '/_participation',
  inputs: [
    {
      suffix: 'id',
      type: 'TEXT',
    },
    {
      suffix: 'id_scheme',
      type: 'TEXT',
    },
    {
      suffix: 'id_namespace',
      type: 'TEXT',
    },
    {
      suffix: 'name',
      type: 'TEXT',
    },
  ],
  inContext: true,
};

function removeNElementsFromArray(arr: string[], n: number) {
  arr.splice(0, n);
  return arr;
}

function encodeText(value: string) {
  const lt = /</g;
  const gt = />/g;
  const ap = /'/g;
  const ic = /"/g;
  const val = value
    ?.toString()
    .replace(lt, '&lt;')
    .replace(gt, '&gt;')
    .replace(ap, '&#39;')
    .replace(ic, '&#34;');
  return val;
}

function stripIndex(string: string) {
  const id: string[] = string?.split(':');
  id.pop();
  const elementId = id.join(':');
  return elementId;
}

const getDepthClass = (depth: number) => {
  const baseClasses = 'p-depth';
  switch (depth) {
    case 0:
      return `${baseClasses} bg-slate-700`;
    case 1:
      return `${baseClasses} bg-slate-600`;
    case 2:
      return `${baseClasses} bg-slate-500`;
    default:
      return `${baseClasses} bg-slate-400`;
  }
};

function generateNewId(currentId: string, baseIdPath: string): string {
  const baseIdArray = baseIdPath.split('/').filter(a => a);
  const relativeIdArray = removeNElementsFromArray(
    currentId.split('/'),
    baseIdArray.length
  );
  return [...baseIdArray, ...relativeIdArray].join('/');
}

function createRepeatableElement(path: string): string {
  return `<mb-repeatable-headless path=${stripIndex(path)} count="1" />`;
}

function createContextElement(path: string): string {
  return `<mb-context path=${path} />`;
}

function getDefaultTransform(node: ProcessedTree, index = 0): string {
  const results = transform(node);
  return results[index]?.html;
}

function prepareClonedDiv(divId: string, newId: string): HTMLElement {
  const referenceId = divId
    .replace(/:\d+/g, ':0')
    .replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  const referenceDiv = querySelectorAllDeep(`#${referenceId}`)[0] || null;
  const cloneDiv = referenceDiv.cloneNode(true) as HTMLElement;
  cloneDiv.classList.remove('hidden', 'reference');
  cloneDiv.id = newId;
  return cloneDiv;
}
function isMultipleInput(element: MBElement): boolean {
  return (
    element.tagName === 'MB-INPUT-MULTIPLE' ||
    element.tagName === 'TEXT-SELECT-MULTIPLE'
  );
}

function updateElementPath(element: MBElement, newId: string): void {
  if (element.isMbElement || element.isRepeatable) {
    element.path = isMultipleInput(element) ? newId.slice(0, -2) : newId;
  }
}

function handlePlugins(element: MBElement, config: MBElementConfig): void {
  const plugins = {
    'MB-SEARCH': () => handleSearchPlugin(element, config),
    'MB-SEARCH-MULTIPLE': () => handleSearchPlugin(element, config),
    'MB-MULTIMEDIA': () => handleMediaPlugin(element),
  };

  const handler = plugins[element.tagName as keyof typeof plugins];
  if (handler) handler();
}

function setupButtons(
  cloneDiv: HTMLElement,
  originalDiv: HTMLElement,
  config: MBElementConfig
): void {
  // all add buttons inside cloneDiv should have eventListeners attached
  const addButtons = cloneDiv.querySelectorAll('.addButton');
  for (const buttons of addButtons) {
    const parentNode = buttons?.parentNode?.parentNode as HTMLElement;
    addButtonEventListener(buttons, parentNode, config);
  }

  // configure delete button
  const deleteButtons = cloneDiv?.querySelectorAll('.deleteButton');
  // only need to remove hidden and add eventListener to the last delete button of the div
  const targetDeleteButton = deleteButtons[deleteButtons.length - 1];
  targetDeleteButton.classList.remove('hidden');
  deleteButtonEventListener(targetDeleteButton);

  // divbutton in the current div should be hidden.
  const currentDivButtons = originalDiv?.querySelectorAll('.divButton');
  const targetDivButton = currentDivButtons[currentDivButtons.length - 1];
  targetDivButton.classList.add('hidden');
}
function processChildDiv(
  childDiv: HTMLElement,
  baseIdPath: string,
  config: MBElementConfig
): void {
  childDiv.classList.remove('reference', 'hidden');

  // Update ID
  const newId = generateNewId(childDiv.id, baseIdPath);
  childDiv.id = newId;

  // Process first child element
  const firstChild = childDiv.children[0] as MBElement;
  if (firstChild) {
    updateElementPath(firstChild, newId);
    handlePlugins(firstChild, config);
  }
}

function processChildElements(
  cloneDiv: HTMLElement,
  baseId: string,
  config: MBElementConfig
): void {
  const childDivs = cloneDiv.querySelectorAll('div');
  const baseIdPath = `${baseId}/`;

  for (const childDiv of childDivs) {
    processChildDiv(childDiv as HTMLElement, baseIdPath, config);
  }
}

function deleteButtonEventListener(button: Element | null) {
  button?.addEventListener('click', e => {
    e.stopPropagation();
    // we should get the new id by reducing 1 from the index part of the div
    const currentNode = button.parentNode?.parentNode as HTMLElement;
    const splitArray = currentNode?.id?.split(':');
    const length = splitArray.length - 1;
    splitArray[length] = `${Number(splitArray[length]) - 1}`;
    const divId = splitArray.join(':');

    // get the number of div inside parent node whose is starts with id
    const children = currentNode?.parentNode?.children as HTMLCollection;
    const divsWithPrefix = Array.from(children).filter(
      child =>
        child.tagName.toLowerCase() === 'div' && child.id.startsWith(divId)
    );

    // remove the hidden class from previous divs divButton div
    const divButtons = divsWithPrefix[0].querySelectorAll('.divButton');
    const targetDivButton = divButtons[divButtons.length - 1];
    targetDivButton?.classList.remove('hidden');

    // remove the currrent node from parent div
    currentNode?.parentNode?.removeChild(currentNode);
  });
}

function treeChildrenPTag(tree: Tree, div: HTMLElement, depth: number) {
  // make p tag if the element is a context
  if (
    tree.rmType !== 'COMPOSITION' &&
    tree.rmType !== 'EVENT_CONTEXT' &&
    tree.rmType !== 'ISM_TRANSITION'
  ) {
    div.className = 'heading';
    if (tree.path.split('/').length === 2)
      div.className = `${div.className} margin-bottom-4 `;
    const p = document.createElement('p');
    p.className = getDepthClass(depth);
    p.innerHTML = encodeText(tree.name);
    div.appendChild(p);
  }
}

function noChildrenCondition(
  tree: Tree,
  div: HTMLElement,
  config: MBElementConfig
) {
  if (!tree.mbElement) return;
  if (!tree.inContext) div.classList.add('leaf-child');

  div.innerHTML = tree.mbElement;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const innerDiv = div.childNodes[0] as any;
  if (
    innerDiv?.tagName === 'MB-SEARCH' ||
    innerDiv?.tagName === 'MB-SEARCH-MULTIPLE'
  ) {
    handleSearchPlugin(innerDiv, config);
  }
  if (innerDiv?.tagName === 'MB-MULTIMEDIA') {
    handleMediaPlugin(innerDiv);
  }
  if (
    innerDiv?.tagName === 'MB-INPUT' &&
    config?.TEXT_AREA?.includes(innerDiv.path)
  )
    innerDiv.textarea = true;
}

function runAddEventListener(div: HTMLElement, config: MBElementConfig) {
  // need to split the last index number of the div id
  let elementId = stripIndex(div?.id);
  const children = div?.parentNode?.children as HTMLCollection;
  // get all the divs with elementId inside parentNode
  const divsWithPrefix = Array.from(children).filter(
    child =>
      child.tagName.toLowerCase() === 'div' &&
      child.id.startsWith(`${elementId}:`) &&
      child.className !== 'repeatables'
  );
  // set the new id with new index
  elementId = `${elementId}:${divsWithPrefix.length}`;

  const cloneDiv = prepareClonedDiv(div.id, elementId);

  processChildElements(cloneDiv, elementId, config);

  // when repeatable, replace the index in p tag with index + 1
  const pTag = cloneDiv.querySelector('p.label') as HTMLElement;
  const pTagArray = pTag?.textContent?.split('.') as string[];
  pTagArray[0] = `${divsWithPrefix?.length + 1}`;
  pTag.textContent = pTagArray.join(' . ');

  setupButtons(cloneDiv, div, config);
  // append the div after the parent div
  const parentNode = div?.parentNode as Element;
  parentNode?.insertBefore(cloneDiv, div.nextSibling);
}

function addMBRepeatables(tree: Tree, container: HTMLElement | null) {
  if (!tree?.path || !tree.mbElement || !container) return;
  // Create elements using DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  const newDiv = document.createElement('div');

  Object.assign(newDiv, {
    className: 'repeatables',
    id: stripIndex(encodeText(tree.path)),
    innerHTML: tree.mbElement,
  });

  fragment.appendChild(newDiv);
  container.appendChild(fragment);
}

function createRepeatableButtons(
  tree: Tree,
  div: HTMLDivElement,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  config: Record<string, any>
): HTMLDivElement {
  const addButton = document.createElement('sl-button');
  addButton.innerHTML = `+  ${tree.name}`;
  addButton.size = 'small';
  addButton.className = 'addButton';
  addButton.addEventListener('click', () => {
    runAddEventListener(div, config);
  });

  const deleteButton = document.createElement('sl-button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'deleteButton hidden';
  deleteButton.size = 'small';
  deleteButton.variant = 'neutral';

  const divButton = document.createElement('div');
  divButton.className = 'divButton flex justify-end';
  divButton.append(addButton, deleteButton);

  return divButton;
}

function addButtonEventListener(
  button: Element,
  div: HTMLElement,
  config: MBElementConfig
) {
  button?.addEventListener('click', () => {
    runAddEventListener(div, config);
  });
}

function traverse(
  tree: Tree,
  container: HTMLElement | null,
  document: Document,
  reference: boolean,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  config: Record<string, any>,
  depth = -1
) {
  if (!tree || !document) return;
  if (!tree.path || (!tree.children?.length && !tree.mbElement)) return;
  const fragment = document.createDocumentFragment();
  const div = fragment.appendChild(document.createElement('div'));

  div.id = encodeText(tree.path);

  if (tree.max === -1 && tree.children?.length) {
    addMBRepeatables(tree, container);
    treeChildrenPTag(tree, div, depth + 1);
    const pTag = div.querySelector('p') as Element;
    pTag?.classList.add('label');
    const index = div.id.split(':').pop() || 0;
    pTag.innerHTML = `${Number(index) + 1} . ${encodeText(tree.name)}`;

    for (const child of tree.children || []) {
      traverse(child, div, document, reference, config, depth + 1);
    }

    div.append(createRepeatableButtons(tree, div, config));
  } else if (tree.children?.length) {
    treeChildrenPTag(tree, div, depth + 1);
    for (const child of tree.children || []) {
      traverse(child, div, document, reference, config, depth + 1);
    }
  } else noChildrenCondition(tree, div, config);

  if (reference)
    div.className = `${encodeText(div.className)} reference hidden`;
  container?.appendChild(fragment);
}

function handleLeafNode(node: ProcessedTree): void {
  if (node.inContext) {
    node.mbElement = getDefaultTransform(node);
  } else if (node.rmType === 'DV_CODED_TEXT') {
    const lists = node.inputs.find(input => input.suffix === 'code')?.list;
    if (lists?.length) {
      if (lists.length <= 3)
        node.mbElement = getDefaultTransform(node, 1); // butons
      else node.mbElement = getDefaultTransform(node); // select
    } else node.mbElement = getDefaultTransform(node, 2); // search
  } else if (node?.path?.endsWith('expiry_time')) {
    node.mbElement = createContextElement(node.path);
  } else node.mbElement = getDefaultTransform(node);
}

function addIgniteContext(node: Tree): Tree {
  const contextNode = node?.children?.find(n => n?.id === 'context') as Tree;
  contextNode?.children?.push(healthCareFacilityContextNode);
  contextNode?.children?.push(participationContextNode);
  return node;
}

function addPathToChildren(node: Tree, parentPath = ''): ProcessedTree {
  node.path = parentPath === '' ? node?.id : `${parentPath}/${node?.id}`;
  if (node?.max === -1) node.path += ':0';
  if (node?.children)
    for (const child of node.children) {
      addPathToChildren(child, `${node?.path}`);
    }
  return node as ProcessedTree;
}
function handleNodeWithChildren(node: ProcessedTree): void {
  const children = node.children as Tree[];
  if (node.max === -1) {
    node.mbElement = createRepeatableElement(node.path);
  }
  for (const child of children) {
    addMbElements(child as ProcessedTree);
  }
}
function addMbElements(node: ProcessedTree) {
  if (!node) return node;
  if (node?.children?.length) {
    handleNodeWithChildren(node);
  } else handleLeafNode(node);
  return node;
}
function createAutoFormTree(webTemplate: Tree, addContext = false) {
  const baseTree = webTemplate?.tree;
  const treeWithContext = addContext ? addIgniteContext(baseTree) : baseTree;
  const treeWithPaths = addPathToChildren(treeWithContext, '');
  return addMbElements(treeWithPaths);
}

export function createAutoFormByTemplateId(
  config: MBElementConfig,
  webTemplate: Tree,
  addContext = false
): void {
  const container = querySelectorDeep('#autoForm');
  const newTree = createAutoFormTree(webTemplate, addContext);
  if (container) container.innerHTML = '';
  traverse(newTree, container, document, true, config); // this is for preserving the webTemplate as it is. Hidden in DOM
  traverse(newTree, container, document, false, config); // Rendered in UI
}

export function bindRepeatables(
  mbRepeatables: Element[],
  repeatableArray: Element[],
  formNode: Element,
  composition: MBComposition,
  config: MBElementConfig
) {
  for (const repeatable of repeatableArray) {
    const path = (repeatable as MBElement).path as string;
    const countIndex = count(composition, path);
    const parentNode = repeatable.parentNode?.parentNode as Element;
    for (let j = 1; j < countIndex; j++) {
      requestAnimationFrame(() => {
        const divsWithPrefix = Array.from(parentNode?.children).filter(
          child =>
            child.tagName.toLowerCase() === 'div' &&
            child.id.startsWith(path) &&
            child.className !== 'repeatables'
        );
        const targetDiv = divsWithPrefix[divsWithPrefix.length - 1];
        const addButtons = targetDiv?.querySelectorAll(
          '.addButton'
        ) as NodeListOf<Element>;
        const targetAddButton = addButtons?.[
          addButtons?.length - 1
        ] as HTMLButtonElement;
        const buttonParentNode = targetAddButton?.parentNode
          ?.parentNode as HTMLElement;
        runAddEventListener(buttonParentNode, config);
      });
    }
  }
  requestAnimationFrame(() => {
    const newMbRepeatables = formNode?.querySelectorAll(
      'mb-repeatable-headless'
    );
    const oldMbRepeatables = new Set([...repeatableArray, ...mbRepeatables]);
    const newArray = Array.from(newMbRepeatables || []).filter(
      (item: MBElement) =>
        !Array.from(oldMbRepeatables).some(
          (ele: MBElement) => item.path === ele.path
        )
    );
    if (newArray.length)
      bindRepeatables(
        Array.from(oldMbRepeatables),
        newArray,
        formNode,
        composition,
        config
      );
  });
}
