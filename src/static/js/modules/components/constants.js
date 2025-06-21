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
        classList: "flex flex-row w-full gap-4 my-4",
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
      },
    },
  },
  {
    FieldsContainer: {
      options: {
        tagName: "div",
        classList: "flex flex-row w-full gap-4 my-4",
      },
      renderOptions: {
        fields: [
          {
            tagName: "input",
            renderOptions: {
              type: "date",
              name: "data",
              required: true,
              label: {
                text: "Data do treino",
                for: "data",
              },
            },
            options: {
              classList: "flex flex-col w-full",
              inputClassList: "input w-full",
              labelClassList: "label ml-2",
            },
          },
          {
            tagName: "select",
            renderOptions: {
              name: "horario",
              required: true,
              label: {
                text: "Horário",
                for: "horario",
              },
              options: [
                { value: "5:30", text: "5:30" },
                { value: "6:30", text: "6:30" },
                { value: "7:30", text: "7:30" },
                { value: "16:30", text: "16:30" },
                { value: "18:00", text: "18:00" },
                { value: "19:00", text: "19:00" },
              ],
            },
            options: {
              classList: "flex flex-col w-full",
              selectClassList: "select w-full",
              labelClassList: "label ml-2",
            },
          },
        ],
      },
    },
  },
  {
    tagName: "button",
    options: {
      type: "submit",
      classList: "btn btn-primary w-64 self-end text-lg font-bold mt-4 shadow-neon hover:btn-success hover:shadow-neon-success",
    },
    renderOptions: {
      text: "Agendar",
    },
  },
];

