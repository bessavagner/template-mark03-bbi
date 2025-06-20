export const formElementsTag = [
  'input',
  'select',
  'textarea',
  'button',
  'label',
  'fieldset',
  'legend',
  'datalist',
  'optgroup',
  'option',
  'output',
];

export const inputTypes = [
  'text',
  'password',
  'email',
  'number',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
  'url',
  'tel',
  'search',
  'color',
  'checkbox',
  'radio',
  'file',
];

export const scheduleFormElements = [
    {
        tagName: 'input',
        renderOptions: {
            type: 'text',
            name: 'nomeSobrenome',
            placeholder: 'Nome e Sobrenome',
            required: true,
        },
        options: {
            classList: 'input',
        },
    },]