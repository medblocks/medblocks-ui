export interface Tree {
  id: string;
  name: string;
  min: number;
  max: number;
  aqlPath: string;
  rmType: string;
  localizedName?: string;
  nodeID?: string;
  inContext?: boolean;
  localizedNames?: {
    [key: string]: string;
  };
  localizedDescriptions?: {
    [key: string]: string;
  };
  annotations?: {
    [key: string]: string;
  };
  proportionTypes?: string[];
  children?: Tree[];
  inputs: {
    type: string;
    suffix?: string;
    validation?: {
      range: MinMax;
      precision: MinMax;
    };
    list?: ListItem[];
    defaultValue?: string;
    terminology?: string;
  }[];
  [other: string]: any;
  // Added
  runtimeRegex?: string;
  regex?: string;
  snippet?: string;
  context?: string;
  status?: 'present' | 'optionalAbsent' | 'mandatoryAbsent' | 'allPresent';
}

type Operations = '>=' | '<=' | '>' | '<' | '=';
interface MinMax {
  minOp: Operations;
  min: number;
  maxOp: Operations;
  max: number;
}

interface ListItem {
  value: string;
  label: string;
  validation?:{
    range: MinMax;
  };
  ordinal?: number;
}
export interface ProcessedTree extends Tree {
  path: string;
}

export type TransformFunction = (
  leaf: ProcessedTree
) => { html: string; name: string }[];

const transformations: { [rmType: string]: TransformFunction } = {
  DV_QUANTITY: n => [
    {
      name: 'Quantity',
      html: `<mb-quantity default="${
        n?.inputs?.[1]?.list?.[0]?.value || ''
      }" path="${n.path}" label="${n.name}">
                  ${
                    n.inputs && n.inputs[1] && n.inputs[1].list
                      ? n.inputs[1].list
                          .map(
                            unit =>
                              `<mb-unit unit="${unit?.value}" label="${unit?.label || ''}" min="${unit?.validation?.range?.min || ''}" max="${unit?.validation?.range?.max || ''}"></mb-unit>`
                          )
                          .join('\n')
                      : ''
                  }
              </mb-quantity>`,
    },
  ],
  DV_CODED_TEXT: n => [
    {
      name: 'Select',
      html: `<mb-select path="${n.path}" label="${n.name || ''}" terminology="${
        n.inputs[0].terminology || "local"
      }">
              ${
                n.inputs && n.inputs[0] && n.inputs[0].list
                  ? n.inputs[0].list
                      .map(
                        option =>
                          `<mb-option value="${option.value}" label="${option.label}"></mb-option>`
                      )
                      .join('\n')
                  : ''
              }
            </mb-select>`,
    },
    {
      name: 'Buttons',
      html: `<mb-buttons path="${n.path}" label="${
        n.name || ''
      }" terminology="${n.inputs[0].terminology || "local"}">
        ${
          n.inputs && n.inputs[0] && n.inputs[0].list
            ? n.inputs[0].list
                .map(
                  option =>
                    `<mb-option value="${option.value}" label="${option.label}"></mb-option>`
                )
                .join('\n')
            : ''
        }
        </mb-buttons>`,
    },
    {
      name: 'Search',
      html: `<mb-search path="${n.path}" label="${n.name || ''}" terminology="${
        n.inputs[0].terminology|| "local"
      }">
          <mb-filter label="Conditions" value="404684003"></mb-filter>
        </mb-search>`,
    },
    {
      name: 'Search-Multiple',
      html: `<mb-search-multiple path="${n.path}" label="${n.name || ''}" terminology="${
        n.inputs[0].terminology|| "local"
      }">
          <mb-filter label="Conditions" value="404684003"></mb-filter>
        </mb-search>`,
    },
  ],
  DV_COUNT: n => [
    {
      name: 'Count',
      html: `<mb-count path="${n.path}" label="${
        n.name || ''
      }"></mb-count>`,
    },
  ],
  DV_PROPORTION:


  n => [
    ...(n.proportionTypes?.some((props: any) => props === 'percent')
      ? [
          {
            name: 'Percent',
            html: `<mb-proportion path="${n.path}" label="${n.name || ''}" min="0" max="100" step="1" type="percent"></mb-proportion>`,
          },
        ]
      : []),
    ...(n.proportionTypes?.some((props: any) => props === 'unitary')
      ? [
          {
            name: 'Unitary',
            html: `<mb-proportion path="${n.path}" label="${n.name || ''}" min="0" max="1" step="0.01"></mb-proportion>`,
          },
        ]
      : []),
    // {
    //   name: 'Mb-Percent',
    //   html: `<mb-proportion path="${n.path}" label="${n.name || ''}" ></mb-proportion>`,
    // },
  ],
  DV_TEXT: n => [
    {
      name: 'Input',
      html: `<mb-input path="${n.path}" label="${n.name || ''}"></mb-input>`,
    },
    {
      name: 'Textarea',
      html: `<mb-input textarea path="${n.path}" label="${
        n.name || ''
      }"></mb-input>`,
    },
    {
      name: 'Text-Select',
      html: `<mb-text-select path="${n.path}" label="${n.name || ''}">
              ${
                n.inputs && n.inputs[0] && n.inputs[0].list
                  ? n.inputs[0].list
                      .map(
                        option =>
                          `<mb-option value="${option.value}" label="${option.label}"></mb-option>`
                      )
                      .join('\n')
                  : ''
              }
            </mb-text-select>`,
    },
    {
      name: 'Input-Multiple',
      html: `<mb-input-multiple path="${n.path.slice(
        0,
        n.path.length - 2
      )}" label="${n.name || ''}"></mb-input-multiple>`,
    },
    {
      name: 'Text-Select-Multiple',
      html: `<mb-text-select multiple path="${n.path.slice(
        0,
        n.path.length - 2
      )}" label="${n.name || ''}">
        ${
          n.inputs && n.inputs[0] && n.inputs[0].list
            ? n.inputs[0].list
                .map(
                  option =>
                    `<mb-option value="${option.value}" label="${option.label}"></mb-option>`
                )
                .join('\n')
            : ''
        }
      </mb-text-select>`,
    },
  
  ],
  DV_DURATION: n => [
    {
      name: 'Duration',
      html: `<mb-duration year month hour path="${n.path}" label="${
        n.name || ''
      }"></mb-duration>`,
    },
  ],
  DV_DATE_TIME: n => [
    {
      name: 'Date & Time',
      html: `<mb-date time path="${n.path}" label="${n.name || ''}"></mb-date>`,
    },
    {
      name: 'Date',
      html: `<mb-date path="${n.path}" label="${n.name || ''}"></mb-date>`,
    },
  ],
  DV_DATE: n => [
    {
      name: 'Date',
      html: `<mb-date path="${n.path}" label="${n.name || ''}"></mb-date>`,
    },
  ],
  DV_BOOLEAN: n => [
    {
      name: 'Boolean',
      html: `<mb-checkbox path="${n.path}" label="${
        n.name || ''
      }"></mb-checkbox>`,
    },
  ],
  DV_ORDINAL: n => [
    {
      name: 'Ordinal',
      html: `<mb-select path="${n.path}" label="${n.name || ''}" terminology="${
        n.inputs[0].terminology
      }">
        ${
          n.inputs && n.inputs[0] && n.inputs[0].list
            ? n.inputs[0].list
                .map(
                  option =>
                    `<mb-option value="${option.value}" label="${option.label}" ordinal="${option.ordinal}" ></mb-option>`
                )
                .join('\n')
            : ''
        }</mb-select>`,
    },
    {
      name: 'Buttons',
      html: `<mb-buttons path="${n.path}" label="${n.name || ''}">
        ${
          n.inputs && n.inputs[0] && n.inputs[0].list
            ? n.inputs[0].list
                .map(
                  option =>
                    `<mb-option value="${option.value}" label="${option.label}" ordinal="${option.ordinal}"></mb-option>`
                )
                .join('\n')
            : ''
        }
        </mb-buttons>`,
    },
  ],

  context: n => [
    { name: 'Context', html: `<mb-context path="${n.path}"></mb-context>` },
  ],
};

export default (leaf: ProcessedTree) => {
  if (leaf['inContext']) {
    return transformations['context'](leaf);
  }
  const fn = transformations[leaf.rmType];
  if (fn) {
    const nodes = fn(leaf);
    return nodes;
  }
  return [];
};
