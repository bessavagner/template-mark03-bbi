export const formElementsTag = [
  "input",
  "select",
  "textarea",
  "button",
  "label",
  "fieldset",
  "legend",
  "datalist",
  "optgroup",
  "option",
  "output",
];

export const inputTypes = [
  "text",
  "password",
  "email",
  "number",
  "date",
  "time",
  "datetime-local",
  "month",
  "week",
  "url",
  "tel",
  "search",
  "color",
  "checkbox",
  "radio",
  "file",
];

export const scheduleFormElements = [
  {
    tagName: "input",
    renderOptions: {
      type: "text",
      name: "nomeSobrenome",
      required: true,
      label: {
        text: "Nome e Sobrenome",
        for: "nomeSobrenome",
      },
    },
    options: {
      classList: "flex flex-col w-full",
      inputClassList: "input w-full",
      labelClassList: "label ml-2",
    },
  },
  {
    FieldsContainer: {
        options: {
            tagName: "div",
            classList: "flex flex-row w-full",
        },
        renderOptions: {
            fields: [
                {
                    tagName: "input",
                    renderOptions: {
                        type: "email",
                        name: "email",
                        required: true,
                        label: {
                            text: "E-mail",
                            for: "email",
                        },
                    },
                    options: {
                        classList: "flex flex-col w-full",
                        inputClassList: "input w-full",
                        labelClassList: "label ml-2",
                    },
                },
                {
                    tagName: "input",
                    renderOptions: {
                        type: "tel",
                        name: "telefone",
                        required: true,
                        label: {
                            text: "Telefone",
                            for: "telefone",
                        },
                    },
                    options: {
                        classList: "flex flex-col w-full",
                        inputClassList: "input w-full",
                        labelClassList: "label ml-2",
                    },
                },
            ],
        }
    },
  },
];
