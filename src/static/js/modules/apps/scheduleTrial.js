import { Component } from "../engine/core.js";
import { Button } from "../components/actions.js";
import { Form } from "../components/forms.js";

import {
  LabeledInput,
  LabeledSelect,
  FieldsContainer,
} from "../components/fields.js";

class ScheduleForm extends Form {
  constructor(classList = null) {
    super(
      classList ||
        "flex flex-col items-center w-full bg-base-300 shadow-lg rounded-lg p-6"
    );
    this.addField(
      "nomeSobrenome",
      LabeledInput,
      {
        classList: "flex flex-col w-full",
        inputClassList: "input w-full",
        labelClassList: "label ml-2",
      },
      {
        type: "text",
        name: "nomeSobrenome",
        id: "nomeSobrenome",
        required: true,
        label: {
          text: "Nome e Sobrenome",
          for: "nomeSobrenome",
        },
      }
    );
    this.addRenderedField(
      "emailTelefone",
      new FieldsContainer({
        tagName: "div",
        classList: "grid grid-cols-2 gap-4 w-full my-2",
      })
        .addField(
          "email",
          LabeledInput,
          {
            classList: "flex flex-col w-full",
            inputClassList: "input w-full",
            labelClassList: "label ml-2",
          },
          {
            type: "email",
            id: "email",
            required: true,
            label: {
              text: "E-mail",
              for: "email",
            },
          }
        )
        .addField(
          "telefone",
          LabeledInput,
          {
            classList: "flex flex-col w-full",
            inputClassList: "input w-full",
            labelClassList: "label ml-2",
          },
          {
            type: "tel",
            id: "telefone",
            required: true,
            label: {
              text: "Telefone",
              for: "telefone",
            },
          }
        )
        .renderContent()
    );

    // Campo: Data
    const today = new Date().toISOString().split("T")[0];
    this.addRenderedField(
      "dataHorario",
      new FieldsContainer({
        tagName: "div",
        classList: "grid grid-cols-2 gap-4 w-full my-2",
      })
        .addField(
          "data",
          LabeledInput,
          {
            classList: "flex flex-col w-full",
            inputClassList: "input w-full",
            labelClassList: "label ml-2",
          },
          {
            type: "date",
            id: "data",
            required: true,
            label: {
              text: "Data do treino",
              for: "data",
            },
            attributes: {
              min: today,
              value: today,
            },
          }
        )
        .addField(
          "horario",
          LabeledSelect,
          {
            classList: "flex flex-col w-full",
            selectClassList: "select w-full",
            labelClassList: "label ml-2",
          },
          {
            id: "horario",
            required: true,
            label: {
              text: "Horário",
              for: "horario",
            },
            options: [
              { value: "-1", text: "--" },
              { value: "5:30", text: "5:30" },
              { value: "6:30", text: "6:30" },
              { value: "7:30", text: "7:30" },
              { value: "16:30", text: "16:30" },
              { value: "18:00", text: "18:00" },
              { value: "19:00", text: "19:00" },
            ],
          }
        )
        .renderContent()
    );
    // Botão de envio
    this.addField(
      "submitButton",
      Button,
      {
        classList:
          "btn btn-primary w-64 self-end text-lg font-bold mt-4 shadow-neon hover:btn-success hover:shadow-neon-success",
      },
      {
        text: "Agendar",
        attributes: { type: "submit" },
      }
    );
  }
  getFormData() {
    const data = super.getFormData();
    console.log(data);
    return {
      "nome_sobrenome": data.nomeSobrenome,
      "email": data["emailTelefone.email"],
      "telefone": data["emailTelefone.telefone"],
      "data": data["dataHorario.data"],
      "horario": data["dataHorario.horario"],
    }
  }
  async handleSubmit(event) {
    event.preventDefault();
    const data = this.getFormData();
    try {
      console.log(data);
      const response = await fetch("/schedule-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.popup) {
        // Aqui você chamaria um componente ou utilitário que exibe popups
        console.log(result.popup); // você implementará `showPopup`
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  }
}

export class ScheduleFormApp extends Component {
  constructor() {
    super(
      "div",
      "flex flex-col items-center container mx-auto px-4 py-8 w-11/12 md:w-1/2 h-full"
    );
    this.form = new ScheduleForm();
  }
  renderContent() {
    this.form.renderContent();
  }
  init(target) {
    this.render({ target });
    this.renderContent();
    this.form.render({ target: this.element });
    this.form.init();
  }
}
